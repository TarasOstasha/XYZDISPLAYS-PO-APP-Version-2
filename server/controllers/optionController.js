const createHttpError = require('http-errors');
const { parse } = require("csv-parse/sync");
const fs = require("fs");
const path = require("path");

const OPTIONS_DATA_PATH = path.join(
  __dirname,
  "../../client/src/utils/optionsData.js"
);

const loadOptionsData = () => {
  const fileContent = fs.readFileSync(OPTIONS_DATA_PATH, "utf-8");
  const match = fileContent.match(
    /export\s+const\s+OPTION_DATA\s*=\s*(\[[\s\S]*\])\s*;?\s*$/
  );
  if (!match) {
    throw createHttpError(500, "Could not parse optionsData.js");
  }

  // optionsData.js may contain trailing commas (valid JS, invalid JSON)
  const jsonText = match[1].replace(/,\s*([\]}])/g, "$1");
  return JSON.parse(jsonText);
};

const csvEscape = (value) => {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const buildSideNote = (opt) => {
  const parts = [];
  if (opt.quantity != null && opt.quantity !== "") parts.push(`q=${opt.quantity}`);
  if (opt.ProductCode != null && opt.ProductCode !== "") {
    parts.push(`sku=${opt.ProductCode}`);
  }
  if (opt.discount != null && opt.discount !== "") parts.push(`disc=${opt.discount}`);
  if (opt.Vendor_PartNo != null && opt.Vendor_PartNo !== "") {
    parts.push(`vendor=${opt.Vendor_PartNo}`);
  }
  return parts.join("|");
};

const optionsToCsv = (optionsArray) => {
  const header = [
    "id",
    "optioncatid",
    "optionsdesc",
    "pricediff",
    "vendorpricediff",
    "optionsdesc_sidenote",
  ];

  const rows = optionsArray.map((opt) => {
    return [
      opt.id ?? "",
      opt.optioncatid ?? "",
      opt.ProductName ?? "",
      opt.pricediff ?? 0,
      opt.vendorpricediff ?? 0,
      buildSideNote(opt),
    ]
      .map(csvEscape)
      .join(",");
  });

  return [header.join(","), ...rows].join("\n");
};

module.exports.exportOptions = async (req, res, next) => {
  try {
    const optionsArray = loadOptionsData();

    if (!Array.isArray(optionsArray) || !optionsArray.length) {
      throw createHttpError(404, "No options found");
    }

    const csv = optionsToCsv(optionsArray);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="optionsData.csv"'
    );
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports.saveOption = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, "CSV file is required (field name: file)");
    }

    const csvText = req.file.buffer.toString("utf-8");

    const records = parse(csvText, {
      columns: true,          
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    if (!records.length) {
      throw createHttpError(400, "CSV is empty");
    }

    // Validate exact CSV columns
    const required = [
      "id",
      "optioncatid",
      "optionsdesc",
      "pricediff",
      "vendorpricediff",
      "optionsdesc_sidenote",
    ];
    const fields = Object.keys(records[0] || {}).map((k) =>
      String(k).trim().toLowerCase()
    );
    const missing = required.filter((k) => !fields.includes(k));
    const unexpected = fields.filter((k) => !required.includes(k));
    if (missing.length || unexpected.length) {
      const parts = [];
      if (missing.length) parts.push(`Missing columns: ${missing.join(", ")}`);
      if (unexpected.length) {
        parts.push(`Unexpected columns: ${unexpected.join(", ")}`);
      }
      parts.push(`Expected: ${required.join(", ")}`);
      throw createHttpError(400, parts.join(". "));
    }

    // Debug
    console.log("Uploaded:", {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    });




    return res.status(201).json({ message: "File received", size: req.file.size });
  } catch (error) {
    next(error);
  }
};

module.exports.saveOptionsFile = async (req, res, next) => {
  try {
    const optionsArray = req.body;

    if (!Array.isArray(optionsArray)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const fileContent = `export const OPTION_DATA = ${JSON.stringify(
      optionsArray,
      null,
      2
    )};\n`;

    fs.writeFileSync(OPTIONS_DATA_PATH, fileContent, "utf-8");

    res.json({ message: "optionsData.js updated successfully" });

  } catch (error) {
    next(error);
  }
};
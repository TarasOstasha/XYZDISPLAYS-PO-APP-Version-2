
const createHttpError = require('http-errors');
const { parse } = require("csv-parse/sync");
const fs = require("fs");
const path = require("path");

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

    // Validate required columns
    const required = [
      "id",
      "optioncatid",
      "optionsdesc",
      "pricediff",
      "vendorpricediff",
      "optionsdesc_sidenote",
    ];
    const missing = required.filter((k) => !(k in records[0]));
    if (missing.length) {
      throw createHttpError(400, `Missing CSV columns: ${missing.join(", ")}`);
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

    const filePath = path.join(
      __dirname,
      "../../client/src/utils/optionsData.js"
    );

    const fileContent = `export const OPTION_DATA = ${JSON.stringify(
      optionsArray,
      null,
      2
    )};\n`;

    fs.writeFileSync(filePath, fileContent, "utf-8");

    res.json({ message: "optionsData.js updated successfully" });

  } catch (error) {
    next(error);
  }
};
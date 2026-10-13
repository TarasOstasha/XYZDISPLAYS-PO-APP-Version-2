import Papa from "papaparse";
import { parseSideNote } from "./parseSideNote";

export const REQUIRED_CSV_COLUMNS = [
  "id",
  "optioncatid",
  "optionsdesc",
  "pricediff",
  "vendorpricediff",
  "optionsdesc_sidenote",
];

const normalizeOption = (opt) => {
  const { vendorppricediff, ...rest } = opt;
  return {
    ...rest,
    vendorpricediff: rest.vendorpricediff ?? vendorppricediff ?? 0,
  };
};

export const parseCsvFile = (file) =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      transform: (v) => (typeof v === "string" ? v.trim() : v),
      complete: (results) => {
        const fields = (results.meta.fields || [])
          .map((f) => String(f || "").trim().toLowerCase())
          .filter(Boolean);

        const missing = REQUIRED_CSV_COLUMNS.filter((c) => !fields.includes(c));
        const unexpected = fields.filter(
          (c) => !REQUIRED_CSV_COLUMNS.includes(c)
        );

        if (missing.length || unexpected.length) {
          const parts = [];
          if (missing.length) {
            parts.push(`Missing columns: ${missing.join(", ")}`);
          }
          if (unexpected.length) {
            parts.push(`Unexpected columns: ${unexpected.join(", ")}`);
          }
          parts.push(`Expected: ${REQUIRED_CSV_COLUMNS.join(", ")}`);
          reject(new Error(parts.join(". ")));
          return;
        }

        resolve(results.data);
      },
      error: (err) => reject(err),
    });
  });

export const mergeOptionsFromCsv = (existingOptions, csvRows) => {
  const patchById = new Map();

  for (const r of csvRows) {
    const id = Number(r.id);
    if (!Number.isFinite(id)) continue;

    const optioncatid = r.optioncatid !== "" ? Number(r.optioncatid) : null;
    const pricediff = r.pricediff !== "" ? Number(r.pricediff) : 0;
    const vendorpricediff =
      r.vendorpricediff !== "" ? Number(r.vendorpricediff) : 0;

    const meta = parseSideNote(r.optionsdesc_sidenote);

    const patch = {
      id,
      optioncatid,
      quantity: meta.q !== undefined ? Number(meta.q) : undefined,
      ProductCode: meta.sku ?? undefined,
      Vendor_PartNo: meta.vendor ?? undefined,
      pricediff,
      vendorpricediff,
      discount: meta.disc !== undefined ? Number(meta.disc) : undefined,
      ProductName: r.optionsdesc ?? undefined,
    };

    patchById.set(id, patch);
  }

  const merged = existingOptions.map((opt) => {
    const normalized = normalizeOption(opt);
    const patch = patchById.get(Number(normalized.id));
    if (!patch) return normalized;

    return {
      ...normalized,
      id: patch.id,
      optioncatid: patch.optioncatid ?? normalized.optioncatid,
      ...(patch.quantity !== undefined ? { quantity: patch.quantity } : {}),
      ...(patch.ProductCode !== undefined
        ? { ProductCode: patch.ProductCode }
        : {}),
      ...(patch.Vendor_PartNo !== undefined
        ? { Vendor_PartNo: patch.Vendor_PartNo }
        : {}),
      ...(patch.discount !== undefined ? { discount: patch.discount } : {}),
      pricediff: patch.pricediff,
      vendorpricediff: patch.vendorpricediff,
      ...(patch.ProductName !== undefined
        ? { ProductName: patch.ProductName }
        : {}),
    };
  });

  const existingIds = new Set(existingOptions.map((o) => Number(o.id)));

  const newOnes = [];
  for (const [id, patch] of patchById.entries()) {
    if (existingIds.has(id)) continue;

    newOnes.push({
      id: patch.id,
      optioncatid: patch.optioncatid ?? null,
      ProductName: patch.ProductName ?? "",
      quantity: patch.quantity ?? 1,
      ProductCode: patch.ProductCode ?? "option",
      Vendor_PartNo: patch.Vendor_PartNo ?? "manually",
      pricediff: patch.pricediff ?? 0,
      vendorpricediff: patch.vendorpricediff ?? 0,
      discount: patch.discount ?? 0,
    });
  }

  return [...merged, ...newOnes];
};

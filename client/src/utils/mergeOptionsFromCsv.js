import Papa from "papaparse";
import { parseSideNote } from "./parseSideNote"; 

export const parseCsvFile = (file) =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      transform: (v) => (typeof v === "string" ? v.trim() : v),
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });

export const mergeOptionsFromCsv = (existingOptions, csvRows) => {
  // Build patches by id from CSV
  const patchById = new Map();

  for (const r of csvRows) {
    const id = Number(r.id);
    if (!Number.isFinite(id)) continue;

    const optioncatid = r.optioncatid !== "" ? Number(r.optioncatid) : null;
    const pricediff = r.pricediff !== "" ? Number(r.pricediff) : 0;
    const vendorpricediff = r.vendorpricediff !== "" ? Number(r.vendorpricediff) : 0;

    const meta = parseSideNote(r.optionsdesc_sidenote);

    // Your exact mapping:
    const patch = {
      id,
      optioncatid,
      quantity: meta.q !== undefined ? Number(meta.q) : undefined,
      ProductCode: meta.sku ?? undefined,
      Vendor_PartNo: meta.vendor ?? undefined,
      pricediff,
      vendorppricediff: vendorpricediff, // you asked for this name
      discount: meta.disc !== undefined ? Number(meta.disc) : undefined,
      // keep original optionsdesc if you want:
      ProductName: r.optionsdesc ?? undefined,
    };

    patchById.set(id, patch);
  }

  // Update existing options
  const merged = existingOptions.map((opt) => {
    const patch = patchById.get(Number(opt.id));
    if (!patch) return opt;

    return {
      ...opt,
      id: patch.id,
      optioncatid: patch.optioncatid ?? opt.optioncatid,

      // update only if present in CSV
      ...(patch.quantity !== undefined ? { quantity: patch.quantity } : {}),
      ...(patch.ProductCode !== undefined ? { ProductCode: patch.ProductCode } : {}),
      ...(patch.Vendor_PartNo !== undefined ? { Vendor_PartNo: patch.Vendor_PartNo } : {}),
      ...(patch.discount !== undefined ? { discount: patch.discount } : {}),

      // always update price diffs if CSV row exists
      pricediff: patch.pricediff,
      vendorppricediff: patch.vendorppricediff,

      // optional: update name from optionsdesc
      ...(patch.ProductName !== undefined ? { ProductName: patch.ProductName } : {}),
    };
  });

  // Add new options that were not in existingOptions
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
      vendorppricediff: patch.vendorppricediff ?? 0,

      discount: patch.discount ?? 0,
    });
  }

  return [...merged, ...newOnes];
};
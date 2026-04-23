export const parseSideNote = (sideNote) => {
  if (!sideNote || typeof sideNote !== "string") return {};

  // "q=1|sku=bn03485|disc=15|vendor=ca605"
  return sideNote.split("|").reduce((acc, part) => {
    const [rawKey, ...rest] = part.split("=");
    if (!rawKey) return acc;

    const key = rawKey.trim();
    const value = rest.join("=").trim(); // just in case value contains "="

    if (!key) return acc;
    acc[key] = value;

    return acc;
  }, {});
};
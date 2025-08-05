export function calcMetaQuality(record: Record<string, unknown>): string {
  const entries = Object.entries(record);
  
  const skipKeys = ["title", "description", "image", "tags"];

  const relevant = entries.filter(([k]) => !skipKeys.includes(k));
  const total    = relevant.length;

  const filled   = relevant.filter(([, v]) => {
    if (typeof v === "string")  return v.trim().length > 0;
    if (typeof v === "boolean") return true;
    if (Array.isArray(v))       return v.length > 0;
    if (typeof v === "number")  return true;
    return false; // null, undefined, object → als leer werten
  }).length;

  const percent = Math.round((filled / total) * 100);
  return `${percent}%`;
}

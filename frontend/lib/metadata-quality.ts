import type { AppDoc } from "./types";

const FIELD_WEIGHTS: Array<[keyof AppDoc | string, number]> = [
  ["heroImage", 2],
  ["shortDescription", 1],
  ["longDescription", 1],
  ["category", 1],
  ["tags", 1],
  ["city", 1],
  ["publishDate", 1],
  ["latestRelease", 1],
  ["publishInformation", 1],
  ["links.website", 1],
  ["links.appleAppStore", 1],
  ["links.googlePlay", 1],
  ["links.github", 1],
  ["links.api", 1],
  ["contact.publisherMail", 1],
  ["contact.supportMail", 1],
];

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "boolean") return true;
  if (typeof value === "number") return true;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return false;
}

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

export function calculateQuality(app: AppDoc): number {
  if (app.metadataQualityOverride != null) {
    return Math.max(0, Math.min(100, app.metadataQualityOverride));
  }
  let totalWeight = 0;
  let filledWeight = 0;
  for (const [path, weight] of FIELD_WEIGHTS) {
    totalWeight += weight;
    if (hasValue(getPath(app as unknown as Record<string, unknown>, path as string))) {
      filledWeight += weight;
    }
  }
  if (totalWeight === 0) return 0;
  return Math.round((filledWeight / totalWeight) * 100);
}

export function qualityLabel(percent: number): {
  label: string;
  tone: "high" | "mid" | "low";
} {
  if (percent >= 80) return { label: "Vollständig", tone: "high" };
  if (percent >= 50) return { label: "Gut dokumentiert", tone: "mid" };
  return { label: "Basis", tone: "low" };
}

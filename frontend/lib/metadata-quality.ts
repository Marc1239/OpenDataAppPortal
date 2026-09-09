import type { AppDoc } from "./types";
import { richTextToText } from "./rich-text";

function hasText(value: unknown): boolean {
  return typeof value === "string"
    && value.replace(/[\u200b\u200c\u200d\u2060\ufeff]/g, "").trim().length > 0;
}

function hasReference(value: unknown): boolean {
  if (hasText(value)) return true;
  return value !== null && typeof value === "object"
    && "id" in value && hasText(value.id);
}

export function calculateQuality(app: AppDoc): number {
  // Five equally weighted description fields, applicable across app platforms.
  // Optional resources and platform links do not change the denominator.
  const occupied = [
    hasText(app.title),
    hasText(app.shortDescription),
    hasText(richTextToText(app.longDescription, "")),
    hasReference(app.category),
    Array.isArray(app.tags) && app.tags.some(hasReference),
  ];
  return Math.round((occupied.filter(Boolean).length / occupied.length) * 100);
}

export function qualityLabel(percent: number): {
  label: string;
  tone: "high" | "mid" | "low";
} {
  if (percent >= 80) return { label: "Vollständig", tone: "high" };
  if (percent >= 50) return { label: "Gut dokumentiert", tone: "mid" };
  return { label: "Basis", tone: "low" };
}

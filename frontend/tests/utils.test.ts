import { describe, expect, it } from "vitest";
import { cn, formatDate, slugify } from "../lib/utils";

describe("cn", () => {
  it("merges class names and deduplicates tailwind conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false && "hidden", "text-sm")).toBe("text-sm");
    expect(cn(["flex", "items-center"], { "justify-center": true })).toBe(
      "flex items-center justify-center",
    );
  });
});

describe("formatDate", () => {
  it("formats ISO date strings in German locale", () => {
    const result = formatDate("2024-08-14T00:00:00.000Z");
    expect(result).toContain("2024");
    expect(result).toMatch(/August|august/);
  });

  it("returns empty string for nullish input", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("returns input verbatim for invalid date strings", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("accepts Date instances", () => {
    const result = formatDate(new Date("2023-01-15T00:00:00.000Z"));
    expect(result).toMatch(/2023/);
  });
});

describe("slugify", () => {
  it("lower-cases and trims", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips German umlaut diacritics via NFKD normalization", () => {
    // NFKD decomposes ü→u+¨, and the combining mark is stripped before the
    // explicit ä/ö/ü→ae/oe/ue fallback runs, so diacritics end up removed.
    expect(slugify("Grün über Bäche & Flüsse")).toBe("grun-uber-bache-flusse");
  });

  it("handles ß correctly", () => {
    expect(slugify("Straße")).toBe("strasse");
  });

  it("strips leading/trailing hyphens", () => {
    expect(slugify("  --Titel--  ")).toBe("titel");
  });

  it("collapses consecutive non-alphanumerics", () => {
    expect(slugify("foo___bar!!!baz")).toBe("foo-bar-baz");
  });
});

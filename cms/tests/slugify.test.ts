import { describe, expect, it } from "vitest";
import { slugify } from "../src/utils/slugify";

describe("slugify", () => {
  it("lower-cases and replaces spaces with hyphens", () => {
    expect(slugify("Hallo Welt")).toBe("hallo-welt");
  });

  it("strips umlaut diacritics (NFKD decomposition removes combining marks)", () => {
    expect(slugify("Müller Straße")).toBe("muller-strasse");
    expect(slugify("Ähnlich Öl Über")).toBe("ahnlich-ol-uber");
  });

  it("strips punctuation and collapses runs of separators", () => {
    expect(slugify("Hello, World!!!")).toBe("hello-world");
    expect(slugify("foo___bar  baz")).toBe("foo-bar-baz");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("  --title--  ")).toBe("title");
  });

  it("returns an empty string for input with no alphanumerics", () => {
    expect(slugify("!!!---!!!")).toBe("");
  });

  it("is idempotent", () => {
    const once = slugify("Guterbahnhof — Dresden Neustadt");
    expect(slugify(once)).toBe(once);
  });
});

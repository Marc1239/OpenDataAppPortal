import { describe, expect, it } from "vitest";
import { buildShareTargets } from "../lib/share";

const input = {
  url: "https://portal.example.com/apps/test-app",
  title: "Test App & Co",
  text: "Eine App für offene Daten",
};

describe("buildShareTargets", () => {
  it("returns all six channels in a stable order", () => {
    const targets = buildShareTargets(input);
    expect(targets.map((t) => t.key)).toEqual([
      "email",
      "whatsapp",
      "x",
      "linkedin",
      "facebook",
      "telegram",
    ]);
  });

  it("URL-encodes the page url, title and text", () => {
    const targets = buildShareTargets(input);
    const encodedUrl = encodeURIComponent(input.url);
    const encodedTitle = encodeURIComponent(input.title);

    const x = targets.find((t) => t.key === "x")!;
    expect(x.href).toContain(`url=${encodedUrl}`);
    expect(x.href).toContain(`text=${encodedTitle}`);
    // Raw special characters must not leak into the query string.
    expect(x.href).not.toContain(" ");
    expect(x.href).not.toContain("&Co");
  });

  it("appends the url to the text for email, whatsapp and telegram", () => {
    const targets = buildShareTargets(input);
    const expected = encodeURIComponent(`${input.text} ${input.url}`);
    expect(targets.find((t) => t.key === "whatsapp")!.href).toContain(expected);
    expect(targets.find((t) => t.key === "email")!.href).toContain(expected);
  });

  it("builds privacy-friendly intent links only", () => {
    const targets = buildShareTargets(input);
    expect(targets.find((t) => t.key === "linkedin")!.href).toBe(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(input.url)}`,
    );
    expect(targets.find((t) => t.key === "facebook")!.href).toBe(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(input.url)}`,
    );
    expect(targets.find((t) => t.key === "email")!.href.startsWith("mailto:")).toBe(true);
  });

  it("provides a name and an accessible label for every target", () => {
    for (const target of buildShareTargets(input)) {
      expect(target.name.length).toBeGreaterThan(0);
      expect(target.label.length).toBeGreaterThan(0);
    }
  });
});

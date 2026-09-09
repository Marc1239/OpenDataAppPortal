import { describe, expect, it } from "vitest";
import {
  calculateQuality,
  qualityLabel,
} from "../lib/metadata-quality";
import type { AppDoc } from "../lib/types";

function makeApp(overrides: Partial<AppDoc> = {}): AppDoc {
  return {
    id: "1",
    title: "Test App",
    slug: "test-app",
    city: "Dresden",
    shortDescription: "Kurzer Teaser",
    ...overrides,
  };
}

describe("calculateQuality", () => {
  it("returns 0 for an app with no quality-tracked fields populated", () => {
    // title/slug/id aren't tracked by calculateQuality, so clearing city and
    // shortDescription (the only tracked fields on the minimal fixture) yields 0.
    const app = makeApp({ shortDescription: "", city: "" });
    expect(calculateQuality(app)).toBe(0);
  });

  it("counts filled fields proportionally", () => {
    const app = makeApp({
      shortDescription: "hat text",
      category: { id: "c1", name: "Mobilität", slug: "mobilitaet" },
      city: "Dresden",
    });
    const q = calculateQuality(app);
    expect(q).toBeGreaterThan(0);
    expect(q).toBeLessThan(100);
  });

  it.each([0, 55, 90, -20, 250, NaN, Infinity])(
    "ignores the legacy manual value %s so identical descriptions have identical scores",
    (metadataQualityOverride) => {
      const app = makeApp();
      expect(calculateQuality({ ...app, metadataQualityOverride })).toBe(
        calculateQuality(app),
      );
    },
  );

  it.each([
    null,
    " \n\t\u00a0 ",
    "\u200b\u200c\u200d\u2060\ufeff",
    {},
    { root: { type: "root", children: [] } },
    { root: { children: [{ type: "paragraph", children: [] }] } },
    { root: { children: [{ children: [{ text: " \n\u00a0 " }] }] } },
    { root: { children: [{ children: [{ text: "\u200b\u2060" }] }] } },
    { root: { children: [{ type: "link", url: "https://example.org", children: [] }] } },
    { root: { children: [{ type: "upload", value: { alt: "Bild" } }] } },
    { text: "This object is not rendered as a description" },
  ])("does not reward a long description without displayed text: %j", (longDescription) => {
    const app = makeApp();
    expect(calculateQuality({ ...app, longDescription })).toBe(
      calculateQuality(app),
    );
  });

  it("counts nested description text just like the same plain text", () => {
    const text = "Eine nutzbare Beschreibung";
    const longDescription = {
      root: {
        children: [{ type: "list", children: [{ type: "listitem", children: [
          { type: "link", children: [{ type: "text", text }] },
        ] }] }],
      },
    };
    const app = makeApp();
    expect(calculateQuality({ ...app, longDescription })).toBe(
      calculateQuality({ ...app, longDescription: text }),
    );
    expect(calculateQuality({ ...app, longDescription })).toBeGreaterThan(
      calculateQuality(app),
    );
  });

  it("reads nested paths like links.github and contact.publisherMail", () => {
    const base = calculateQuality(makeApp({ shortDescription: "x" }));
    const withLinks = calculateQuality(
      makeApp({
        shortDescription: "x",
        links: { website: "https://a", github: "https://b" },
        contact: { publisherMail: "a@b.de" },
      }),
    );
    expect(withLinks).toBeGreaterThan(base);
  });

  it("hits 100 when all tracked fields are populated", () => {
    const app = makeApp({
      shortDescription: "s",
      longDescription: "l",
      heroImage: { id: "m1", url: "/img.png" },
      category: { id: "c1", name: "Kat", slug: "kat" },
      tags: [{ id: "t1", label: "x", slug: "x" }],
      city: "Dresden",
      publishDate: "2023",
      latestRelease: "1.0",
      publishInformation: "info",
      links: {
        website: "a",
        appleAppStore: "b",
        googlePlay: "c",
        github: "d",
        api: "e",
      },
      contact: { publisherMail: "a@b.de", supportMail: "c@d.de" },
    });
    expect(calculateQuality(app)).toBe(100);
  });
});

describe("qualityLabel", () => {
  it("labels by bucket", () => {
    expect(qualityLabel(10).tone).toBe("low");
    expect(qualityLabel(55).tone).toBe("mid");
    expect(qualityLabel(95).tone).toBe("high");
  });

  it("uses 50 and 80 as threshold boundaries", () => {
    expect(qualityLabel(49).tone).toBe("low");
    expect(qualityLabel(50).tone).toBe("mid");
    expect(qualityLabel(79).tone).toBe("mid");
    expect(qualityLabel(80).tone).toBe("high");
  });
});

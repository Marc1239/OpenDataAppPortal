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
    const app = makeApp({ title: "", shortDescription: "" });
    expect(calculateQuality(app)).toBe(0);
  });

  it("counts filled fields proportionally", () => {
    const app = makeApp({
      shortDescription: "hat text",
      category: { id: "c1", name: "Mobilität", slug: "mobilitaet" },
      city: "Dresden",
    });
    expect(calculateQuality(app)).toBe(60);
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

  it("does not change the score for optional platform, release, image or contact fields", () => {
    const base = calculateQuality(makeApp({ shortDescription: "x" }));
    const withLinks = calculateQuality(
      makeApp({
        shortDescription: "x",
        heroImage: { id: "m1", url: "/img.png" },
        heroImageURL: "https://example.org/image.png",
        screenshots: [{ image: "m2" }],
        city: "Berlin",
        publishDate: "2023",
        latestRelease: "1.0",
        publishInformation: "info",
        barrierFree: true,
        isFeatured: true,
        links: {
          website: "https://example.org",
          appleAppStore: "https://apps.apple.com/example",
          googlePlay: "https://play.google.com/example",
          github: "https://github.com/example",
          api: "https://example.org/api",
          downloadLink: "https://example.org/download",
          reportBug: "https://example.org/issues",
        },
        contact: { publisherMail: "a@b.de", supportMail: "c@d.de" },
      }),
    );
    expect(withLinks).toBe(base);
  });

  it("hits 100 with only the five description fields, even without app store links", () => {
    const app = makeApp({
      shortDescription: "s",
      longDescription: "l",
      category: { id: "c1", name: "Kat", slug: "kat" },
      tags: [{ id: "t1", label: "x", slug: "x" }],
      city: "",
    });
    expect(calculateQuality(app)).toBe(100);
  });

  it.each(["title", "shortDescription", "longDescription", "category", "tags"] as const)(
    "gives %s the same share as each other description field",
    (field) => {
      const full = makeApp({
        longDescription: "Details",
        category: "c1",
        tags: ["t1"],
      });
      const empty = makeApp({ title: "", shortDescription: "" });
      expect(calculateQuality({ ...empty, [field]: full[field] })).toBe(20);
      expect(calculateQuality({ ...full, [field]: undefined })).toBe(80);
    },
  );

  it("counts one or several tags as a single occupied field", () => {
    expect(calculateQuality(makeApp({ tags: ["t1"] }))).toBe(
      calculateQuality(makeApp({ tags: ["t1", "t2", "t3"] })),
    );
  });

  it("treats relationship IDs and populated relationship objects equally", () => {
    expect(calculateQuality(makeApp({ category: "c1", tags: ["t1"] }))).toBe(
      calculateQuality(makeApp({
        category: { id: "c1", name: "Mobilität", slug: "mobilitaet" },
        tags: [{ id: "t1", label: "Verkehr", slug: "verkehr" }],
      })),
    );
  });

  it("does not count empty references or invisible text as occupied fields", () => {
    const app = makeApp({
      title: "\u200b ",
      shortDescription: "\u2060",
      category: { id: "", name: "", slug: "" },
      tags: ["", "  ", { id: "", label: "", slug: "" }],
    });
    expect(calculateQuality(app)).toBe(0);
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

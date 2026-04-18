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

  it("honours the manual override and clamps to 0..100", () => {
    expect(calculateQuality(makeApp({ metadataQualityOverride: 55 }))).toBe(55);
    expect(calculateQuality(makeApp({ metadataQualityOverride: -20 }))).toBe(0);
    expect(calculateQuality(makeApp({ metadataQualityOverride: 250 }))).toBe(
      100,
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

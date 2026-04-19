import { beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://cms.test";

beforeEach(() => {
  vi.resetModules();
  process.env.NEXT_PUBLIC_PAYLOAD_URL = BASE;
});

async function loadMediaUrl() {
  const mod = await import("../lib/payload");
  return mod.mediaUrl;
}

async function loadAppImageUrl() {
  const mod = await import("../lib/payload");
  return mod.appImageUrl;
}

describe("mediaUrl", () => {
  it("returns null for nullish input", async () => {
    const mediaUrl = await loadMediaUrl();
    expect(mediaUrl(null)).toBeNull();
    expect(mediaUrl(undefined)).toBeNull();
  });

  it("passes through fully-qualified URLs as strings", async () => {
    const mediaUrl = await loadMediaUrl();
    expect(mediaUrl("https://example.com/x.png")).toBe(
      "https://example.com/x.png",
    );
    expect(mediaUrl("http://example.com/x.png")).toBe(
      "http://example.com/x.png",
    );
  });

  it("prepends the CMS base URL for relative paths", async () => {
    const mediaUrl = await loadMediaUrl();
    expect(mediaUrl("/uploads/foo.png")).toBe(`${BASE}/uploads/foo.png`);
    expect(mediaUrl("uploads/foo.png")).toBe(`${BASE}/uploads/foo.png`);
  });

  it("uses size-specific URLs when present", async () => {
    const mediaUrl = await loadMediaUrl();
    const media = {
      id: "m1",
      url: "/uploads/full.png",
      sizes: { card: { url: "/uploads/card.png" } },
    };
    expect(mediaUrl(media, "card")).toBe(`${BASE}/uploads/card.png`);
  });

  it("falls back to the full URL when the requested size is missing", async () => {
    const mediaUrl = await loadMediaUrl();
    const media = { id: "m1", url: "/uploads/full.png" };
    expect(mediaUrl(media, "card")).toBe(`${BASE}/uploads/full.png`);
  });

  it("returns null when no url can be derived", async () => {
    const mediaUrl = await loadMediaUrl();
    expect(mediaUrl({ id: "m1" })).toBeNull();
  });
});

describe("appImageUrl", () => {
  it("prefers heroImage over heroImageURL", async () => {
    const appImageUrl = await loadAppImageUrl();
    expect(
      appImageUrl({
        heroImage: { id: "m1", url: "/uploads/full.png" },
        heroImageURL: "https://example.com/fallback.png",
      }, "card"),
    ).toBe(`${BASE}/uploads/full.png`);
  });

  it("falls back to heroImageURL when no uploaded image exists", async () => {
    const appImageUrl = await loadAppImageUrl();
    expect(
      appImageUrl({
        heroImage: null,
        heroImageURL: "https://example.com/fallback.png",
      }),
    ).toBe("https://example.com/fallback.png");
  });

  it("normalizes relative heroImageURL values", async () => {
    const appImageUrl = await loadAppImageUrl();
    expect(
      appImageUrl({
        heroImage: null,
        heroImageURL: "/uploads/fallback.png",
      }),
    ).toBe(`${BASE}/uploads/fallback.png`);
  });
});

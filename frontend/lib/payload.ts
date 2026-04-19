import type {
  AppDoc,
  Category,
  ContactInfo,
  HeroFeature,
  PaginatedResponse,
  SiteSettings,
  Tag,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_PAYLOAD_URL ?? "http://localhost:3001";
const INTERNAL =
  process.env.PAYLOAD_INTERNAL_URL ?? process.env.NEXT_PUBLIC_PAYLOAD_URL ?? BASE;

const REVALIDATE = Number(process.env.PAYLOAD_REVALIDATE ?? 60);

type FetchOpts = {
  tags?: string[];
  revalidate?: number;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildQuery(q: FetchOpts["query"]) {
  if (!q) return "";
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === "") continue;
    p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

async function payloadFetch<T>(
  path: string,
  { tags = [], revalidate = REVALIDATE, query }: FetchOpts = {},
): Promise<T> {
  const url = `${INTERNAL}${path}${buildQuery(query)}`;
  const res = await fetch(url, {
    next: { tags: ["payload", ...tags], revalidate },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(
      `Payload request failed: ${res.status} ${res.statusText} — ${url}`,
    );
  }
  return (await res.json()) as T;
}

export async function getApps(opts: {
  limit?: number;
  page?: number;
  category?: string;
  tag?: string;
  city?: string;
  barrierFree?: boolean;
  search?: string;
  sort?: string;
} = {}): Promise<PaginatedResponse<AppDoc>> {
  const query: FetchOpts["query"] = {
    limit: opts.limit ?? 24,
    page: opts.page ?? 1,
    depth: 2,
    sort: opts.sort ?? "-createdAt",
  };
  if (opts.category) query["where[category.slug][equals]"] = opts.category;
  if (opts.tag) query["where[tags.slug][equals]"] = opts.tag;
  if (opts.city) query["where[city][equals]"] = opts.city;
  if (opts.barrierFree) query["where[barrierFree][equals]"] = "true";
  if (opts.search) query["where[or][0][title][like]"] = opts.search;

  return payloadFetch<PaginatedResponse<AppDoc>>("/api/apps", {
    query,
    tags: ["apps"],
  });
}

export async function getAppBySlug(slug: string): Promise<AppDoc | null> {
  const res = await payloadFetch<PaginatedResponse<AppDoc>>("/api/apps", {
    query: { "where[slug][equals]": slug, depth: 2, limit: 1 },
    tags: ["apps", `app:${slug}`],
  });
  return res.docs[0] ?? null;
}

export async function getRelatedApps(
  app: AppDoc,
  limit = 3,
): Promise<AppDoc[]> {
  const categorySlug =
    typeof app.category === "object" && app.category ? app.category.slug : null;
  if (!categorySlug) return [];
  const res = await payloadFetch<PaginatedResponse<AppDoc>>("/api/apps", {
    query: {
      "where[category.slug][equals]": categorySlug,
      "where[slug][not_equals]": app.slug,
      limit,
      depth: 1,
    },
    tags: ["apps"],
  });
  return res.docs;
}

export async function getCategories(): Promise<Category[]> {
  const res = await payloadFetch<PaginatedResponse<Category>>(
    "/api/categories",
    { query: { limit: 100, sort: "name" }, tags: ["categories"] },
  );
  return res.docs;
}

export async function getTags(): Promise<Tag[]> {
  const res = await payloadFetch<PaginatedResponse<Tag>>("/api/tags", {
    query: { limit: 200, sort: "label" },
    tags: ["tags"],
  });
  return res.docs;
}

export async function getHeroFeature(): Promise<HeroFeature | null> {
  try {
    return await payloadFetch<HeroFeature>("/api/globals/heroFeature", {
      query: { depth: 2 },
      tags: ["hero"],
    });
  } catch {
    return null;
  }
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    return await payloadFetch<ContactInfo>("/api/globals/contactInfo", {
      tags: ["contact"],
    });
  } catch {
    return null;
  }
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Open Data App Portal",
  tagline: "Anwendungen. Offene Daten. Deine Stadt.",
  nav: [
    { label: "Start", href: "/" },
    { label: "Apps", href: "/apps" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  footerLinks: [
    { label: "Kontakt", href: "/kontakt" },
    { label: "Impressum", href: "/kontakt#impressum" },
  ],
  seoDescription:
    "Entdecke Anwendungen, die auf offenen Daten basieren. Suchen, filtern, herunterladen.",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await payloadFetch<SiteSettings>("/api/globals/siteSettings", {
      tags: ["settings"],
    });
    return {
      ...DEFAULT_SETTINGS,
      ...data,
      nav: data?.nav?.length ? data.nav : DEFAULT_SETTINGS.nav,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function absoluteUrl(url: string): string {
  return url.startsWith("http")
    ? url
    : `${BASE}${url.startsWith("/") ? url : `/${url}`}`;
}

export function mediaUrl(
  input: AppDoc["heroImage"] | string | null | undefined,
  size: "thumb" | "card" | "hero" | "full" = "full",
): string | null {
  if (!input) return null;
  if (typeof input === "string") {
    return absoluteUrl(input);
  }
  if (size !== "full" && input.sizes && input.sizes[size]?.url) {
    const u = input.sizes[size]!.url!;
    return absoluteUrl(u);
  }
  const u = input.url;
  if (!u) return null;
  return absoluteUrl(u);
}

export function appImageUrl(
  app: Pick<AppDoc, "heroImage" | "heroImageURL"> | null | undefined,
  size: "thumb" | "card" | "hero" | "full" = "full",
): string | null {
  if (!app) return null;
  return mediaUrl(app.heroImage, size) ?? mediaUrl(app.heroImageURL);
}

import type { Metadata } from "next";
import { appImageUrl, getApps, getCategories, getTags } from "@/lib/payload";
import { calculateQuality } from "@/lib/metadata-quality";
import { AppsBrowser, type BrowserApp, type BrowserCategory, type BrowserTag } from "@/components/apps-browser";

export const metadata: Metadata = {
  title: "Anwendungen",
  description: "Alle Open-Data-Apps im Katalog. Filter, sortiere, entdecke.",
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    city?: string;
    sort?: string;
    q?: string;
  }>;
};

export default async function AppsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const [appsRes, categories, tags] = await Promise.all([
    getApps({ limit: 200 }),
    getCategories(),
    getTags(),
  ]);

  const flatApps: BrowserApp[] = appsRes.docs.map((a) => {
    const cat = a.category;
    const categoryName = !cat ? "" : typeof cat === "string" ? cat : cat.name;
    const categorySlug = !cat ? null : typeof cat === "string" ? cat : cat.slug;
    const tagList = (a.tags ?? []).map((t) => (typeof t === "string" ? t : t.label));
    return {
      id: a.id,
      slug: a.slug,
      title: a.title,
      shortDescription: a.shortDescription,
      city: a.city ?? "",
      category: categoryName,
      categorySlug,
      tags: tagList,
      heroImage: appImageUrl(a, "card"),
      publishDate: a.publishDate ?? null,
      latestRelease: a.latestRelease ?? null,
      isFeatured: !!a.isFeatured,
      metadataQuality: calculateQuality(a),
    };
  });

  const cats: BrowserCategory[] = categories.map((c) => ({ name: c.name, slug: c.slug }));
  const tagOpts: BrowserTag[] = tags.map((t) => ({ label: t.label, slug: t.slug }));

  return (
    <AppsBrowser
      apps={flatApps}
      categories={cats}
      tags={tagOpts}
      initial={{
        category: sp.category ?? null,
        tag: sp.tag ?? null,
        city: sp.city ?? null,
        sort: sp.sort ?? "quality",
        query: sp.q ?? "",
      }}
    />
  );
}

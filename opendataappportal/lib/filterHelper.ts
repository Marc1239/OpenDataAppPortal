import { AppData, AppEntry } from "@/types/app";
import { calcMetaQuality } from "@/utils/metadata-quality";
import { Filters } from "@/types/app";

export function slugify(key: string) {
  return key.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
}

export function toEntries(json: Record<string, unknown>): AppEntry[] {
  return Object.entries(json).map(([key, raw]) => {
    const d = raw as Omit<AppData, "metaDataQuality" | "tags"> & { tags?: string[] };
    return {
      key,
      slug: slugify(key),
      data: {
        ...d,
        tags: Array.isArray(d.tags) ? d.tags : [],
        metaDataQuality: calcMetaQuality(d as Record<string, unknown>),
      },
    };
  });
}

export function roundQualityLabel(q: string) {
  const n = parseInt(String(q).replace("%",""), 10);
  const r = Math.min(100, Math.max(0, Math.round(n/10)*10));
  return `${r}%`;
}

export function filterApps(apps: AppEntry[], f: Filters) {
  return apps.filter(({ data }) => {
    if (f.city && data.city !== f.city) return false;
    if (f.category && data.category !== f.category) return false;

    if (f.meta) {
      if (roundQualityLabel(data.metaDataQuality) !== f.meta) return false;
    }

    if (f.accessibleOnly && !data.barrierFree) return false;

    if (f.tagIds.length > 0) {
      const appTags = (data.tags || []).map(t => t.toLowerCase());
      const hasAny = f.tagIds.some(id => appTags.includes(id));
      if (!hasAny) return false;
    }

    return true;
  });
}

export function makeTagSuggestions(apps: AppEntry[]) {
  const uniq = new Set<string>();
  apps.forEach(a => (a.data.tags || []).forEach(t => uniq.add(t)));
  return Array.from(uniq)
    .sort((a,b)=>a.localeCompare(b))
    .map(t => ({ id: t.toLowerCase(), label: t }));
}

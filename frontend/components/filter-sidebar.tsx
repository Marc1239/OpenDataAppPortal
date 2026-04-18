"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";
import type { Category, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  tags: Tag[];
  cities: string[];
};

function setParam(params: URLSearchParams, key: string, value: string | null) {
  if (!value) params.delete(key);
  else params.set(key, value);
  return params;
}

export function FilterSidebar({ categories, tags, cities }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const current = {
    category: searchParams.get("category"),
    tag: searchParams.get("tag"),
    city: searchParams.get("city"),
    barrierFree: searchParams.get("barrierFree") === "true",
    q: searchParams.get("q"),
  };

  const active =
    current.category || current.tag || current.city || current.barrierFree || current.q;

  function apply(mutate: (p: URLSearchParams) => void) {
    const p = new URLSearchParams(searchParams.toString());
    mutate(p);
    p.delete("page");
    startTransition(() => router.push(`/apps${p.toString() ? `?${p}` : ""}`));
  }

  return (
    <aside
      className="space-y-6"
      aria-label="Filter"
    >
      {active && (
        <button
          type="button"
          onClick={() =>
            startTransition(() => {
              router.push("/apps");
            })
          }
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-3 rounded-[var(--radius-pill)]",
            "bg-muted text-foreground text-xs font-medium cursor-pointer hover:bg-border transition-colors",
          )}
        >
          <X size={12} aria-hidden /> Filter zurücksetzen
        </button>
      )}

      <FilterGroup title="Kategorie">
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() =>
                  apply((p) =>
                    setParam(p, "category", current.category === c.slug ? null : c.slug),
                  )
                }
                className={cn(
                  "w-full flex items-center justify-between text-sm px-2 py-1.5 rounded-[var(--radius-md)] cursor-pointer",
                  current.category === c.slug
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-muted",
                )}
              >
                <span>{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </FilterGroup>

      {cities.length > 0 && (
        <FilterGroup title="Stadt">
          <ul className="space-y-1">
            {cities.map((city) => (
              <li key={city}>
                <button
                  type="button"
                  onClick={() =>
                    apply((p) =>
                      setParam(p, "city", current.city === city ? null : city),
                    )
                  }
                  className={cn(
                    "w-full flex items-center justify-between text-sm px-2 py-1.5 rounded-[var(--radius-md)] cursor-pointer",
                    current.city === city
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted",
                  )}
                >
                  <span>{city}</span>
                </button>
              </li>
            ))}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Barrierefrei">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border accent-[var(--primary)] cursor-pointer"
            checked={current.barrierFree}
            onChange={(e) =>
              apply((p) =>
                setParam(p, "barrierFree", e.target.checked ? "true" : null),
              )
            }
          />
          Nur barrierefreie Apps
        </label>
      </FilterGroup>

      {tags.length > 0 && (
        <FilterGroup title="Tags">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 24).map((t) => {
              const activeTag = current.tag === t.slug;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    apply((p) =>
                      setParam(p, "tag", activeTag ? null : t.slug),
                    )
                  }
                  className={cn(
                    "inline-flex items-center h-7 px-2.5 rounded-[var(--radius-pill)] text-xs cursor-pointer transition-colors",
                    activeTag
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  #{t.label}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

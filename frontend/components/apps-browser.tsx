"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "./icon";
import { Pill } from "./pill";
import { QualityBadge } from "./quality-badge";
import { HeroImage } from "./hero-image";

export type BrowserApp = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  city: string;
  category: string;
  categorySlug: string | null;
  tags: string[];
  heroImage: string | null;
  publishDate: string | null;
  latestRelease: string | null;
  isFeatured: boolean;
  metadataQuality: number;
};

export type BrowserCategory = { name: string; slug: string };
export type BrowserTag = { label: string; slug: string };

type Layout = "table" | "grid" | "list";

export function AppsBrowser({
  apps,
  categories,
  tags,
  initial,
}: {
  apps: BrowserApp[];
  categories: BrowserCategory[];
  tags: BrowserTag[];
  initial: {
    category: string | null;
    tag: string | null;
    city: string | null;
    sort: string;
    query: string;
  };
}) {
  const [query, setQuery] = useState(initial.query);
  const [category, setCategory] = useState(initial.category ?? "Alle");
  const [city, setCity] = useState(initial.city ?? "Alle");
  const [year, setYear] = useState("Alle");
  const [tag, setTag] = useState(initial.tag ?? "Alle");
  const [minQuality, setMinQuality] = useState(0);
  const [sort, setSort] = useState(initial.sort || "quality");
  const [layout, setLayout] = useState<Layout>("table");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("oa:layout") : null;
    if (saved === "table" || saved === "grid" || saved === "list") setLayout(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("oa:layout", layout);
  }, [layout]);

  const cities = useMemo(() => {
    const s = new Set<string>();
    apps.forEach((a) => {
      if (a.city) s.add(a.city);
    });
    return ["Alle", ...Array.from(s).sort()];
  }, [apps]);

  const years = useMemo(() => {
    const y = new Set<string>();
    apps.forEach((a) => {
      const m = String(a.publishDate || "").match(/\d{4}/);
      if (m) y.add(m[0]);
    });
    return ["Alle", ...Array.from(y).sort().reverse()];
  }, [apps]);

  const categoryOpts = useMemo(
    () => ["Alle", ...categories.map((c) => c.name)],
    [categories],
  );
  const tagOpts = useMemo(() => {
    const set = new Set<string>(tags.map((t) => t.label));
    apps.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return ["Alle", ...Array.from(set).sort()];
  }, [apps, tags]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps
      .filter((a) => {
        if (category !== "Alle" && a.category !== category) return false;
        if (city !== "Alle" && a.city !== city) return false;
        if (tag !== "Alle" && !a.tags.includes(tag)) return false;
        if (year !== "Alle" && !String(a.publishDate || "").includes(year)) return false;
        if (minQuality > 0 && a.metadataQuality < minQuality) return false;
        if (q) {
          const blob = [a.title, a.shortDescription, a.city, a.category, ...a.tags]
            .join(" ")
            .toLowerCase();
          if (!blob.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === "quality") return b.metadataQuality - a.metadataQuality;
        if (sort === "title") return a.title.localeCompare(b.title);
        if (sort === "city") return a.city.localeCompare(b.city);
        if (sort === "featured") return Number(b.isFeatured) - Number(a.isFeatured);
        return 0;
      });
  }, [apps, query, category, city, year, tag, minQuality, sort]);

  const hasActiveFilter =
    query !== "" ||
    category !== "Alle" ||
    city !== "Alle" ||
    year !== "Alle" ||
    tag !== "Alle" ||
    minQuality > 0;

  const clearAll = () => {
    setQuery("");
    setCategory("Alle");
    setCity("Alle");
    setYear("Alle");
    setTag("Alle");
    setMinQuality(0);
  };

  return (
    <div className="apps-page">
      <div className="apps-page__head">
        <div>
          <div className="breadcrumb">
            <span>Katalog</span> <Icon name="arrow" size={12} />{" "}
            <span>Alle Anwendungen</span>
          </div>
          <h1>Anwendungen</h1>
          <p className="apps-page__lead">
            {apps.length} Open-Data-Apps aus Verwaltung, NGOs, Forschung und Community.
            Filter und sortiere nach deinen Kriterien.
          </p>
        </div>
        <div
          className="apps-page__layout-switch"
          role="radiogroup"
          aria-label="Darstellungsart der Anwendungsliste"
        >
          <button
            role="radio"
            aria-checked={layout === "table"}
            className={layout === "table" ? "is-active" : ""}
            onClick={() => setLayout("table")}
            aria-label="Tabellen-Ansicht"
          >
            <Icon name="table" size={16} aria-hidden />
          </button>
          <button
            role="radio"
            aria-checked={layout === "grid"}
            className={layout === "grid" ? "is-active" : ""}
            onClick={() => setLayout("grid")}
            aria-label="Raster-Ansicht"
          >
            <Icon name="grid" size={16} aria-hidden />
          </button>
          <button
            role="radio"
            aria-checked={layout === "list"}
            className={layout === "list" ? "is-active" : ""}
            onClick={() => setLayout("list")}
            aria-label="Listen-Ansicht"
          >
            <Icon name="list" size={16} aria-hidden />
          </button>
        </div>
      </div>

      <div className="apps-filters" role="search" aria-label="Anwendungen filtern">
        <label className="apps-filters__search">
          <span className="sr-only">Suche</span>
          <Icon name="search" size={16} aria-hidden />
          <input
            type="search"
            placeholder="Suche: Name, Beschreibung, Tag, Stadt …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Anwendungen durchsuchen"
          />
          {query && (
            <button
              className="apps-filters__clear"
              onClick={() => setQuery("")}
              aria-label="Suche leeren"
            >
              <Icon name="x" size={14} aria-hidden />
            </button>
          )}
        </label>
        <div className="apps-filters__row">
          <FilterSelect label="Kategorie" value={category} options={categoryOpts} onChange={setCategory} />
          <FilterSelect label="Stadt" value={city} options={cities} onChange={setCity} />
          <FilterSelect label="Tag" value={tag} options={tagOpts} onChange={setTag} />
          <FilterSelect label="Jahr" value={year} options={years} onChange={setYear} />
          <div className="filter-range">
            <label>
              Metadaten-Qualität ≥ <strong>{minQuality}</strong>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={minQuality}
              onChange={(e) => setMinQuality(Number(e.target.value))}
              aria-label="Mindest-Metadaten-Qualität"
            />
          </div>
          <FilterSelect
            label="Sortierung"
            value={sort}
            options={[
              { v: "quality", l: "Qualität (hoch → niedrig)" },
              { v: "featured", l: "Featured zuerst" },
              { v: "title", l: "Titel A → Z" },
              { v: "city", l: "Stadt A → Z" },
            ]}
            onChange={setSort}
          />
          {hasActiveFilter && (
            <button className="btn btn--ghost btn--sm" onClick={clearAll}>
              <Icon name="x" size={12} /> Zurücksetzen
            </button>
          )}
        </div>
        <div className="apps-filters__meta" role="status" aria-live="polite">
          <strong>{filtered.length}</strong> von {apps.length} Anwendungen
          {hasActiveFilter && <span className="apps-filters__hint"> · Filter aktiv</span>}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Icon name="search" size={28} />
          <h3>Nichts gefunden.</h3>
          <p>Versuche weniger Filter oder eine andere Suche.</p>
          <button className="btn btn--ghost" onClick={clearAll}>
            Zurücksetzen
          </button>
        </div>
      ) : layout === "table" ? (
        <AppsTable apps={filtered} />
      ) : layout === "grid" ? (
        <AppsGrid apps={filtered} />
      ) : (
        <AppsList apps={filtered} />
      )}
    </div>
  );
}

type SelectOpt = string | { v: string; l: string };

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOpt[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="filter-sel">
      <span className="filter-sel__label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.v} value={o.v}>
              {o.l}
            </option>
          ),
        )}
      </select>
    </label>
  );
}

function AppsTable({ apps }: { apps: BrowserApp[] }) {
  return (
    <div className="apps-table">
      <div className="apps-table__row apps-table__row--head">
        <span>#</span>
        <span>Anwendung</span>
        <span>Stadt</span>
        <span>Kategorie</span>
        <span>Tags</span>
        <span>Release</span>
        <span>Qualität</span>
        <span></span>
      </div>
      {apps.map((a, i) => (
        <Link key={a.slug} href={`/apps/${a.slug}`} className="apps-table__row">
          <span className="apps-table__idx">{String(i + 1).padStart(2, "0")}</span>
          <span className="apps-table__title">
            <span className="apps-table__thumb">
              <HeroImage src={a.heroImage} alt="" ratio="1/1" placeholder="·" />
            </span>
            <span>
              <strong>{a.title}</strong>
              {a.isFeatured && (
                <span className="apps-table__flag">
                  <Icon name="star" size={10} />
                </span>
              )}
              <em>{a.shortDescription}</em>
            </span>
          </span>
          <span>{a.city}</span>
          <span>
            {a.category && <Pill tone="mono">{a.category}</Pill>}
          </span>
          <span className="apps-table__tags">
            {a.tags.slice(0, 2).map((t) => (
              <Pill key={t} tone="ghost">
                {t}
              </Pill>
            ))}
            {a.tags.length > 2 && (
              <span className="apps-table__more">+{a.tags.length - 2}</span>
            )}
          </span>
          <span className="apps-table__release">
            {a.latestRelease || a.publishDate || "—"}
          </span>
          <span>
            <QualityBadge score={a.metadataQuality} />
          </span>
          <span className="apps-table__arrow">
            <Icon name="arrow-up-right" size={16} />
          </span>
        </Link>
      ))}
    </div>
  );
}

function AppsGrid({ apps }: { apps: BrowserApp[] }) {
  return (
    <div className="apps-grid">
      {apps.map((a) => (
        <Link key={a.slug} href={`/apps/${a.slug}`} className="app-card">
          <div className="app-card__media">
            <HeroImage src={a.heroImage} alt={a.title} ratio="16/10" placeholder={a.title} />
            {a.isFeatured && (
              <span className="app-card__flag">
                <Icon name="star" size={10} /> Featured
              </span>
            )}
            <span className="app-card__q">
              <QualityBadge score={a.metadataQuality} size="sm" />
            </span>
          </div>
          <div className="app-card__body">
            <div className="app-card__meta">
              {a.city && <span>{a.city}</span>}
              {a.city && a.category && <span>·</span>}
              {a.category && <span>{a.category}</span>}
            </div>
            <h3>{a.title}</h3>
            <p>{a.shortDescription}</p>
            <div className="app-card__tags">
              {a.tags.slice(0, 3).map((t) => (
                <Pill key={t} tone="ghost">
                  {t}
                </Pill>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function AppsList({ apps }: { apps: BrowserApp[] }) {
  return (
    <div className="apps-list">
      {apps.map((a) => (
        <Link key={a.slug} href={`/apps/${a.slug}`} className="app-row">
          <div className="app-row__thumb">
            <HeroImage
              src={a.heroImage}
              alt=""
              ratio="1/1"
              placeholder={a.title.slice(0, 2)}
            />
          </div>
          <div className="app-row__body">
            <div className="app-row__top">
              <h3>{a.title}</h3>
              {a.isFeatured && (
                <Pill tone="accent">
                  <Icon name="star" size={10} /> Featured
                </Pill>
              )}
              <QualityBadge score={a.metadataQuality} />
            </div>
            <p>{a.shortDescription}</p>
            <div className="app-row__meta">
              {a.city && <span>{a.city}</span>}
              {a.city && a.category && <span>·</span>}
              {a.category && <span>{a.category}</span>}
              {(a.latestRelease || a.publishDate) && <span>·</span>}
              {(a.latestRelease || a.publishDate) && (
                <span>{a.latestRelease || a.publishDate}</span>
              )}
              <span className="app-row__tags">
                {a.tags.map((t) => (
                  <Pill key={t} tone="ghost">
                    {t}
                  </Pill>
                ))}
              </span>
            </div>
          </div>
          <div className="app-row__arrow">
            <Icon name="arrow-up-right" size={20} />
          </div>
        </Link>
      ))}
    </div>
  );
}

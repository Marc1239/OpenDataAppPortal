import Link from "next/link";
import { appImageUrl, getApps, getCategories } from "@/lib/payload";
import { calculateQuality } from "@/lib/metadata-quality";
import { Icon } from "@/components/icon";
import { Pill } from "@/components/pill";
import { QualityBadge } from "@/components/quality-badge";
import { SectionLabel } from "@/components/section-label";
import { HeroImage } from "@/components/hero-image";
import type { AppDoc, Category } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

function categoryName(app: AppDoc): string {
  const c = app.category;
  if (!c) return "";
  return typeof c === "string" ? c : c.name;
}

function categorySlug(app: AppDoc): string | null {
  const c = app.category;
  if (!c) return null;
  return typeof c === "string" ? c : c.slug;
}

function tagLabels(app: AppDoc): string[] {
  if (!app.tags) return [];
  return app.tags.map((t) => (typeof t === "string" ? t : t.label));
}

export default async function HomePage() {
  const [appsRes, categories] = await Promise.all([
    getApps({ limit: 100 }),
    getCategories(),
  ]);
  const apps = appsRes.docs;
  const featured = apps.filter((a) => a.isFeatured);
  const stats = {
    apps: apps.length,
    cities: new Set(apps.map((a) => a.city).filter(Boolean)).size,
    categories: categories.length,
    openSource: apps.filter((a) => a.links?.github).length,
  };
  const tiles = apps.filter((a) => appImageUrl(a, "card")).slice(0, 6);
  const spotlight = tiles[0];
  const spotlightCategory = spotlight ? categoryName(spotlight) : "";
  const extraCount = Math.max(0, apps.length - 5);

  return (
    <div className="home">
      <HeroV2 apps={apps} tiles={tiles} spotlight={spotlight} spotlightCategory={spotlightCategory} stats={stats} extraCount={extraCount} />

      <section className="section">
        <SectionLabel index="01">Im Fokus</SectionLabel>
        <div className="section__head">
          <h2>Ausgewählte Anwendungen</h2>
          <Link className="link-btn" href="/apps">
            Alle ansehen <Icon name="arrow" size={14} />
          </Link>
        </div>
        <div className="featured-grid">
          {(featured.length > 0 ? featured : apps).slice(0, 3).map((app, i) => (
            <FeaturedCard key={app.slug} app={app} size={i === 0 ? "lg" : "md"} />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionLabel index="02">Nach Thema</SectionLabel>
        <div className="section__head">
          <h2>Kategorien</h2>
        </div>
        <div className="cat-grid">
          {categories.map((c) => {
            const count = apps.filter((a) => categorySlug(a) === c.slug).length;
            return (
              <Link
                key={c.id}
                href={`/apps?category=${encodeURIComponent(c.slug)}`}
                className="cat-card"
              >
                <span className="cat-card__name">{c.name}</span>
                <span className="cat-card__count">{count}</span>
                <span className="cat-card__arrow">
                  <Icon name="arrow" size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="about" className="section section--band">
        <SectionLabel index="03">Open Data</SectionLabel>
        <div className="about">
          <div className="about__col about__col--head">
            <h2>Daten, die allen gehören.</h2>
          </div>
          <div className="about__col">
            <p>
              Offene Daten sind frei zugängliche Datensätze – von Fahrplänen über
              Wahlergebnisse bis zu Baustellen. Sie können von allen genutzt,
              weiterverarbeitet und weitergegeben werden, meist unter freien Lizenzen
              wie CC BY oder ODbL.
            </p>
            <p>
              Dieses Portal sammelt Anwendungen, die aus solchen Daten etwas Nützliches
              bauen: informierend, spielerisch, aktivierend, nützlich.
            </p>
          </div>
          <div className="about__col about__col--list">
            <ul className="about__list">
              <li><span>01</span> Frei zugänglich und nutzbar</li>
              <li><span>02</span> Offen lizenziert, maschinenlesbar</li>
              <li><span>03</span> Community-getragen, dokumentiert</li>
              <li><span>04</span> Transparente Herkunft &amp; Aktualität</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="submit" className="section section--submit">
        <div className="submit">
          <div>
            <SectionLabel index="04">Mitmachen</SectionLabel>
            <h2>Du baust an einer App mit offenen Daten?</h2>
            <p>
              Reiche dein Projekt ein – wir nehmen es nach kurzer Redaktion in den
              Katalog auf und machen es für andere sichtbar.
            </p>
          </div>
          <div className="submit__actions">
            <Link href="/einreichen" className="btn btn--primary">
              App einreichen <Icon name="arrow" size={14} />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn--ghost"
            >
              Auf GitHub beitragen <Icon name="github" size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroV2({
  apps,
  tiles,
  spotlight,
  spotlightCategory,
  stats,
  extraCount,
}: {
  apps: AppDoc[];
  tiles: AppDoc[];
  spotlight: AppDoc | undefined;
  spotlightCategory: string;
  stats: { apps: number; cities: number; categories: number; openSource: number };
  extraCount: number;
}) {
  return (
    <section className="hero2" aria-labelledby="hero-title">
      <div className="hero2__top">
        <div className="hero2__live" role="status" aria-live="polite">
          <span className="hero2__pulse" aria-hidden>
            <span />
            <span />
          </span>
          <span>
            <strong>{apps.length}</strong>&nbsp;Apps im Katalog
          </span>
        </div>
        <div className="hero2__breadcrumbs" aria-hidden>
          <span>OffeneApps</span>
          <span>/</span>
          <span>Open-Data-Verzeichnis</span>
        </div>
      </div>

      <h1 className="hero2__title" id="hero-title">
        <span className="hero2__line">
          <span className="hero2__word">Offene</span>{" "}
          <span className="hero2__word hero2__word--accent">Daten.</span>
        </span>
        <span className="hero2__line">
          <span className="hero2__word">Echte</span>{" "}
          <span className="hero2__word hero2__word--outline">Apps.</span>
        </span>
      </h1>

      <div className="hero2__foot">
        <div className="hero2__cta">
          <Link href="/apps" className="btn btn--primary btn--lg">
            Katalog öffnen <Icon name="arrow" size={14} aria-hidden />
          </Link>
          <Link href="/ueber" className="btn btn--ghost btn--lg">
            Was ist Open Data?
          </Link>
        </div>

        {spotlight && (
          <Link href={`/apps/${spotlight.slug}`} className="hero2__spotlight">
            <div className="hero2__spotlight-media">
              <HeroImage
                src={appImageUrl(spotlight, "card")}
                alt=""
                ratio="4/3"
                placeholder={spotlight.title}
              />
            </div>
            <div className="hero2__spotlight-body">
              <span className="hero2__spotlight-label">Im Fokus</span>
              <strong className="hero2__spotlight-title">{spotlight.title}</strong>
              <span className="hero2__spotlight-meta">
                {spotlight.city}
                {spotlightCategory ? ` · ${spotlightCategory}` : ""}
              </span>
            </div>
            <span className="hero2__spotlight-arrow" aria-hidden>
              <Icon name="arrow-up-right" size={18} />
            </span>
          </Link>
        )}
      </div>

      <div className="hero2__strip">
        <div className="hero2__thumbs" aria-hidden>
          {tiles.slice(1, 6).map((a, i) => (
            <Link
              key={a.slug}
              href={`/apps/${a.slug}`}
              className="hero2__thumb"
              style={{ animationDelay: `${i * 0.08}s` }}
              title={a.title}
              aria-label={a.title}
            >
              <HeroImage
                src={appImageUrl(a, "thumb")}
                alt=""
                ratio="1/1"
                placeholder={a.title}
              />
            </Link>
          ))}
          {extraCount > 0 && (
            <Link
              href="/apps"
              className="hero2__thumb hero2__thumb--more"
              aria-label={`Alle ${apps.length} Apps ansehen`}
            >
              <span>+{extraCount}</span>
            </Link>
          )}
        </div>

        <dl className="hero2__stats">
          <div>
            <dt>{stats.cities}</dt>
            <dd>Städte</dd>
          </div>
          <div>
            <dt>{stats.categories}</dt>
            <dd>Kategorien</dd>
          </div>
          <div>
            <dt>{stats.openSource}</dt>
            <dd>Open Source</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function FeaturedCard({ app, size }: { app: AppDoc; size: "lg" | "md" }) {
  const tags = tagLabels(app);
  const quality = calculateQuality(app);
  const cat = categoryName(app);
  return (
    <Link href={`/apps/${app.slug}`} className={`featured featured--${size}`}>
      <div className="featured__media">
        <HeroImage
          src={appImageUrl(app, size === "lg" ? "hero" : "card")}
          alt={app.title}
          ratio={size === "lg" ? "16/9" : "16/10"}
          placeholder={app.title}
        />
        {app.isFeatured && (
          <span className="featured__flag">
            <Icon name="star" size={11} /> Featured
          </span>
        )}
      </div>
      <div className="featured__body">
        <div className="featured__meta">
          {app.city && <span>{app.city}</span>}
          {app.city && cat && <span>·</span>}
          {cat && <span>{cat}</span>}
          <QualityBadge score={quality} />
        </div>
        <h3 className="featured__title">{app.title}</h3>
        <p className="featured__desc">{app.shortDescription}</p>
        <div className="featured__foot">
          <div className="featured__tags">
            {tags.slice(0, size === "lg" ? 3 : 2).map((t) => (
              <Pill key={t} tone="mono">
                {t}
              </Pill>
            ))}
          </div>
          <span className="featured__cta">
            <Icon name="arrow-up-right" size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

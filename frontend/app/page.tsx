import Link from "next/link";
import { appImageUrl, getApps, getCategories } from "@/lib/payload";
import { Icon } from "@/components/icon";
import { SectionLabel } from "@/components/section-label";
import { HeroImage } from "@/components/hero-image";
import { AppCard } from "@/components/app-card";
import type { AppDoc } from "@/lib/types";

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

  return (
    <div className="home">
      <HeroV2 apps={apps} spotlight={spotlight} spotlightCategory={spotlightCategory} stats={stats} />

      <section className="section">
        <SectionLabel>Im Fokus</SectionLabel>
        <div className="section__head">
          <h2>Ausgewählte Anwendungen</h2>
          <Link className="link-btn" href="/apps">
            Alle ansehen <Icon name="arrow" size={14} />
          </Link>
        </div>
        <div className="featured-grid">
          {(featured.length > 0 ? featured : apps).slice(0, 3).map((app, i) => (
            <AppCard
              key={app.slug}
              app={app}
              size={i === 0 ? "lg" : "md"}
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionLabel>Nach Thema</SectionLabel>
        <div className="section__head">
          <h2>Kategorien</h2>
        </div>
        <ul className="cat-list">
          {categories
            .map((c) => ({
              ...c,
              count: apps.filter((a) => categorySlug(a) === c.slug).length,
            }))
            .filter((c) => c.count > 0)
            .sort((a, b) => b.count - a.count)
            .map((c) => (
              <li key={c.id}>
                <Link href={`/apps?category=${encodeURIComponent(c.slug)}`}>
                  <span className="cat-list__name">{c.name}</span>
                  <span className="cat-list__count" aria-label={`${c.count} Anwendungen`}>
                    {c.count}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section id="about" className="section section--band">
        <SectionLabel>Open Data</SectionLabel>
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
            <SectionLabel>Mitmachen</SectionLabel>
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
  spotlight,
  spotlightCategory,
  stats,
}: {
  apps: AppDoc[];
  spotlight: AppDoc | undefined;
  spotlightCategory: string;
  stats: { apps: number; cities: number; categories: number; openSource: number };
}) {
  return (
    <section className="hero2" aria-labelledby="hero-title">
      <h1 className="hero2__title" id="hero-title">
        <span className="hero2__line">Offene Daten.</span>
        <span className="hero2__line">
          <em>Echte</em> Apps.
        </span>
      </h1>

      <p className="hero2__lede">
        Ein kuratiertes Verzeichnis für Anwendungen, die aus offenen Daten etwas
        Nützliches bauen. Aus {stats.cities} Städten zusammengetragen,
        {" "}
        {stats.openSource} davon Open Source, alle ohne Werbung und Login.
      </p>

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
              <span className="hero2__spotlight-label">
                Empfehlung der Redaktion
              </span>
              <strong className="hero2__spotlight-title">{spotlight.title}</strong>
              <span className="hero2__spotlight-meta">
                {spotlight.city}
                {spotlightCategory ? `, ${spotlightCategory}` : ""}
              </span>
            </div>
            <span className="hero2__spotlight-arrow" aria-hidden>
              <Icon name="arrow-up-right" size={18} />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}


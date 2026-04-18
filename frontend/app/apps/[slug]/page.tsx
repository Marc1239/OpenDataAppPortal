import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppBySlug, getRelatedApps, mediaUrl } from "@/lib/payload";
import { calculateQuality } from "@/lib/metadata-quality";
import { Icon } from "@/components/icon";
import { Pill } from "@/components/pill";
import { QualityBadge } from "@/components/quality-badge";
import { SectionLabel } from "@/components/section-label";
import { HeroImage } from "@/components/hero-image";
import type { AppDoc, Tag } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = await getAppBySlug(slug);
  if (!app) return { title: "App nicht gefunden" };
  return {
    title: app.title,
    description: app.shortDescription,
    openGraph: { title: app.title, description: app.shortDescription },
  };
}

function categoryName(app: AppDoc): string {
  const c = app.category;
  if (!c) return "";
  return typeof c === "string" ? c : c.name;
}

function tagLabels(app: AppDoc): string[] {
  if (!app.tags) return [];
  return app.tags.map((t) => (typeof t === "string" ? t : (t as Tag).label));
}

function richTextToText(content: unknown, fallback: string): string {
  if (typeof content === "string") return content;
  if (!content || typeof content !== "object") return fallback;
  const root = content as { root?: { children?: unknown[] } };
  const children = root?.root?.children;
  if (!Array.isArray(children)) return fallback;
  const texts: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as { text?: string; children?: unknown[] };
    if (typeof n.text === "string") texts.push(n.text);
    if (Array.isArray(n.children)) n.children.forEach(walk);
  };
  children.forEach(walk);
  const combined = texts.join(" ").trim();
  return combined || fallback;
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);
  if (!app) notFound();

  const related = await getRelatedApps(app, 3);
  const quality = calculateQuality(app);
  const cat = categoryName(app);
  const tags = tagLabels(app);
  const heroSrc = mediaUrl(app.heroImage, "hero");
  const longText = richTextToText(app.longDescription, "");

  const links = app.links ?? {};
  const contact = app.contact ?? {};

  const primaryCta = links.appleAppStore
    ? { href: links.appleAppStore, label: "Im App Store öffnen", tone: "primary" as const }
    : links.googlePlay
      ? { href: links.googlePlay, label: "Bei Google Play", tone: "primary" as const }
      : links.website
        ? { href: links.website, label: "Zur Website", tone: "primary" as const }
        : null;
  const secondaryCta =
    primaryCta && primaryCta.href === links.appleAppStore && links.googlePlay
      ? { href: links.googlePlay, label: "Bei Google Play", tone: "ghost" as const }
      : null;

  return (
    <div className="detail">
      <div className="detail__breadcrumb">
        <Link href="/">Start</Link>
        <Icon name="arrow" size={12} />
        <Link href="/apps">Anwendungen</Link>
        <Icon name="arrow" size={12} />
        <span>{app.title}</span>
      </div>

      <header className="detail-hero detail-hero--banner">
        <div className="detail-hero__bg">
          <HeroImage src={heroSrc} alt="" ratio="21/9" placeholder={app.title} />
        </div>
        <div className="detail-hero__overlay">
          <div className="detail-hero__meta detail-hero__meta--light">
            {app.city && <span>{app.city}</span>}
            {app.city && cat && <span className="dot" />}
            {cat && <span>{cat}</span>}
            {app.barrierFree && (
              <>
                <span className="dot" />
                <span className="detail-hero__ax">
                  <Icon name="accessible" size={13} /> barrierefrei
                </span>
              </>
            )}
          </div>
          <h1>{app.title}</h1>
          <p>{app.shortDescription}</p>
          <div className="detail-hero__badges">
            <QualityBadge score={quality} size="lg" />
            {app.isFeatured && (
              <Pill tone="accent">
                <Icon name="star" size={11} /> Featured
              </Pill>
            )}
            {app.latestRelease && <Pill tone="mono">{app.latestRelease}</Pill>}
          </div>
        </div>
      </header>

      <div className="detail__body">
        <article className="detail__main">
          <section className="detail__section">
            <SectionLabel index="01">Beschreibung</SectionLabel>
            <p className="detail__lead">{app.shortDescription}</p>
            {longText && <p className="detail__long">{longText}</p>}
          </section>

          {app.publishInformation && (
            <section className="detail__section">
              <SectionLabel index="02">Release-Informationen</SectionLabel>
              <div className="detail__release">
                <div className="detail__release-head">
                  <span className="detail__release-version">
                    {app.latestRelease || "—"}
                  </span>
                  {app.isFeatured && (
                    <Pill tone="accent">
                      <Icon name="star" size={10} /> Featured
                    </Pill>
                  )}
                </div>
                <p>{app.publishInformation}</p>
              </div>
            </section>
          )}

          <section className="detail__section">
            <SectionLabel index="03">Links &amp; Ressourcen</SectionLabel>
            <div className="detail__links">
              <LinkRow icon="globe" label="Website" href={links.website} />
              <LinkRow icon="apple" label="App Store" href={links.appleAppStore} />
              <LinkRow icon="android" label="Google Play" href={links.googlePlay} />
              <LinkRow icon="github" label="Quellcode" href={links.github} mono />
              <LinkRow icon="api" label="API-Dokumentation" href={links.api} mono />
              <LinkRow icon="download" label="Direkter Download" href={links.downloadLink} />
              <LinkRow icon="bug" label="Bug melden" href={links.reportBug} />
              <LinkRow
                icon="mail"
                label="Herausgeber"
                href={contact.publisherMail ? `mailto:${contact.publisherMail}` : null}
                value={contact.publisherMail}
              />
              <LinkRow
                icon="mail"
                label="Support"
                href={contact.supportMail ? `mailto:${contact.supportMail}` : null}
                value={contact.supportMail}
              />
            </div>
          </section>
        </article>

        <aside className="detail__side">
          <div className="detail__facts">
            <h3>Steckbrief</h3>
            <dl>
              <div>
                <dt>Stadt</dt>
                <dd>{app.city || "—"}</dd>
              </div>
              <div>
                <dt>Kategorie</dt>
                <dd>{cat || "—"}</dd>
              </div>
              <div>
                <dt>Ersterscheinen</dt>
                <dd>{app.publishDate || "—"}</dd>
              </div>
              <div>
                <dt>Letztes Release</dt>
                <dd>{app.latestRelease || "—"}</dd>
              </div>
              <div>
                <dt>Barrierefrei</dt>
                <dd>
                  {app.barrierFree ? (
                    <span className="tick tick--yes">
                      <Icon name="check" size={12} /> ja
                    </span>
                  ) : (
                    <span className="tick tick--no">
                      <Icon name="x" size={12} /> nicht ausgewiesen
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Featured</dt>
                <dd>{app.isFeatured ? "ja" : "nein"}</dd>
              </div>
              <div>
                <dt>Quellcode</dt>
                <dd>{links.github ? "öffentlich" : "nicht öffentlich"}</dd>
              </div>
              <div>
                <dt>Metadaten-Qualität</dt>
                <dd>
                  <QualityBadge score={quality} />
                </dd>
              </div>
            </dl>
          </div>

          {tags.length > 0 && (
            <div className="detail__tags">
              <h4>Tags</h4>
              <div>
                {tags.map((t) => (
                  <Pill key={t} tone="mono">
                    {t}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          {primaryCta && (
            <div className="detail__cta">
              <a
                className="btn btn--primary btn--block"
                href={primaryCta.href!}
                target="_blank"
                rel="noreferrer noopener"
              >
                {primaryCta.label} <Icon name="arrow-up-right" size={14} />
              </a>
              {secondaryCta && (
                <a
                  className="btn btn--ghost btn--block"
                  href={secondaryCta.href!}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {secondaryCta.label} <Icon name="arrow-up-right" size={14} />
                </a>
              )}
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="detail__related">
          <SectionLabel index="04">Ähnliche Anwendungen</SectionLabel>
          <div className="detail__related-grid">
            {related.map((a) => {
              const rCat = categoryName(a);
              return (
                <Link key={a.slug} href={`/apps/${a.slug}`} className="related-card">
                  <div className="related-card__media">
                    <HeroImage
                      src={mediaUrl(a.heroImage, "card")}
                      alt={a.title}
                      ratio="4/3"
                      placeholder={a.title}
                    />
                  </div>
                  <div className="related-card__body">
                    <span className="related-card__meta">
                      {a.city}
                      {a.city && rCat ? " · " : ""}
                      {rCat}
                    </span>
                    <h4>{a.title}</h4>
                    <p>{a.shortDescription}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function LinkRow({
  icon,
  label,
  href,
  value,
  mono,
}: {
  icon:
    | "globe"
    | "apple"
    | "android"
    | "github"
    | "api"
    | "download"
    | "bug"
    | "mail";
  label: string;
  href?: string | null;
  value?: string | null;
  mono?: boolean;
}) {
  const display = value || href || "";
  return (
    <div className={`linkrow ${!href ? "linkrow--empty" : ""}`}>
      <span className="linkrow__icon">
        <Icon name={icon} size={16} />
      </span>
      <span className="linkrow__label">{label}</span>
      {href ? (
        <a
          className={`linkrow__value ${mono ? "mono" : ""}`}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>{display}</span>
          <Icon name="arrow-up-right" size={14} />
        </a>
      ) : (
        <span className="linkrow__empty">nicht angegeben</span>
      )}
    </div>
  );
}

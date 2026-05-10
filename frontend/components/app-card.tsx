import Link from "next/link";
import type { AppDoc, Category, Tag } from "@/lib/types";
import { appImageUrl } from "@/lib/payload";
import { calculateQuality } from "@/lib/metadata-quality";
import { HeroImage } from "@/components/hero-image";
import { Icon } from "@/components/icon";
import { Pill } from "@/components/pill";
import { QualityBadge } from "@/components/quality-badge";

type Size = "lg" | "md";

function categoryName(cat: AppDoc["category"]): string | null {
  if (!cat) return null;
  return typeof cat === "string" ? null : (cat as Category).name;
}

function tagLabels(app: AppDoc): string[] {
  if (!app.tags) return [];
  return app.tags.map((t) => (typeof t === "string" ? t : (t as Tag).label));
}

export function AppCard({
  app,
  size = "md",
  priority = false,
}: {
  app: AppDoc;
  size?: Size;
  priority?: boolean;
}) {
  const tags = tagLabels(app);
  const quality = calculateQuality(app);
  const cat = categoryName(app.category);

  return (
    <Link href={`/apps/${app.slug}`} className={`featured featured--${size}`}>
      <div className="featured__media">
        <HeroImage
          src={appImageUrl(app, size === "lg" ? "hero" : "card")}
          alt={app.title}
          ratio={size === "lg" ? "16/9" : "16/10"}
          placeholder={app.title}
          priority={priority}
        />
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
          <span className="featured__cta" aria-hidden>
            <Icon name="arrow-up-right" size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

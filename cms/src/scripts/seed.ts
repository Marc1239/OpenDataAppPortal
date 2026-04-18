import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { getPayload } from "payload";
import type { Payload } from "payload";
import config from "../payload.config";
import { slugify } from "../utils/slugify";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const SOURCE_DIR = path.resolve(dirname, "source-data");

type RawApp = {
  title: string;
  city?: string;
  category?: string;
  tags?: string[];
  barrierFree?: boolean;
  isLatest?: boolean;
  description?: string;
  api?: string | null;
  webisteLink?: string;
  latestRelease?: string;
  downloadLink?: string;
  appStoreLinkApple?: string;
  appStoreLinkAndroid?: string;
  publisherMail?: string;
  supportMail?: string;
  publishDate?: string;
  publishInformation?: string;
  github?: string | false;
  image?: string;
  reportBug?: string;
  metaDataQuality?: string;
};

type RawHero = {
  heading?: string;
  imageSrc?: string;
};

const CATEGORY_ICON_MAP: Record<string, string> = {
  Nachhaltigkeit: "Leaf",
  Sport: "Dumbbell",
  Essen: "UtensilsCrossed",
  Verkehr: "Bus",
  Politik: "Landmark",
  Kultur: "Palette",
  Bildung: "GraduationCap",
  Gesundheit: "Stethoscope",
  Verwaltung: "Building2",
  Umwelt: "TreePine",
  Tourismus: "MapPin",
  Wirtschaft: "Briefcase",
};

const ensureUser = async (payload: Payload) => {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    payload.logger.info(`Seed-User ${email} existiert bereits.`);
    return;
  }

  await payload.create({
    collection: "users",
    data: {
      email,
      password,
      name: "Portal Admin",
      role: "admin",
    },
  });

  payload.logger.info(`Seed-User angelegt: ${email}`);
};

const ensureCategory = async (
  payload: Payload,
  name: string,
): Promise<string> => {
  const slug = slugify(name);
  const existing = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    return String(existing.docs[0].id);
  }

  const created = await payload.create({
    collection: "categories",
    data: {
      name,
      slug,
      icon: CATEGORY_ICON_MAP[name] ?? "Grid",
    },
  });

  payload.logger.info(`Kategorie angelegt: ${name}`);
  return String(created.id);
};

const ensureTag = async (payload: Payload, label: string): Promise<string> => {
  const slug = slugify(label);
  const existing = await payload.find({
    collection: "tags",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    return String(existing.docs[0].id);
  }

  const created = await payload.create({
    collection: "tags",
    data: { label, slug },
  });
  return String(created.id);
};

const richTextFromText = (text: string) => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr" as const,
    children: [
      {
        type: "paragraph",
        version: 1,
        format: "",
        indent: 0,
        direction: "ltr" as const,
        children: [
          {
            type: "text",
            version: 1,
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
          },
        ],
      },
    ],
  },
});

const normalizeLinks = (raw: RawApp) => {
  const github = typeof raw.github === "string" ? raw.github : undefined;
  return {
    website: raw.webisteLink || undefined,
    appleAppStore: raw.appStoreLinkApple || undefined,
    googlePlay: raw.appStoreLinkAndroid || undefined,
    github,
    api: raw.api ?? undefined,
    downloadLink: raw.downloadLink || undefined,
    reportBug: raw.reportBug || undefined,
  };
};

const parseQuality = (value?: string) => {
  if (!value) return undefined;
  const match = value.match(/\d+/);
  if (!match) return undefined;
  const num = Number(match[0]);
  if (Number.isNaN(num)) return undefined;
  return Math.min(100, Math.max(0, num));
};

const extFromContentType = (ct: string | null): string => {
  if (!ct) return "jpg";
  const m = ct.split(";")[0].trim().toLowerCase();
  if (m === "image/jpeg" || m === "image/jpg") return "jpg";
  if (m === "image/png") return "png";
  if (m === "image/webp") return "webp";
  if (m === "image/gif") return "gif";
  if (m === "image/svg+xml") return "svg";
  return "jpg";
};

const safeName = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";

const uploadHeroImage = async (
  payload: Payload,
  url: string,
  title: string,
): Promise<string | null> => {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "OffeneApps-Seed/1.0" },
    });
    if (!res.ok) {
      payload.logger.warn(
        `Bild-Download fehlgeschlagen (${res.status}) für ${title}: ${url}`,
      );
      return null;
    }
    const ct = res.headers.get("content-type");
    const ext = extFromContentType(ct);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0) return null;
    const created = await payload.create({
      collection: "media",
      data: { alt: title },
      file: {
        data: buffer,
        mimetype: ct?.split(";")[0].trim() || `image/${ext}`,
        name: `${safeName(title)}.${ext}`,
        size: buffer.length,
      },
    });
    payload.logger.info(`Media angelegt für ${title}`);
    return String(created.id);
  } catch (err) {
    payload.logger.warn(
      `Bild-Upload-Fehler für ${title} (${url}): ${(err as Error).message}`,
    );
    return null;
  }
};

const seedApps = async (payload: Payload) => {
  const jsonPath = path.join(SOURCE_DIR, "apps_dresden.json");
  const raw = JSON.parse(await readFile(jsonPath, "utf8")) as Record<string, RawApp>;
  const entries = Object.values(raw);

  for (const entry of entries) {
    const slug = slugify(entry.title);
    const existing = await payload.find({
      collection: "apps",
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (existing.totalDocs > 0) {
      payload.logger.info(`App existiert bereits: ${entry.title}`);
      continue;
    }

    const categoryId = entry.category
      ? await ensureCategory(payload, entry.category)
      : undefined;

    const tagIds: string[] = [];
    for (const tag of entry.tags ?? []) {
      tagIds.push(await ensureTag(payload, tag));
    }

    const heroImageId = entry.image
      ? await uploadHeroImage(payload, entry.image, entry.title)
      : null;

    await payload.create({
      collection: "apps",
      data: {
        title: entry.title,
        slug,
        city: entry.city,
        category: categoryId,
        tags: tagIds,
        shortDescription: entry.description ?? "",
        longDescription: entry.publishInformation
          ? richTextFromText(entry.publishInformation)
          : undefined,
        heroImage: heroImageId ?? undefined,
        heroImageURL: entry.image,
        barrierFree: Boolean(entry.barrierFree),
        isFeatured: Boolean(entry.isLatest),
        publishDate: entry.publishDate,
        latestRelease: entry.latestRelease,
        metadataQualityOverride: parseQuality(entry.metaDataQuality),
        publishInformation: entry.publishInformation,
        links: normalizeLinks(entry),
        contact: {
          publisherMail: entry.publisherMail || undefined,
          supportMail: entry.supportMail || undefined,
        },
      },
    });

    payload.logger.info(`App angelegt: ${entry.title}`);
  }
};

const backfillHeroImages = async (payload: Payload) => {
  const missing = await payload.find({
    collection: "apps",
    where: {
      and: [
        { heroImage: { exists: false } },
        { heroImageURL: { exists: true } },
      ],
    },
    limit: 500,
    depth: 0,
  });

  if (missing.totalDocs === 0) {
    payload.logger.info("Keine Apps ohne heroImage — Backfill übersprungen.");
    return;
  }

  payload.logger.info(
    `Backfill heroImage für ${missing.totalDocs} Apps startet …`,
  );

  for (const app of missing.docs) {
    const url = app.heroImageURL;
    if (!url) continue;
    const mediaId = await uploadHeroImage(payload, url, app.title);
    if (!mediaId) continue;
    await payload.update({
      collection: "apps",
      id: app.id,
      data: { heroImage: mediaId },
    });
    payload.logger.info(`Backfill heroImage: ${app.title}`);
  }
};

const seedHero = async (payload: Payload) => {
  const heroPath = path.join(SOURCE_DIR, "startbeitrag.json");
  const raw = JSON.parse(await readFile(heroPath, "utf8")) as RawHero;

  const featured = await payload.find({
    collection: "apps",
    where: { isFeatured: { equals: true } },
    limit: 1,
  });

  await payload.updateGlobal({
    slug: "heroFeature",
    data: {
      kicker: "Open Data App Portal",
      headline: raw.heading ?? "Entdecke neue Open-Data-Apps",
      body: "Kuratierte Anwendungen, die auf offenen Daten basieren — gebaut von Städten, Studierenden und Open-Source-Communities.",
      featuredApp: featured.docs[0]?.id,
      primaryCTA: {
        label: "Alle Apps entdecken",
        href: "/apps",
      },
    },
  });

  payload.logger.info("Hero-Feature aktualisiert.");
};

const seedContact = async (payload: Payload) => {
  await payload.updateGlobal({
    slug: "contactInfo",
    data: {
      headline: "Kontakt",
      body: "Fragen, Feedback oder eigene Open-Data-App einreichen? Wir freuen uns von Dir zu hören.",
      email: "hallo@opendata-portal.de",
      phone: "+49 351 000 0000",
      address: "Dresden, Deutschland",
      hours: "Mo.–Fr. 9:00–17:00",
    },
  });

  payload.logger.info("Kontakt-Info aktualisiert.");
};

const seedSiteSettings = async (payload: Payload) => {
  await payload.updateGlobal({
    slug: "siteSettings",
    data: {
      siteName: "Open Data App Portal",
      tagline: "Der App Store für Open-Data-Anwendungen",
      seoDescription:
        "Entdecke Open-Data-Apps aus Städten und Communities — kuratiert, transparent, barrierearm.",
      nav: [
        { label: "Start", href: "/" },
        { label: "Apps", href: "/apps" },
        { label: "Kontakt", href: "/kontakt" },
      ],
      footerLinks: [
        { label: "Impressum", href: "/impressum" },
        { label: "Datenschutz", href: "/datenschutz" },
      ],
    },
  });

  payload.logger.info("Site-Settings aktualisiert.");
};

const run = async () => {
  const payload = await getPayload({ config });

  await ensureUser(payload);
  await seedApps(payload);
  await backfillHeroImages(payload);
  await seedHero(payload);
  await seedContact(payload);
  await seedSiteSettings(payload);

  payload.logger.info("Seed abgeschlossen.");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

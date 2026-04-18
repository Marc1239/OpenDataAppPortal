export type MediaSize = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  filename?: string | null;
};

export type Media = {
  id: string;
  alt?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  sizes?: {
    thumb?: MediaSize | null;
    card?: MediaSize | null;
    hero?: MediaSize | null;
  } | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
};

export type Tag = {
  id: string;
  label: string;
  slug: string;
};

export type AppLinks = {
  website?: string | null;
  appleAppStore?: string | null;
  googlePlay?: string | null;
  github?: string | null;
  api?: string | null;
  downloadLink?: string | null;
  reportBug?: string | null;
};

export type AppContact = {
  publisherMail?: string | null;
  supportMail?: string | null;
};

export type AppDoc = {
  id: string;
  title: string;
  slug: string;
  city: string;
  shortDescription: string;
  longDescription?: unknown;
  heroImage?: Media | string | null;
  heroImageURL?: string | null;
  screenshots?: Array<{ image: Media | string; caption?: string | null }> | null;
  category?: Category | string | null;
  tags?: Array<Tag | string> | null;
  barrierFree?: boolean | null;
  isFeatured?: boolean | null;
  publishDate?: string | null;
  latestRelease?: string | null;
  publishInformation?: string | null;
  links?: AppLinks | null;
  contact?: AppContact | null;
  metadataQualityOverride?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type HeroFeature = {
  kicker?: string | null;
  headline: string;
  body?: string | null;
  featuredApp?: AppDoc | string | null;
  primaryCTA?: { label?: string | null; href?: string | null } | null;
};

export type ContactInfo = {
  headline?: string | null;
  body?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  hours?: string | null;
};

export type NavItem = { label: string; href: string };

export type SiteSettings = {
  siteName?: string | null;
  tagline?: string | null;
  nav: NavItem[];
  footerLinks?: NavItem[] | null;
  seoDescription?: string | null;
};

export type PaginatedResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

// Reine Hilfsfunktionen zum Erzeugen von Teilen-Ziel-URLs (Social Sharing).
// Bewusst ohne Browser-APIs gehalten, damit die Logik testbar bleibt.

export type ShareChannel =
  | "email"
  | "whatsapp"
  | "x"
  | "linkedin"
  | "facebook"
  | "telegram";

export type ShareTarget = {
  key: ShareChannel;
  /** Kurzer, sichtbarer Name des Kanals. */
  name: string;
  /** Beschreibendes Label für aria-label und Screenreader. */
  label: string;
  /** Fertige Ziel-URL (URL-Intent, kein Tracking). */
  href: string;
};

export type ShareInput = {
  /** Absolute, kanonische URL der zu teilenden Seite. */
  url: string;
  /** Titel der Anwendung. */
  title: string;
  /** Begleittext, z. B. die Kurzbeschreibung. */
  text: string;
};

/**
 * Baut die Ziel-URLs für die unterstützten Teilen-Kanäle.
 * Alle Parameter werden URL-kodiert. Es werden ausschließlich offizielle
 * Share-Intents verwendet, keine Drittanbieter-Skripte oder Tracking-Parameter.
 */
export function buildShareTargets({ url, title, text }: ShareInput): ShareTarget[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const textWithUrl = encodeURIComponent(`${text} ${url}`.trim());

  return [
    {
      key: "email",
      name: "E-Mail",
      label: "Per E-Mail teilen",
      href: `mailto:?subject=${t}&body=${textWithUrl}`,
    },
    {
      key: "whatsapp",
      name: "WhatsApp",
      label: "Bei WhatsApp teilen",
      href: `https://wa.me/?text=${textWithUrl}`,
    },
    {
      key: "x",
      name: "X",
      label: "Auf X teilen",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    },
    {
      key: "linkedin",
      name: "LinkedIn",
      label: "Auf LinkedIn teilen",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    {
      key: "facebook",
      name: "Facebook",
      label: "Auf Facebook teilen",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
    {
      key: "telegram",
      name: "Telegram",
      label: "Bei Telegram teilen",
      href: `https://t.me/share/url?url=${u}&text=${t}`,
    },
  ];
}

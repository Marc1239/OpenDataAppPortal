import { headers } from "next/headers";

/**
 * Ermittelt die öffentliche Basis-URL des Frontends (ohne abschließenden Slash).
 *
 * Priorität:
 *  1. NEXT_PUBLIC_SITE_URL bzw. SITE_URL, falls explizit gesetzt – z. B. eine feste
 *     kanonische Domain (am besten für SEO/Open Graph).
 *  2. Sonst aus den Request-Headern abgeleitet (Host + Protokoll). Dadurch passt sich
 *     die URL automatisch an die Adresse an, unter der die Seite tatsächlich
 *     aufgerufen wird – egal ob localhost, eine IP wie 178.104.68.119:3000 oder eine
 *     Domain hinter einem Reverse-Proxy (X-Forwarded-Host/-Proto, z. B. Caddy).
 *  3. Fallback localhost (nur Entwicklung/SSR ohne Host-Header).
 *
 * Hinweis: NEXT_PUBLIC_*-Variablen werden in Next.js zur Build-Zeit eingebacken und
 * lassen sich daher zur Laufzeit nicht mehr ändern. Die Header-Ableitung ist deshalb
 * der zuverlässige Weg für Deployments, die ohne Rebuild unter wechselnden
 * Adressen erreichbar sein sollen.
 */
export async function getSiteUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (configured && configured.trim()) {
    return configured.trim().replace(/\/+$/, "");
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = (h.get("x-forwarded-proto") ?? "http").split(",")[0].trim();
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

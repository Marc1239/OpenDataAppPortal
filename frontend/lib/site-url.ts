import { headers } from "next/headers";

/**
 * Ermittelt die öffentliche Basis-URL des Frontends (ohne abschließenden Slash).
 *
 * Priorität:
 *  1. NEXT_PUBLIC_SITE_URL bzw. SITE_URL, falls gesetzt: eine feste kanonische
 *     Domain für SEO und Open Graph.
 *  2. Request-Header (Host + Protokoll, hinter einem Reverse-Proxy wie Caddy
 *     X-Forwarded-Host/-Proto). Die Basis-URL entspricht damit der Adresse,
 *     unter der die Seite gerade läuft: localhost, IP:Port oder Domain.
 *  3. http://localhost:3000, wenn kein Host-Header vorliegt (SSR in der
 *     Entwicklung).
 *
 * Next.js backt NEXT_PUBLIC_*-Variablen zur Build-Zeit ins Bundle, zur Laufzeit
 * ändern sie sich nicht mehr. Deployments, die ohne Rebuild unter wechselnden
 * Adressen laufen sollen, brauchen deshalb die Header-Ableitung.
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

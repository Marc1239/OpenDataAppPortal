import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function Footer({
  settings,
  appCount = 0,
}: {
  settings: SiteSettings;
  appCount?: number;
}) {
  const now = new Date();
  const version = `v${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
  const updated = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const extraLinks = settings.footerLinks ?? [];

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="app-footer__inner">
        <div className="app-footer__col">
          <div className="logo logo--footer">
            <span className="logo__mark" aria-hidden>
              <span className="logo__d1" />
              <span className="logo__d2" />
              <span className="logo__d3" />
            </span>
            <span className="logo__word">
              Offene<em>Apps</em>
            </span>
          </div>
          <p className="app-footer__tag">
            Ein Community-Verzeichnis für Anwendungen, die auf offenen Daten basieren.
          </p>
        </div>
        <nav className="app-footer__col" aria-label="Portal">
          <h4>Portal</h4>
          <ul>
            <li>
              <Link href="/apps">Alle Anwendungen</Link>
            </li>
            <li>
              <Link href="/apps">Kategorien</Link>
            </li>
            <li>
              <Link href="/apps?sort=newest">Neueste Releases</Link>
            </li>
            <li>
              <Link href="/apps">Featured</Link>
            </li>
          </ul>
        </nav>
        <nav className="app-footer__col" aria-label="Mitmachen">
          <h4>Mitmachen</h4>
          <ul>
            <li>
              <Link href="/einreichen">App einreichen</Link>
            </li>
            <li>
              <Link href="/einreichen">Datensatz vorschlagen</Link>
            </li>
            <li>
              <Link href="/kontakt">Bug melden</Link>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Auf GitHub
              </a>
            </li>
          </ul>
        </nav>
        <nav className="app-footer__col" aria-label="Ressourcen">
          <h4>Ressourcen</h4>
          <ul>
            <li>
              <Link href="/ueber">Was ist Open Data?</Link>
            </li>
            <li>
              <Link href="/ueber">API-Dokumentation</Link>
            </li>
            <li>
              <Link href="/ueber">Lizenz</Link>
            </li>
            {extraLinks.length > 0 ? (
              extraLinks.slice(0, 1).map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))
            ) : (
              <li>
                <Link href="/kontakt">Impressum</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="app-footer__meta">
        <span>
          {version} · CC BY 4.0
        </span>
        <span>Letztes Update: {updated}</span>
        <span>{appCount} Anwendungen gelistet</span>
      </div>
    </footer>
  );
}

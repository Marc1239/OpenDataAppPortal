"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Icon } from "./icon";

const NAV = [
  { href: "/", label: "Start", match: (p: string) => p === "/" },
  {
    href: "/apps",
    label: "Anwendungen",
    match: (p: string) => p === "/apps" || p.startsWith("/apps/"),
  },
  { href: "/ueber", label: "Über Open Data", match: (p: string) => p === "/ueber" },
  { href: "/einreichen", label: "App einreichen", match: (p: string) => p === "/einreichen" },
];

function Logo() {
  return (
    <Link href="/" className="logo" aria-label="OffeneApps – zur Startseite">
      <span className="logo__mark" aria-hidden>
        <span className="logo__d1" />
        <span className="logo__d2" />
        <span className="logo__d3" />
      </span>
      <span className="logo__word">
        Offene<em>Apps</em>
      </span>
    </Link>
  );
}

export function TopBar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isDark = mounted ? resolvedTheme !== "light" : true;
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <>
      <header className="app-header" role="banner">
        <a className="skip-link" href="#main">
          Zum Hauptinhalt springen
        </a>
        <div className="app-header__inner">
          <Logo />
          <nav className="app-nav app-nav--desktop" aria-label="Hauptnavigation">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "is-active" : ""}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="app-header__actions">
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={isDark ? "Zu hellem Design wechseln" : "Zu dunklem Design wechseln"}
              aria-pressed={isDark}
              title={isDark ? "Helles Design" : "Dunkles Design"}
              suppressHydrationWarning
            >
              <Icon name={isDark ? "sun" : "moon"} size={18} />
            </button>
            <button
              className="icon-btn"
              onClick={() => router.push("/apps")}
              aria-label="Anwendungen durchsuchen"
            >
              <Icon name="search" size={18} />
            </button>
            <Link
              href="/apps"
              className="btn btn--ghost app-header__catalog"
              aria-label="Zum Katalog aller Anwendungen"
            >
              Katalog <Icon name="arrow" size={14} aria-hidden />
            </Link>
            <button
              className="icon-btn app-header__burger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <Icon name={menuOpen ? "close" : "list"} size={20} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={"mobile-drawer" + (menuOpen ? " is-open" : "")}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer__scrim" onClick={() => setMenuOpen(false)} />
        <nav
          id="mobile-nav-drawer"
          className="mobile-drawer__panel"
          aria-label="Hauptnavigation (mobil)"
        >
          <div className="mobile-drawer__head">
            <span className="mobile-drawer__eyebrow">Navigation</span>
            <button
              className="icon-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Menü schließen"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
          <ul className="mobile-drawer__list">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={active ? "is-active" : ""}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label} <Icon name="arrow" size={14} aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mobile-drawer__foot">
            <Link href="/apps" className="btn btn--primary btn--block">
              Katalog öffnen <Icon name="arrow" size={14} aria-hidden />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getApps } from "@/lib/payload";
import { Icon } from "@/components/icon";
import { SectionLabel } from "@/components/section-label";

export const metadata: Metadata = {
  title: "Über Open Data",
  description:
    "Was sind offene Daten? Warum sammeln wir Anwendungen, die darauf aufbauen?",
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function UeberPage() {
  const res = await getApps({ limit: 200 });
  const apps = res.docs;
  const stats = {
    apps: apps.length,
    cities: new Set(apps.map((a) => a.city).filter(Boolean)).size,
    openSource: apps.filter((a) => a.links?.github).length,
    barrierFree: apps.filter((a) => a.barrierFree).length,
  };

  return (
    <div className="simple-page">
      <div className="simple-page__head">
        <div className="breadcrumb">
          <Link href="/">Start</Link> <Icon name="arrow" size={12} aria-hidden />{" "}
          <span>Über Open Data</span>
        </div>
        <h1>Daten, die allen gehören.</h1>
        <p className="simple-page__lead">
          Offene Daten sind frei zugängliche Datensätze – von Fahrplänen über Wahlergebnissen
          bis zu Baustellen. Sie können von allen genutzt, weiterverarbeitet und weitergegeben
          werden, meist unter freien Lizenzen wie CC BY oder ODbL.
        </p>
      </div>

      <section className="simple-page__section">
        <SectionLabel index="01">Prinzipien</SectionLabel>
        <ul className="about__list">
          <li>
            <span>01</span> Frei zugänglich und nutzbar – ohne Registrierung, ohne Paywall
          </li>
          <li>
            <span>02</span> Offen lizenziert und maschinenlesbar – idealerweise CC BY oder ODbL
          </li>
          <li>
            <span>03</span> Community-getragen und dokumentiert – mit klarer Herkunft und Kontakt
          </li>
          <li>
            <span>04</span> Transparente Aktualität – Stand, Update-Rhythmus und Quellen sichtbar
          </li>
        </ul>
      </section>

      <section className="simple-page__section">
        <SectionLabel index="02">Was passiert hier?</SectionLabel>
        <p>
          Dieses Portal sammelt Anwendungen, die aus solchen Daten etwas Nützliches bauen:
          informierend, spielerisch, aktivierend, nützlich. Die Auswahl ist community-gepflegt
          und konzentriert sich auf Projekte mit offenem Quellcode oder dokumentierten
          Datenquellen.
        </p>
        <dl className="hero__stats">
          <div>
            <dt>{stats.apps}</dt>
            <dd>Anwendungen</dd>
          </div>
          <div>
            <dt>{stats.cities}</dt>
            <dd>Städte &amp; Regionen</dd>
          </div>
          <div>
            <dt>{stats.openSource}</dt>
            <dd>mit Quelltext</dd>
          </div>
          <div>
            <dt>{stats.barrierFree}</dt>
            <dd>barrierefrei</dd>
          </div>
        </dl>
      </section>

      <section className="simple-page__cta">
        <h2>Stöber durch den Katalog.</h2>
        <p>
          {apps.length} Open-Data-Apps warten auf dich – filtern, sortieren, entdecken.
        </p>
        <Link href="/apps" className="btn btn--primary">
          Alle Anwendungen ansehen <Icon name="arrow" size={14} aria-hidden />
        </Link>
      </section>
    </div>
  );
}

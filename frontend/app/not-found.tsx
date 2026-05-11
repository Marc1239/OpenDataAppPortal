import Link from "next/link";
import { Icon } from "@/components/icon";
import { SectionLabel } from "@/components/section-label";

export default function NotFound() {
  return (
    <div className="simple-page">
      <div className="simple-page__head">
        <SectionLabel>Seite nicht gefunden</SectionLabel>
        <h1>Hier ist nichts.</h1>
        <p className="simple-page__lead">
          Diese Seite existiert nicht oder wurde verschoben. Wahrscheinlich findest
          du, was du suchst, im Katalog.
        </p>
      </div>

      <section className="simple-page__cta">
        <h2>Zurück zum Katalog.</h2>
        <p>
          Stöber durch alle Open-Data-Apps, oder geh zurück zur Startseite.
        </p>
        <Link href="/apps" className="btn btn--primary">
          Apps durchsuchen <Icon name="arrow" size={14} aria-hidden />
        </Link>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getContactInfo } from "@/lib/payload";
import { Icon } from "@/components/icon";
import { SectionLabel } from "@/components/section-label";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktiere das Team hinter dem Open Data App Portal.",
};

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function KontaktPage() {
  const info = await getContactInfo();

  const headline = info?.headline ?? "Kontakt.";
  const body =
    info?.body ??
    "Du hast Fragen, Anregungen oder eine Idee, die nicht ins Einreichungsformular passt? Schreib uns.";
  const email = info?.email ?? "hallo@opendata-portal.de";
  const phone = info?.phone;
  const address = info?.address;
  const hours = info?.hours;

  return (
    <div className="simple-page">
      <div className="simple-page__head">
        <div className="breadcrumb">
          <Link href="/">Start</Link> <Icon name="arrow" size={12} aria-hidden />{" "}
          <span>Kontakt</span>
        </div>
        <h1>{headline}</h1>
        <p className="simple-page__lead">{body}</p>
      </div>

      <section className="simple-page__section">
        <SectionLabel>Direkt erreichbar</SectionLabel>
        <dl className="contact-list">
          <div>
            <dt>E-Mail</dt>
            <dd>
              <a href={`mailto:${email}`}>{email}</a>
            </dd>
          </div>
          {phone && (
            <div>
              <dt>Telefon</dt>
              <dd>
                <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
              </dd>
            </div>
          )}
          {address && (
            <div>
              <dt>Adresse</dt>
              <dd>
                <address>{address}</address>
              </dd>
            </div>
          )}
          {hours && (
            <div>
              <dt>Erreichbarkeit</dt>
              <dd>{hours}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="simple-page__cta">
        <h2>Eine App vorschlagen?</h2>
        <p>
          Für konkrete App-Einreichungen ist das Formular der schnellere Weg, dort
          landet alles direkt bei der Redaktion.
        </p>
        <Link href="/einreichen" className="btn btn--primary">
          Zum Einreichungsformular <Icon name="arrow" size={14} aria-hidden />
        </Link>
      </section>
    </div>
  );
}

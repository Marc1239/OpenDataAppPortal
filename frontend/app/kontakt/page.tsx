import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getContactInfo } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktiere das Team hinter dem Open Data App Portal.",
};

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function KontaktPage() {
  const info = await getContactInfo();

  const headline = info?.headline ?? "Kontakt";
  const body =
    info?.body ??
    "Du hast Fragen, Anregungen oder möchtest eine App einreichen? Wir freuen uns auf deine Nachricht.";
  const email = info?.email ?? "kontakt@open-data-portal.de";
  const phone = info?.phone;
  const address = info?.address;
  const hours = info?.hours;

  return (
    <div className="container-page py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Sag hallo
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl font-[var(--font-display)] font-bold text-balance">
          {headline}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{body}</p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-3xl">
        <ContactTile icon={<Mail size={18} aria-hidden />} label="E-Mail">
          <a
            href={`mailto:${email}`}
            className="text-primary hover:underline break-all"
          >
            {email}
          </a>
        </ContactTile>
        {phone && (
          <ContactTile icon={<Phone size={18} aria-hidden />} label="Telefon">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="text-primary hover:underline"
            >
              {phone}
            </a>
          </ContactTile>
        )}
        {address && (
          <ContactTile icon={<MapPin size={18} aria-hidden />} label="Adresse">
            <address className="not-italic whitespace-pre-line text-foreground">
              {address}
            </address>
          </ContactTile>
        )}
        {hours && (
          <ContactTile icon={<Clock size={18} aria-hidden />} label="Erreichbarkeit">
            <p className="whitespace-pre-line">{hours}</p>
          </ContactTile>
        )}
      </div>
    </div>
  );
}

function ContactTile({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-6 flex gap-4">
      <span
        aria-hidden
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-muted text-primary"
      >
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 text-base">{children}</div>
      </div>
    </div>
  );
}

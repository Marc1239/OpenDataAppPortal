"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icon";
import { SectionLabel } from "./section-label";

type FormState = {
  title: string;
  url: string;
  category: string;
  description: string;
  contact: string;
};

const EMPTY: FormState = {
  title: "",
  url: "",
  category: "",
  description: "",
  contact: "",
};

export function SubmitForm({ categories }: { categories: string[] }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="simple-page">
        <div className="submit-thanks">
          <div className="submit-thanks__icon" aria-hidden>
            <Icon name="check" size={40} />
          </div>
          <h1>Danke für deinen Vorschlag.</h1>
          <p>
            Wir sichten Einreichungen in der Regel innerhalb weniger Werktage und melden uns
            unter <strong>{form.contact || "der angegebenen Adresse"}</strong>, sobald deine
            App im Katalog sichtbar ist.
          </p>
          <div className="submit-thanks__actions">
            <Link href="/apps" className="btn btn--primary">
              Zum Katalog
            </Link>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setSubmitted(false);
                setForm(EMPTY);
              }}
            >
              Weitere App einreichen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-page">
      <div className="simple-page__head">
        <div className="breadcrumb">
          <Link href="/">Start</Link> <Icon name="arrow" size={12} aria-hidden />{" "}
          <span>App einreichen</span>
        </div>
        <h1>App einreichen.</h1>
        <p className="simple-page__lead">
          Du baust eine Anwendung, die auf offenen Daten basiert? Trag sie hier ein –
          wir nehmen sie nach kurzer redaktioneller Prüfung in den Katalog auf.
        </p>
      </div>

      <form className="submit-form" onSubmit={onSubmit}>
        <SectionLabel index="01">Grunddaten</SectionLabel>
        <div className="submit-form__row">
          <label className="submit-form__field">
            <span>
              Titel <em>*</em>
            </span>
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="z. B. ParkenDD"
            />
          </label>
          <label className="submit-form__field">
            <span>
              Kategorie <em>*</em>
            </span>
            <select
              required
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">Bitte wählen …</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="submit-form__field">
          <span>
            Website / App-Store-Link <em>*</em>
          </span>
          <input
            required
            type="url"
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
            placeholder="https://…"
          />
        </label>

        <label className="submit-form__field">
          <span>
            Kurze Beschreibung <em>*</em>
          </span>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Worum geht's? Max. ca. 280 Zeichen."
            maxLength={280}
          />
          <span className="submit-form__hint">{form.description.length}/280 Zeichen</span>
        </label>

        <SectionLabel index="02">Kontakt</SectionLabel>
        <label className="submit-form__field">
          <span>
            E-Mail für Rückfragen <em>*</em>
          </span>
          <input
            required
            type="email"
            value={form.contact}
            onChange={(e) => update("contact", e.target.value)}
            placeholder="du@example.org"
          />
        </label>

        <p className="submit-form__note">
          Felder mit <em>*</em> sind Pflicht. Nach Absenden meldet sich die Redaktion
          typischerweise innerhalb weniger Werktage.
        </p>

        <div className="submit-form__actions">
          <Link href="/" className="btn btn--ghost">
            Abbrechen
          </Link>
          <button type="submit" className="btn btn--primary">
            Einreichen <Icon name="arrow" size={14} aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}

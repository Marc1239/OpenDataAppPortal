"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./icon";
import { SectionLabel } from "./section-label";

type FormState = {
  title: string;
  url: string;
  category: string;
  description: string;
  contact: string;
};

type FieldKey = keyof FormState;

const EMPTY: FormState = {
  title: "",
  url: "",
  category: "",
  description: "",
  contact: "",
};

const DRAFT_KEY = "oa:submit-draft";

type Errors = Partial<Record<FieldKey, string>> & { form?: string };

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.title.trim()) errors.title = "Bitte einen Titel angeben.";
  if (!form.category) errors.category = "Bitte eine Kategorie wählen.";
  if (!form.url.trim()) {
    errors.url = "Bitte eine URL angeben.";
  } else {
    try {
      const parsed = new URL(form.url.trim());
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        errors.url = "Die URL muss mit http:// oder https:// beginnen.";
      }
    } catch {
      errors.url = "Die URL ist nicht gültig.";
    }
  }
  if (!form.description.trim()) {
    errors.description = "Eine kurze Beschreibung hilft der Redaktion.";
  } else if (form.description.trim().length < 20) {
    errors.description = "Bitte mindestens 20 Zeichen schreiben.";
  }
  if (!form.contact.trim()) {
    errors.contact = "Bitte eine E-Mail für Rückfragen angeben.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.trim())) {
    errors.contact = "Diese E-Mail-Adresse sieht nicht gültig aus.";
  }
  return errors;
}

export function SubmitForm({ categories }: { categories: string[] }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<FormState>;
      setForm((current) => ({ ...current, ...parsed }));
      setDraftRestored(true);
    } catch {
      /* ignore corrupt draft */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasContent = Object.values(form).some((v) => v.trim().length > 0);
    if (!hasContent) {
      sessionStorage.removeItem(DRAFT_KEY);
      return;
    }
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  const update = <K extends FieldKey>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onBlur = (k: FieldKey) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    setTouched({
      title: true,
      url: true,
      category: true,
      description: true,
      contact: true,
    });
    if (Object.keys(next).length > 0) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      // Real endpoint TODO. Simulating success for now.
      await new Promise((r) => setTimeout(r, 250));
      sessionStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
    } catch {
      setErrors({
        form:
          "Die Einreichung konnte nicht zugestellt werden. Bitte erneut versuchen oder direkt an hallo@opendata-portal.de senden.",
      });
    } finally {
      setSubmitting(false);
    }
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
                setTouched({});
                setErrors({});
              }}
            >
              Weitere App einreichen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const showError = (k: FieldKey) => (touched[k] ? errors[k] : undefined);

  return (
    <div className="simple-page">
      <div className="simple-page__head">
        <div className="breadcrumb">
          <Link href="/">Start</Link> <Icon name="arrow" size={12} aria-hidden />{" "}
          <span>App einreichen</span>
        </div>
        <h1>App einreichen.</h1>
        <p className="simple-page__lead">
          Du baust eine Anwendung, die auf offenen Daten basiert? Trag sie hier ein,
          wir nehmen sie nach kurzer redaktioneller Prüfung in den Katalog auf.
        </p>
        {draftRestored && (
          <p className="submit-form__draft" role="status">
            Entwurf wurde aus dem letzten Besuch wiederhergestellt.
          </p>
        )}
      </div>

      <form className="submit-form" onSubmit={onSubmit} noValidate>
        <SectionLabel>Grunddaten</SectionLabel>
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
              onBlur={() => onBlur("title")}
              placeholder="z. B. ParkenDD"
              aria-invalid={showError("title") ? true : undefined}
              aria-describedby={showError("title") ? "err-title" : undefined}
            />
            {showError("title") && (
              <span id="err-title" className="submit-form__error" role="alert">
                {showError("title")}
              </span>
            )}
          </label>
          <label className="submit-form__field">
            <span>
              Kategorie <em>*</em>
            </span>
            <select
              required
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              onBlur={() => onBlur("category")}
              aria-invalid={showError("category") ? true : undefined}
              aria-describedby={showError("category") ? "err-category" : undefined}
            >
              <option value="">Bitte wählen …</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {showError("category") && (
              <span id="err-category" className="submit-form__error" role="alert">
                {showError("category")}
              </span>
            )}
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
            onBlur={() => onBlur("url")}
            placeholder="https://…"
            aria-invalid={showError("url") ? true : undefined}
            aria-describedby={showError("url") ? "err-url" : undefined}
          />
          {showError("url") && (
            <span id="err-url" className="submit-form__error" role="alert">
              {showError("url")}
            </span>
          )}
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
            onBlur={() => onBlur("description")}
            placeholder="Worum geht's? Max. ca. 280 Zeichen."
            maxLength={280}
            aria-invalid={showError("description") ? true : undefined}
            aria-describedby={
              showError("description") ? "err-description" : "hint-description"
            }
          />
          <span id="hint-description" className="submit-form__hint">
            {form.description.length}/280 Zeichen
          </span>
          {showError("description") && (
            <span id="err-description" className="submit-form__error" role="alert">
              {showError("description")}
            </span>
          )}
        </label>

        <SectionLabel>Kontakt</SectionLabel>
        <label className="submit-form__field">
          <span>
            E-Mail für Rückfragen <em>*</em>
          </span>
          <input
            required
            type="email"
            value={form.contact}
            onChange={(e) => update("contact", e.target.value)}
            onBlur={() => onBlur("contact")}
            placeholder="du@example.org"
            aria-invalid={showError("contact") ? true : undefined}
            aria-describedby={showError("contact") ? "err-contact" : undefined}
          />
          {showError("contact") && (
            <span id="err-contact" className="submit-form__error" role="alert">
              {showError("contact")}
            </span>
          )}
        </label>

        <p className="submit-form__note">
          Felder mit <em>*</em> sind Pflicht. Nach Absenden meldet sich die Redaktion
          typischerweise innerhalb weniger Werktage.
        </p>

        {errors.form && (
          <p className="submit-form__error submit-form__error--global" role="alert">
            {errors.form}
          </p>
        )}

        <div className="submit-form__actions">
          <Link href="/" className="btn btn--ghost">
            Abbrechen
          </Link>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
            aria-busy={submitting || undefined}
          >
            {submitting ? "Wird gesendet …" : "Einreichen"}
            {!submitting && <Icon name="arrow" size={14} aria-hidden />}
          </button>
        </div>
      </form>
    </div>
  );
}

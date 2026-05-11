---
name: OffeneApps
description: Ein kuratiertes Verzeichnis deutscher Open-Data-Anwendungen, gestaltet wie ein Stadtbibliothek-Newsletter.
colors:
  cream-paper: "oklch(0.962 0.01 85)"
  cream-paper-2: "oklch(0.93 0.012 80)"
  cream-paper-3: "oklch(0.89 0.014 75)"
  card-warm-white: "oklch(0.985 0.008 85)"
  card-warm: "oklch(0.945 0.012 80)"
  ink-navy: "oklch(0.18 0.018 260)"
  ink-navy-dim: "oklch(0.42 0.012 260)"
  ink-navy-mute: "oklch(0.56 0.01 260)"
  terra-accent: "oklch(0.58 0.13 38)"
  terra-accent-dark: "oklch(0.66 0.14 38)"
  quality-high: "oklch(0.62 0.13 145)"
  quality-mid: "oklch(0.72 0.13 80)"
  quality-low: "oklch(0.6 0.16 35)"
  line: "oklch(0.18 0.018 260 / 0.16)"
  line-strong: "oklch(0.18 0.018 260 / 0.32)"
typography:
  display:
    fontFamily: "\"Source Serif 4\", ui-serif, Georgia, \"Times New Roman\", serif"
    fontSize: "clamp(48px, 7vw, 96px)"
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "\"Source Serif 4\", ui-serif, Georgia, serif"
    fontSize: "clamp(32px, 4vw, 48px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "\"Source Serif 4\", ui-serif, Georgia, serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "\"Public Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.005em"
  lede:
    fontFamily: "\"Public Sans\", ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  eyebrow:
    fontFamily: "\"Source Serif 4\", ui-serif, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    fontStyle: "italic"
    lineHeight: 1.2
  label:
    fontFamily: "\"Public Sans\", ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    letterSpacing: "0"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "13px"
rounded:
  sm: "4px"
  md: "6px"
  lg: "12px"
  xl: "18px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "28px"
  xl: "48px"
  xxl: "72px"
components:
  button-primary:
    backgroundColor: "{colors.terra-accent}"
    textColor: "{colors.card-warm-white}"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.terra-accent}"
    textColor: "{colors.card-warm-white}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
    height: "44px"
  button-lg:
    backgroundColor: "{colors.terra-accent}"
    textColor: "{colors.card-warm-white}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
    height: "52px"
  pill-editorial:
    backgroundColor: "{colors.terra-accent}"
    textColor: "{colors.terra-accent}"
    rounded: "{rounded.pill}"
    padding: "3px 11px"
    typography: "{typography.eyebrow}"
  pill-mono:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy-dim}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  card-featured:
    backgroundColor: "{colors.card-warm-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.lg}"
    padding: "0"
  input-field:
    backgroundColor: "{colors.card-warm-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "44px"
  input-field-invalid:
    backgroundColor: "{colors.quality-low}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
  section-label:
    textColor: "{colors.terra-accent}"
    typography: "{typography.eyebrow}"
---

# Design System: OffeneApps

## 1. Overview

**Creative North Star: „Der Stadtbibliothek-Newsletter"**

Eine Bibliothekarin pinnt jede Woche fünf neue Anwendungen auf ein Holzbrett im Vorraum: cremefarbenes Papier, Tinte in einem warmen, leicht ins Bräunliche gedrifteten Marineblau, ein einziger Terra-Akzent für die kuratorischen Markierungen. Das System ist optimistisch, lebendig und bürgernah. Es spricht keine Beamtensprache und es verkauft nichts; es zeigt. Editorial-Geste statt Algorithmus, Empfehlung statt Bewertung, lebende Sammlung statt App-Store.

Die ästhetische Doktrin ist warm-civic: kein Behörden-Sächlich, kein generisches SaaS-Cream, kein App-Store-Spektakel mit Sternen und Download-Zählern, keine Crypto-/Web3-Geometrie. Anti-references aus PRODUCT.md bleiben hier wortgleich gültig. Die Verbindung von Source Serif 4 (Italic-Eyebrows, Display-Headlines) und Public Sans (Body, Buttons) trägt die Stimme: redaktionell auf der Beschriftung, ruhig im Fließtext.

**Key Characteristics:**
- Light-Theme als Default („Person mit Kaffee in der Stadtbibliothek, helles Vormittagslicht"); Dark-Theme als gleichberechtigter Spiegel, ausgelöst durch `prefers-color-scheme` und manuellen Toggle.
- Color-Strategy: Committed. Terra ist Brand-Stimme, nicht Garnitur, und darf 30–60 % der wirklichen Aufmerksamkeit tragen (Headlines, CTAs, Eyebrows, Pills, Quality-Mid-Dots).
- Typografische Hierarchie über Familienwechsel + Italic, nicht über Weight-Inflation. Display = Serif. Body = Sans. Mono = nur für API-Endpunkte, GitHub-URLs, Code.
- Flat-by-default. Keine Shadows als Default. Tiefe entsteht durch Surface-Wechsel zwischen `cream-paper` und `cream-paper-2`.
- Lebendige Vielfalt vor Raster. Listen vor Card-Grids. Asymmetrische Featured-Slots vor uniformer 3×N-Kacheln.

## 2. Colors

Eine Palette aus drei warmen Cream-Stufen, drei navy-blauen Ink-Stufen, einem committeten Terra-Akzent und drei semantischen Qualitäts-Tokens. Pure `#000` und `#fff` sind verboten; jede Neutrale ist in Richtung der Brand-Hue getintet.

### Primary
- **Terra-Akzent** (`oklch(0.58 0.13 38)` / Dark `oklch(0.66 0.14 38)`): die einzige saturierte Farbe im System. Trägt CTAs (`btn--primary`), Eyebrow-Captions (`section-label`, `hero2__spotlight-label`), die „Empfehlung"-Pill, Underlines und Focus-Rings. Nie als Background-Fläche; immer als Markierung.

### Neutral
- **Cream-Paper** (`oklch(0.962 0.01 85)`): Body-Background im Light-Theme. Warmes Off-White, leicht ins Beige gedriftet, nie pures Weiß.
- **Cream-Paper-2** (`oklch(0.93 0.012 80)`): Section-Band-Fläche für rhythmische Unterbrechung im Scroll. Wird nur für ganze Sections genutzt, nicht für Kacheln.
- **Cream-Paper-3** (`oklch(0.89 0.014 75)`): Card-Media-Background-Fallback (z.B. wenn `HeroImage` keinen `src` hat).
- **Card-Warm-White** (`oklch(0.985 0.008 85)`): tatsächliche Card-Surface, einen Hauch heller als das Body-BG. So heben sich Cards ab, ohne Shadow zu brauchen.
- **Card-Warm** (`oklch(0.945 0.012 80)`): Secondary-Card-Variante.
- **Ink-Navy** (`oklch(0.18 0.018 260)`): Body-Text + Headlines. Im Dark-Theme das Body-Background.
- **Ink-Navy-Dim** (`oklch(0.42 0.012 260)`): Sekundärtext, Beschreibungen, Lede-Sätze.
- **Ink-Navy-Mute** (`oklch(0.56 0.01 260)`): Tertiäre Caption-Information, „nicht angegeben"-Hinweise.
- **Line** (`oklch(0.18 0.018 260 / 0.16)`): hairline-Trenner zwischen Sections, Card-Borders, Filter-Strip-Trennlinien.
- **Line-Strong** (`oklch(0.18 0.018 260 / 0.32)`): stärkerer Trenner für Tab-Sets, Drawer-Borders, Ghost-Button-Outlines.

### Status (nur in Quality-Indikatoren)
- **Quality-High** (`oklch(0.62 0.13 145)`): mintgrün. Erscheint als 6×6px-Dot in `qbadge--good` ab Metadaten-Score ≥ 85.
- **Quality-Mid** (`oklch(0.72 0.13 80)`): senfgelb. Score 70–84.
- **Quality-Low** (`oklch(0.6 0.16 35)`): warmes Orange-Rot. Score < 70 UND Form-Validation-Errors.

**Die Eine-Stimme-Regel.** Terra ist die einzige saturierte Farbe. Quality-Tokens leuchten ausschließlich in Quality-Dots und in Form-Error-Borders. Wenn ein neuer Hue ins System will, muss Terra zuerst nachweislich nicht reichen.

**Die Kein-Pures-Schwarz-/-Weiß-Regel.** Niemals `#fff`, niemals `#000`, niemals `rgba(0,0,0,…)` oder `rgba(255,255,255,…)`. Tinted Neutrals via OKLCH oder `color-mix(in oklab, var(--fg) X%, transparent)`.

## 3. Typography

**Display Font:** Source Serif 4 (Fallback `ui-serif, Georgia, "Times New Roman", serif`)
**Body Font:** Public Sans (Fallback `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`)
**Mono Font:** System-Mono (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`). Keine importierte Mono-Familie.

**Character:** Source Serif 4 ist nicht magazinös, sondern hat Buchsetzungs-Ruhe. Public Sans ist die USWDS-Schrift: government-warm, modern, ohne SaaS-Stilisierung. Die Paarung sagt „kuratiertes Print-Produkt", nicht „Tech-Brand".

### Hierarchy

- **Display** (Source Serif 4, 600, `clamp(48px, 7vw, 96px)`, line-height 1.0, ls −0.025em): nur in Hero-Titles der Startseite. Italic-Akzent erlaubt für ein einzelnes Wort, niemals für Phrasen.
- **Headline** (Source Serif 4, 500, `clamp(32px, 4vw, 48px)`, ls −0.025em): Section-Heads (`h2`), Detail-Hero-Titles.
- **Title** (Source Serif 4, 500, 20px, ls −0.02em): App-Titel auf Featured-Cards und im Spotlight.
- **Body** (Public Sans, 400, 15.5px, line-height 1.55, ls −0.005em): Standard-Fließtext. Maximale Zeilenlänge **62–75 ch** je nach Kontext.
- **Lede** (Public Sans, 400, 18px, line-height 1.5): Lead-Paragraph nach Hero-Title, Sub-Heads in About-Pages. Maximal **60 ch**.
- **Eyebrow** (Source Serif 4 *italic*, 400, 17px, in Terra): `SectionLabel`, Spotlight-Label, Pill-Editorial. Die Signatur des Systems.
- **Label** (Public Sans, 500, 13px): Form-Field-Labels, Button-Captions, Pill-Inhalte (außer editorial).
- **Mono** (System-Mono, 13px): nur in `.linkrow__value.mono`, also für API-Endpunkte, GitHub-URLs, Versionsstrings.

### Named Rules

**Die Italic-Eyebrow-Regel.** Source Serif 4 Italic im Terra-Akzent ist die kuratorische Stimme. Sie markiert *redaktionelle Entscheidungen* (Empfehlung, Im Fokus, Kategorie-Eyebrows), nie *Daten* und nie *Beschreibungen*.

**Die Single-Italic-Regel.** Italic erscheint maximal an einer Stelle pro Hero, pro Card, pro Section. Mehrere Italic-Wörter im selben Block fallen aufeinander und verlieren die Markierungsfunktion.

**Die Reflex-Reject-Liste bleibt geschlossen.** IBM Plex Sans/Serif/Mono, Space Grotesk, JetBrains Mono, Fraunces, Newsreader, Cormorant, Playfair, Inter, DM Sans, Outfit. Auch ihre Cousins (Söhne-Look-alikes etc.) brauchen einen registerspezifischen Grund.

## 4. Elevation

Das System ist **flat by default**. Es gibt keine globale Shadow-Sprache, keinen Material-Z-Stack, keinen aufgesetzten „Glass-Header". Tiefe entsteht ausschließlich aus drei Quellen: dem hellen Cream-Paper-Body-Background, einem etwas helleren Card-Warm-White für tatsächliche Surfaces, und dünnen Linien (`Line` / `Line-Strong`) als Trenner. Diese Doktrin ist bewusst: Stadtbibliothek-Newsletter haben kein Bevel.

### Shadow Vocabulary (selten, ausschließlich Hover)

- **Spotlight-Hover** (`box-shadow: 0 8px 24px -12px oklch(0.18 0.018 260 / 0.4)`): einzige Shadow im System. Tritt nur auf der Spotlight-Card im Hero auf, im Hover-Zustand, als sanfte Hebung um 2 px. Color = Navy-Ink-Hue at 0.4 Alpha (nie pures Schwarz).

### Named Rules

**Die Flat-By-Default-Regel.** Surfaces sind flach. Shadows tauchen ausschließlich als Antwort auf State auf (Hover, Focus, Drawer-Open).

**Die Tiefe-Durch-Helligkeit-Regel.** Wenn eine Card sich vom Body abheben muss, wechselt das Surface die Helligkeit (`bg → card`), nicht den Shadow.

**Das Glassmorphism-Verbot.** Kein `backdrop-filter` als dekoratives Element. Wenn ein Header-Hintergrund sichtbar gegen scrollenden Inhalt arbeiten muss, wechselt er auf eine deckende Surface. Glasige Header sind hier Slop.

## 5. Components

### Buttons
- **Shape:** Pill (`border-radius: 999px`).
- **Primary (`btn--primary`):** Terra-Background, Card-Warm-White-Text, Public Sans 500 14.5px. Padding `11px 18px`, Minimum-Height `44px` (Touch-Target-Compliance).
- **Ghost (`btn--ghost`):** Transparent-Background, Ink-Navy-Text, 1 px `Line-Strong` Border. Hover füllt mit `Line`-Alpha.
- **Large (`btn--lg`):** Padding `14px 22px`, Höhe `52px`. Nur für Hero-CTAs.
- **Hover:** `transform: translateY(-1px)` auf `btn--primary`. Keine Scale-Animation. Transition 0.15s linear für color/border, transform nur via GPU.
- **Focus:** `outline: 3px solid var(--focus); outline-offset: 2px` (Focus-Token = Terra). Sichtbar auf allen Tastatur-Foki, niemals entfernt.

### Pills (`.pill`)
- **Shape:** Pill (`border-radius: 999px`), Padding `3-4px × 10-12px`.
- **Default:** Soft-Line-Background, Ink-Navy-Text. Allgemeine Status-Marker.
- **Mono:** Transparent + `Line-Strong`-Border + Ink-Navy-Dim-Text. Für Tags und Release-Versionen.
- **Ghost:** `color-mix(in oklab, var(--fg) 5%, transparent)` Background + Ink-Navy-Dim. Niedriger Kontrast für Sekundär-Marker.
- **Accent:** Terra-Background + Card-Warm-White-Text. Reserviert für tatsächliche CTAs in Pill-Form (nicht für Marker).
- **Editorial (Signature):** `color-mix(bg 88%, terra 12%)`-Background + Terra-Text + 1 px terra-mix Border, Source Serif 4 Italic 13 px. Die „Empfehlung der Redaktion"-Pill. Ein einziges Treatment für alle Empfehlung-Surfaces.

### Cards / Containers
- **Featured-Card (`.featured`):** Card-Warm-White-Background, 1 px `Line`-Border, `border-radius: 12px`. Media oben (4/3 oder 16/9 oder 16/10 je nach Size), Body unten mit `padding: 22px`. Empfehlung-Pill (wenn isFeatured) absolut positioniert oben links.
- **Hover:** Border wechselt auf `Line-Strong`, `transform: translateY(-2px)`. Kein Shadow auf Standard-Cards.
- **Spotlight-Card (`.hero2__spotlight`):** Einzig-Variante mit Shadow-Hover (siehe Elevation). 132×100px Media links, Body mittig, Pfeil-Button rechts. `border-radius: 18px`.
- **Detail-Hero (`.detail-hero`):** Banner mit photographischem Hero, OKLCH-tinted Navy-Gradient als Overlay, Text in Cream-Off-White mit subtilem Text-Shadow für Kontrast über variablen Motiven.

### Inputs / Form Fields
- **Style:** Card-Warm-White-Background, 1 px `Line-Strong` Border, `border-radius: 6px`, Public Sans 15px, Padding `10px 14px`, Min-Height `44px`.
- **Focus:** Border wechselt auf Terra, plus `box-shadow: 0 0 0 3px color-mix(terra 30%, transparent)`. Kein Outline-Reset ohne sichtbaren Ersatz.
- **Error (`aria-invalid="true"`):** Border auf Quality-Low (warmes Rot), Background tönt um 6 % auf Quality-Low. Inline-Error-Text in Quality-Low rendert direkt unter dem Feld in 13 px Body-Font.

### Navigation
- **TopBar:** Sticky, deckender `bg`-Background (kein Blur), 1 px Bottom-`Line`. Logo links, Centered Nav, Action-Buttons rechts. Mobile bricht in Drawer mit Off-Cream-Scrim und Slide-from-Right-Panel.
- **Nav-Items:** 14.5 px Public Sans 500, Padding `10px 16px`, Pill-Shape, Hover wechselt nur Text-Color. Active-State bekommt `bg: var(--line)`. Min-Height 44 px.

### Category List (Signature)
Statt eines Card-Rasters: eine inline-flowende Liste von Kategorie-Links, sortiert nach Häufigkeit, separiert durch Mid-Dots `·`. Jeder Link rendert in Source Serif 4 Body-Familie auf `clamp(20px, 2.2vw, 30px)`, mit Italic-Count in Terra direkt daneben. Bei Hover bekommt der Link einen Terra-Underline. Genau das, was eine Bibliothek-Rubrik auf Papier ausmacht: nicht ein Raster, sondern ein Index.

### Section-Label (Signature)
Source Serif 4 Italic 17 px, Terra-Color, Single-Word oder kurze Phrase. Steht freistehend ohne Linie, ohne Index-Nummer, ohne Mono-Begleitung. Markiert die *redaktionelle Einteilung* einer Sektion. Niemals als Replacement für ein `<h2>` verwenden; Eyebrow und Heading stehen nebeneinander.

### Quality-Badge (`.qbadge`)
Klein, neutral, Inline-Pill mit 6×6 px farbigem Dot links (semantisches Quality-Token), Score-Zahl in `--fg` mit `/100`-Suffix in `--fg-mute`. `aria-label="Metadaten-Qualität {n} von 100"`. Nicht-farbabhängig durch Zahl + Label.

## 6. Do's and Don'ts

### Do:

- **Do** Light-Theme als Default servieren. Dark-Theme via `data-theme="dark"` + `next-themes defaultTheme=system`; beide Themes vollständig getokenisiert.
- **Do** Italic-Source-Serif-Eyebrows in Terra für jede redaktionelle Markierung verwenden (Empfehlung, Im Fokus, Kategorie-Section).
- **Do** Touch-Targets ≥ 44 × 44 px halten. `btn`, `icon-btn`, Nav-Items, Form-Inputs alle mit `min-height: 44px`.
- **Do** Hierarchie via Familienwechsel (Serif Display ↔ Sans Body) + Italic + Scale-Clamp. Weight bleibt zwischen 400 und 700.
- **Do** Listen anstelle von Card-Rastern, wenn Items sich nach Größe/Wichtigkeit unterscheiden lassen (Kategorien sortiert nach Count, App-Counts als Italic in Terra).
- **Do** `prefers-reduced-motion: reduce` respektieren. Alle Animationen via globalem Block auf 0.001 ms; Continuous-Loops (Pulse) deaktiviert.
- **Do** Form-Validation inline rendern: `aria-invalid` + Inline-Error-Text + Quality-Low-Border + 6 % Tint-Background. SessionStorage-Draft persistieren.
- **Do** OKLCH für alle Farbwerte verwenden. Wenn `color-mix` gebraucht wird, dann `color-mix(in oklab, …)`, nicht sRGB.

### Don't:

- **Don't** wie eine **Behörden-Website** aussehen (PRODUCT.md-Anti-Ref): kein Bundesadler-Sächlich, keine 90er-Tabellen, keine PDF-als-Primärartefakt, keine zwölf Akkordeon-Ebenen.
- **Don't** wie ein **generischer SaaS** aussehen (PRODUCT.md-Anti-Ref): kein Gradient-Hero mit „Trusted by"-Logos, kein 3×2-Feature-Card-Raster, kein Cream-Beige-SaaS-Look mit Inter+Indigo-Akzent.
- **Don't** wie ein **App-Store-Klon** aussehen (PRODUCT.md-Anti-Ref): keine Sterne-Bewertungen, keine Download-Counts, keine „Jetzt installieren"-CTAs, keine Star-Icons als Featured-Marker. Apps werden vorgestellt, nicht verkauft.
- **Don't** in die **Crypto/Web3-Ästhetik** abdriften (PRODUCT.md-Anti-Ref): kein Neon-auf-Schwarz, kein dekoratives Glassmorphism, keine generative-art-Avatare, keine futuristischen Geometric-Sans-Fonts.
- **Don't** Reflex-Reject-Fonts verwenden: IBM Plex Sans/Serif/Mono, Space Grotesk, JetBrains Mono, Fraunces, Newsreader, Cormorant, Playfair, Inter, DM Sans/Serif, Outfit, Plus Jakarta Sans, Instrument Sans/Serif. Wenn die Wahl auf einen dieser Namen fällt, suchen.
- **Don't** Mono als „technische" Costume verwenden. Mono ist für echte Code/URL-Inhalte, nicht für Caption-Style oder Section-Indices.
- **Don't** Side-Stripe-Borders (`border-left/right > 1px` als farblicher Accent). Absolute-Ban. Lieber Tint-Background oder Eyebrow-Markierung.
- **Don't** Gradient-Text (`background-clip: text` über Gradient). Verboten.
- **Don't** Hero-Metric-Templates (Big-Number + Mono-Label-Strip + Gradient-Akzent). Stattdessen ein Satz, der die Zahlen in den Lese-Fluss einbettet.
- **Don't** identische Card-Grids. „Lebendige Vielfalt statt Raster" ist Design-Prinzip 4 aus PRODUCT.md.
- **Don't** `01/02/03`-Index-Markierungen mit Mono-Caption und Hairline-Rule auf Sections. Editorial-Magazin-Lane bleibt verlassen.
- **Don't** mehr als ein Italic-Wort pro Hero/Card/Section verwenden. Sonst geht die Markierung verloren.
- **Don't** Em-Dashes (`—` oder `--`) in deutschem Fließtext. Komma, Doppelpunkt, Semikolon, Klammer, Punkt.
- **Don't** Pures `#000` / `#fff` / `rgba(0,0,0,…)` / `rgba(255,255,255,…)`. OKLCH oder `color-mix` über brand-getintete Neutrale.
- **Don't** Glassmorphism-Header als Default. Wenn Tiefe gebraucht wird, deckende Surface, keine Blur.

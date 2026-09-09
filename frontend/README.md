This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Belegungsindikator

Die Funktion `calculateQuality` berechnet den Anteil belegter Felder aus fünf Beschreibungsangaben. Jedes Feld zählt mit 20 von 100 Punkten.

| Feld | Zweck |
| --- | --- |
| Titel | Benennung der Anwendung |
| Kurzbeschreibung | Erste Einschätzung von Zweck und Nutzen |
| Langbeschreibung | Ausführliche Erläuterung von Funktion und Verwendung |
| Kategorie | Thematische Einordnung |
| Tags | Ergänzende Schlagwörter für Suche und Filterung |

Diese Auswahl ist eine eigene Entwurfsentscheidung für die grundlegende Beschreibung und Einordnung einer Anwendung. Sie setzt weder eine bestimmte Plattform noch einen lokalen Geltungsbereich voraus. Bilder, Ortsangaben, Veröffentlichungs- und Releaseangaben, Links und Kontaktfelder zählen nicht zum Wert. Diese Informationen bleiben unabhängig davon für die Nutzung und Pflege eines Eintrags relevant.

Textfelder zählen bei auslesbarem, nicht leerem Text. Leerraum und unsichtbare Trennzeichen allein genügen nicht. Für die Langbeschreibung gilt dieselbe Textauswertung wie auf der Detailseite. Kategorie und Tags zählen bei mindestens einer nicht leeren Referenz-ID, auch in einem aufgelösten Objekt. Mehrere Tags ergeben zusammen weiterhin einen Feldpunkt. Alte redaktionelle Vorgabewerte werden ignoriert.

100 Punkte bedeuten, dass diese fünf Felder technisch belegt sind. Der Wert bewertet weder die inhaltliche Richtigkeit noch die Datenqualität oder Funktionsfähigkeit einer Anwendung. Er ist als Hinweis für die Pflege der Beschreibung gedacht. Die bestehenden Bezeichnungen und Farbgrenzen der Oberfläche sind davon getrennte Gestaltungsfragen.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

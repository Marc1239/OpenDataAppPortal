import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";
import { getApps, getSiteSettings } from "@/lib/payload";

const plex = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-font",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OffeneApps · Verzeichnis für Open-Data-Anwendungen",
    template: "%s · OffeneApps",
  },
  description:
    "Ein Community-Verzeichnis für Anwendungen, die auf offenen Daten basieren.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b2545" },
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, apps] = await Promise.all([
    getSiteSettings(),
    getApps({ limit: 1 }).catch(() => ({ totalDocs: 0 })),
  ]);

  return (
    <html
      lang="de"
      data-theme="dark"
      suppressHydrationWarning
      className={`${plex.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider>
          <div className="app">
            <TopBar />
            <main id="main" className="app__main" tabIndex={-1}>
              {children}
            </main>
            <Footer settings={settings} appCount={apps.totalDocs} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Public_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";
import { getApps, getSiteSettings } from "@/lib/payload";

const body = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OffeneApps · Verzeichnis für Open-Data-Anwendungen",
    template: "%s · OffeneApps",
  },
  description:
    "Ein Community-Verzeichnis für Anwendungen, die auf offenen Daten basieren.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe1" },
    { media: "(prefers-color-scheme: dark)", color: "#181b22" },
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
      suppressHydrationWarning
      className={`${body.variable} ${display.variable}`}
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

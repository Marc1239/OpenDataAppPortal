import { ExternalLink, Github, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "apple" | "google" | "github" | "website";

const labels: Record<Kind, { primary: string; secondary: string }> = {
  apple: { primary: "App Store", secondary: "Laden im" },
  google: { primary: "Google Play", secondary: "Jetzt bei" },
  github: { primary: "GitHub", secondary: "Quellcode auf" },
  website: { primary: "Website", secondary: "Öffnen auf" },
};

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M16.365 1.43c0 1.14-.444 2.202-1.18 3.003-.81.886-2.134 1.574-3.25 1.474-.12-1.17.433-2.323 1.16-3.082.783-.852 2.17-1.456 3.27-1.395zM20.46 17.38c-.556 1.284-.82 1.856-1.537 2.99-1.005 1.59-2.422 3.57-4.177 3.588-1.557.017-1.958-1.015-4.07-1.003-2.112.01-2.553 1.022-4.11 1.005-1.754-.017-3.096-1.801-4.1-3.39C-.164 16.84-.452 11.612 2.283 8.81c.97-.996 2.286-1.595 3.725-1.62 1.58-.03 3.07 1.066 4.07 1.066 1 0 2.82-1.318 4.755-1.124.81.033 3.084.328 4.548 2.465-.118.076-2.714 1.585-2.685 4.73.034 3.757 3.29 5.005 3.29 5.005z" />
    </svg>
  );
}

function GooglePlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M3.609 1.814L13.792 12 3.61 22.186a1.5 1.5 0 01-.61-1.213V3.027c0-.477.228-.918.609-1.213z"
        fill="#3B82F6"
      />
      <path
        d="M16.81 8.82l-3.018 3.18 3.018 3.18 4.036-2.32a1.5 1.5 0 000-2.73l-4.036-2.31z"
        fill="#F59E0B"
      />
      <path d="M3.61 22.186L13.79 12l3.02 3.18-10.18 7a1.5 1.5 0 01-3.02-.006v.012z" fill="#16A34A" />
      <path d="M3.61 1.814L13.79 12l3.02-3.18-10.18-7a1.5 1.5 0 00-3.02.006v-.012z" fill="#DC2626" />
    </svg>
  );
}

type Props = {
  kind: Kind;
  href: string;
  compact?: boolean;
  className?: string;
};

export function DownloadButton({ kind, href, compact = false, className }: Props) {
  const base = cn(
    "inline-flex items-center gap-3 rounded-[var(--radius-md)] cursor-pointer",
    "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
    compact ? "h-10 px-3" : "h-12 px-4",
  );

  const isExternal = href.startsWith("http");
  const rel = isExternal ? "noopener noreferrer" : undefined;
  const target = isExternal ? "_blank" : undefined;
  const label = labels[kind];

  const content = (icon: React.ReactNode, cls: string) => (
    <a href={href} rel={rel} target={target} className={cn(base, cls, className)}>
      {icon}
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-wider opacity-80">
          {label.secondary}
        </span>
        <span className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
          {label.primary}
        </span>
      </span>
    </a>
  );

  switch (kind) {
    case "apple":
      return content(
        <AppleLogo className={cn(compact ? "h-5 w-5" : "h-6 w-6")} />,
        "bg-[#000] text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-white/90",
      );
    case "google":
      return content(
        <GooglePlayLogo className={cn(compact ? "h-5 w-5" : "h-6 w-6")} />,
        "bg-[#000] text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-white/90",
      );
    case "github":
      return content(
        <Github size={compact ? 18 : 22} aria-hidden />,
        "bg-card border border-border text-foreground hover:bg-muted",
      );
    case "website":
      return content(
        <Globe size={compact ? 18 : 22} aria-hidden />,
        "bg-primary text-primary-foreground hover:bg-[color-mix(in_oklab,var(--primary),black_12%)]",
      );
    default:
      return content(
        <ExternalLink size={compact ? 18 : 22} aria-hidden />,
        "bg-card border border-border text-foreground hover:bg-muted",
      );
  }
}

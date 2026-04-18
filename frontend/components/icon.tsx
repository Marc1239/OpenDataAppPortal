import type { SVGProps } from "react";

export type IconName =
  | "search"
  | "arrow"
  | "arrow-left"
  | "arrow-up-right"
  | "external"
  | "check"
  | "x"
  | "star"
  | "filter"
  | "grid"
  | "list"
  | "table"
  | "accessible"
  | "github"
  | "apple"
  | "android"
  | "globe"
  | "bug"
  | "mail"
  | "api"
  | "download"
  | "sun"
  | "moon"
  | "close"
  | "dot"
  | "spark"
  | "sliders";

type Props = { name: IconName; size?: number; stroke?: number } & Omit<
  SVGProps<SVGSVGElement>,
  "name" | "stroke"
>;

export function Icon({ name, size = 16, stroke = 1.6, ...rest }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m11 18-6-6 6-6" />
        </svg>
      );
    case "arrow-up-right":
      return (
        <svg {...common}>
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 4h6v6" />
          <path d="M20 4 10 14" />
          <path d="M20 14v6H4V4h6" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 5 5L20 7" />
        </svg>
      );
    case "x":
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 4 2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 17.3 6.8 20l1-5.8L3.5 10l5.9-.8z" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" />
          <rect x="13" y="4" width="7" height="7" />
          <rect x="4" y="13" width="7" height="7" />
          <rect x="13" y="13" width="7" height="7" />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );
    case "table":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" />
          <path d="M3 10h18" />
          <path d="M9 4v16" />
        </svg>
      );
    case "accessible":
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="1.8" />
          <path d="M6 9h12" />
          <path d="m9 9 1 5h5l2 5" />
          <path d="M9 14a4 4 0 1 0 3.5 6" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M9 19c-4 1.5-4-2-6-2" />
          <path d="M15 22v-3.5a3 3 0 0 0-.9-2.3c3-0.3 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5 4.5 4.5 0 0 0-.1-3.4s-1.1-.3-3.6 1.4a12 12 0 0 0-6 0C6.5 2.5 5.4 2.8 5.4 2.8a4.5 4.5 0 0 0-.1 3.4A5 5 0 0 0 4 9.7c0 5 3 6.2 6 6.5a3 3 0 0 0-.9 2.3V22" />
        </svg>
      );
    case "apple":
      return (
        <svg {...common}>
          <path d="M16 3a3.5 3.5 0 0 1-1 2.5A3 3 0 0 1 13 7a3.5 3.5 0 0 1 1-2.5A3.5 3.5 0 0 1 16 3z" />
          <path d="M19 16.5a6 6 0 0 1-1 2c-.7 1-1.4 2-2.5 2s-1.4-.6-2.6-.6-1.5.6-2.6.6c-1.1 0-1.9-1.1-2.6-2.1C6 16.2 5 12.5 6.7 10a3.8 3.8 0 0 1 3.2-1.9c1 0 2 .7 2.6.7s1.8-.8 3-.7a3.7 3.7 0 0 1 3 1.6 3.6 3.6 0 0 0-1.8 3.1 3.5 3.5 0 0 0 2.3 3.2" />
        </svg>
      );
    case "android":
      return (
        <svg {...common}>
          <path d="M5 16V11a7 7 0 0 1 14 0v5z" />
          <path d="m7 8-1-2" />
          <path d="m17 8 1-2" />
          <circle cx="9" cy="13" r=".5" fill="currentColor" />
          <circle cx="15" cy="13" r=".5" fill="currentColor" />
          <path d="M8 16v3" />
          <path d="M16 16v3" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a13 13 0 0 1 0 18" />
          <path d="M12 3a13 13 0 0 0 0 18" />
        </svg>
      );
    case "bug":
      return (
        <svg {...common}>
          <rect x="8" y="7" width="8" height="12" rx="4" />
          <path d="M12 7V5" />
          <path d="M9 5a3 3 0 0 1 6 0" />
          <path d="M4 11h4" />
          <path d="M16 11h4" />
          <path d="M4 17h4" />
          <path d="M16 17h4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "api":
      return (
        <svg {...common}>
          <path d="M8 7H5v10h3" />
          <path d="M16 7h3v10h-3" />
          <path d="M10 7v10" />
          <path d="M14 7v10" />
          <path d="M10 12h4" />
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <path d="M12 4v11" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 20h14" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2" />
          <path d="M12 19v2" />
          <path d="M3 12h2" />
          <path d="M19 12h2" />
          <path d="m5.6 5.6 1.4 1.4" />
          <path d="m17 17 1.4 1.4" />
          <path d="m5.6 18.4 1.4-1.4" />
          <path d="m17 7 1.4-1.4" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 15a8 8 0 1 1-11-11 7 7 0 0 0 11 11z" />
        </svg>
      );
    case "dot":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v4" />
          <path d="M12 17v4" />
          <path d="M3 12h4" />
          <path d="M17 12h4" />
          <path d="m5.5 5.5 2.8 2.8" />
          <path d="m15.7 15.7 2.8 2.8" />
          <path d="m5.5 18.5 2.8-2.8" />
          <path d="m15.7 8.3 2.8-2.8" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...common}>
          <path d="M4 6h10" />
          <path d="M18 6h2" />
          <circle cx="16" cy="6" r="2" />
          <path d="M4 12h4" />
          <path d="M12 12h8" />
          <circle cx="10" cy="12" r="2" />
          <path d="M4 18h12" />
          <path d="M20 18h0" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    default:
      return null;
  }
}

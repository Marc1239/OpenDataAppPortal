import Link from "next/link";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

type IconComponent = React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;

function resolveIcon(name?: string | null): IconComponent {
  if (!name) return Icons.Tag as IconComponent;
  const cleaned = name
    .replace(/[-_ ]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase() + p.slice(1).toLowerCase())
    .join("");
  const found = (Icons as unknown as Record<string, IconComponent>)[cleaned];
  return found ?? (Icons.Tag as IconComponent);
}

type Props = {
  category: Pick<Category, "name" | "slug" | "icon">;
  active?: boolean;
  size?: "sm" | "md";
  as?: "link" | "span";
  className?: string;
};

export function CategoryPill({
  category,
  active = false,
  size = "md",
  as = "link",
  className,
}: Props) {
  const Icon = resolveIcon(category.icon);
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] font-medium",
    "transition-colors duration-200",
    size === "sm" ? "h-7 px-3 text-xs" : "h-9 px-4 text-sm",
    active
      ? "bg-primary text-primary-foreground"
      : "bg-card border border-border text-foreground hover:bg-muted",
    as === "link" && "cursor-pointer",
    className,
  );
  const inner = (
    <>
      <Icon size={size === "sm" ? 12 : 14} aria-hidden />
      <span>{category.name}</span>
    </>
  );
  if (as === "span") {
    return <span className={classes}>{inner}</span>;
  }
  return (
    <Link href={`/apps?category=${category.slug}`} className={classes}>
      {inner}
    </Link>
  );
}

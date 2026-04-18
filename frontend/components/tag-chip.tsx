import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Tag } from "@/lib/types";

export function TagChip({
  tag,
  className,
}: {
  tag: Pick<Tag, "label" | "slug">;
  className?: string;
}) {
  return (
    <Link
      href={`/apps?tag=${tag.slug}`}
      className={cn(
        "inline-flex items-center h-7 px-2.5 rounded-[var(--radius-pill)]",
        "text-xs font-medium text-muted-foreground bg-muted hover:bg-[color-mix(in_oklab,var(--primary),var(--muted)_80%)] hover:text-primary",
        "transition-colors duration-200 cursor-pointer",
        className,
      )}
    >
      #{tag.label}
    </Link>
  );
}

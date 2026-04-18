import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function InfoCard({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card p-5",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-muted text-primary"
          >
            {icon}
          </span>
        )}
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

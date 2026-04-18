import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "accent" | "success" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-[var(--success)] text-white",
  outline: "border border-border bg-card text-foreground",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-0.5",
        "text-xs font-medium leading-5",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

import type { ReactNode } from "react";

type Tone = "default" | "mono" | "ghost" | "accent";

export function Pill({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={`pill pill--${tone} ${className}`.trim()}>{children}</span>
  );
}

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium cursor-pointer " +
  "transition-colors duration-200 select-none whitespace-nowrap " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[color-mix(in_oklab,var(--primary),black_10%)]",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklab,var(--secondary),black_10%)]",
  accent:
    "bg-accent text-accent-foreground hover:bg-[color-mix(in_oklab,var(--accent),black_10%)]",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  outline:
    "bg-card border border-border text-foreground hover:bg-muted hover:border-[color-mix(in_oklab,var(--primary),var(--border)_70%)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-[var(--radius-md)]",
  md: "h-10 px-4 text-sm rounded-[var(--radius-md)]",
  lg: "h-12 px-5 text-base rounded-[var(--radius-lg)]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leading,
      trailing,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {leading}
        {children}
        {trailing}
      </button>
    );
  },
);
Button.displayName = "Button";

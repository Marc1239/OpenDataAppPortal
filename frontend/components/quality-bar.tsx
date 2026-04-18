import { cn } from "@/lib/utils";

export function QualityBar({
  percent,
  className,
  showLabel = true,
}: {
  percent: number;
  className?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const tone =
    clamped >= 80
      ? "bg-[var(--success)]"
      : clamped >= 50
        ? "bg-primary"
        : "bg-accent";
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Metadaten-Qualität
          </span>
          <span className="text-xs font-semibold tabular-nums">
            {clamped}%
          </span>
        </div>
      )}
      <div
        className="h-2 rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label="Metadaten-Qualität"
      >
        <div
          className={cn("h-full transition-[width] duration-500", tone)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

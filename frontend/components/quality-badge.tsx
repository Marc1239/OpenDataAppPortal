export function QualityBadge({
  score,
  size = "sm",
}: {
  score: number | null | undefined;
  size?: "sm" | "lg";
}) {
  if (score == null) return null;
  const tone = score >= 85 ? "good" : score >= 70 ? "ok" : "low";
  const label = `Metadaten-Qualität ${score} von 100`;
  return (
    <span
      className={`qbadge qbadge--${tone} qbadge--${size}`}
      role="img"
      aria-label={label}
      title={label}
    >
      <span className="qbadge__dot" aria-hidden />
      <span className="qbadge__num" aria-hidden>
        {score}
      </span>
      <span className="qbadge__unit" aria-hidden>
        /100
      </span>
    </span>
  );
}

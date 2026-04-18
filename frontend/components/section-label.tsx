import type { ReactNode } from "react";

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="section-label">
      <span className="section-label__idx">{index}</span>
      <span className="section-label__text">{children}</span>
      <span className="section-label__rule" />
    </div>
  );
}

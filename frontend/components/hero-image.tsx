"use client";

import { useState, type CSSProperties } from "react";

export function HeroImage({
  src,
  alt,
  ratio = "16/9",
  placeholder,
  className = "",
  style,
}: {
  src?: string | null;
  alt?: string;
  ratio?: string;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const [failed, setFailed] = useState(false);
  const decorative = !alt || alt === "";
  const mergedStyle: CSSProperties = { aspectRatio: ratio, ...style };

  if (!src || failed) {
    return (
      <div
        className={`hero-placeholder ${className}`.trim()}
        style={mergedStyle}
        role={decorative ? "presentation" : "img"}
        aria-label={decorative ? undefined : alt || placeholder}
      >
        <span className="hero-placeholder__stripes" aria-hidden />
        <span className="hero-placeholder__label" aria-hidden={decorative}>
          {placeholder || alt || "app screenshot"}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      className={`hero-img ${className}`.trim()}
      style={mergedStyle}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

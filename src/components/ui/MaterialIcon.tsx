"use client";

export interface MaterialIconProps {
  name: string;
  filled?: boolean;
  className?: string;
  size?: number;
  "aria-hidden"?: boolean;
}

export function MaterialIcon({
  name,
  filled = false,
  className = "",
  size = 24,
  "aria-hidden": ariaHidden = true,
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? "filled" : ""} ${className}`.trim()}
      style={{ fontSize: size }}
      aria-hidden={ariaHidden}
    >
      {name}
    </span>
  );
}

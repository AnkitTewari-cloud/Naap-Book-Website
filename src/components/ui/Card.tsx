import type { HTMLAttributes, ReactNode } from "react";

import styles from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  compact?: boolean;
  interactive?: boolean;
}

export function Card({
  children,
  compact = false,
  interactive = false,
  className = "",
  ...rest
}: CardProps) {
  const classes = [
    styles.card,
    compact ? styles.compact : "",
    interactive ? styles.interactive : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

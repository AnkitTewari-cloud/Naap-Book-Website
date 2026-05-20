import type { HTMLAttributes, ReactNode } from "react";

import styles from "./PageContainer.module.css";

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Omit bottom padding when page manages its own (e.g. fixed FAB). */
  noBottomPad?: boolean;
}

export function PageContainer({
  children,
  noBottomPad = false,
  className = "",
  ...rest
}: PageContainerProps) {
  const classes = [
    styles.container,
    noBottomPad ? styles.noBottomPad : "",
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

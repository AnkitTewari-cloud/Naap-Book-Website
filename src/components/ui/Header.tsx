"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import styles from "./Header.module.css";

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  trailing?: ReactNode;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  trailing,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        {showBack ? (
          <button
            type="button"
            className={styles.back}
            onClick={handleBack}
            aria-label="Go back"
          >
            ←
          </button>
        ) : null}
        <h1 className={styles.title}>{title}</h1>
        {trailing}
      </div>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </header>
  );
}

export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`${styles.sectionLabel} ${className}`.trim()}>{children}</h2>
  );
}

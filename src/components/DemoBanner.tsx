"use client";

import { IS_DEMO_MODE } from "@/features/demo/demoMode";

import styles from "./DemoBanner.module.css";

export function DemoBanner() {
  if (!IS_DEMO_MODE) return null;

  return (
    <div className={styles.banner} role="status">
      Demo — sample data only
    </div>
  );
}

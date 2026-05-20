"use client";

import Link from "next/link";

import { getGarmentLabel } from "@/constants/garments";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useI18n } from "@/i18n/useI18n";
import type { JobCard, JobStatus } from "@/types/shared";

import styles from "./CalendarDeliveryCard.module.css";

const STATUS_LABEL: Record<JobStatus, string> = {
  received: "Received",
  cutting: "Cutting",
  stitching: "Stitching",
  trial: "Trial",
  finishing: "Finishing",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function customerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function avatarVariant(jobId: string): "primary" | "accent" {
  let hash = 0;
  for (let i = 0; i < jobId.length; i += 1) {
    hash = (hash + jobId.charCodeAt(i)) % 2;
  }
  return hash === 0 ? "primary" : "accent";
}

export function CalendarDeliveryCard({
  job,
  customerName,
}: {
  job: JobCard;
  customerName?: string;
}) {
  const { t, language } = useI18n();
  const garment = job.items?.[0]?.garmentType ?? "custom";
  const status = job.status;
  const displayName = customerName ?? "Customer";
  const initials = customerInitials(displayName);
  const avatarClass =
    avatarVariant(job._id) === "primary"
      ? styles.avatarPrimary
      : styles.avatarAccent;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.topMain}>
          <div className={`${styles.statusRow} ${styles[`status_${status}`]}`}>
            <span className={styles.statusDot} aria-hidden />
            <span className={styles.statusLabel}>{STATUS_LABEL[status]}</span>
          </div>
          <h3 className={styles.garmentTitle}>
            {getGarmentLabel(garment, language)}
          </h3>
        </div>
        <span className={styles.ref}>#{job.jobNumber}</span>
      </div>
      <div className={styles.customerBlock}>
        <div className={`${styles.avatar} ${avatarClass}`} aria-hidden>
          {initials}
        </div>
        <div>
          <p className={styles.customerName}>{displayName}</p>
          <p className={styles.customerMeta}>
            {job.customerId ? "Customer" : "—"}
          </p>
        </div>
      </div>
      <Link href={`/jobs/${job._id}`} className={styles.link}>
        {t("calendar.viewDetails")}
        <MaterialIcon name="arrow_forward" size={16} />
      </Link>
    </article>
  );
}

"use client";

import Link from "next/link";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getGarmentLabel } from "@/constants/garments";
import { useI18n } from "@/i18n/useI18n";
import type { JobCard, JobStatus } from "@/types/shared";
import { formatDate, isOverdue, toDate } from "@/utils/dates";
import { getSmsLink, getWaShareLink } from "@/utils/phone";

import styles from "./TodayDeliveryRow.module.css";

export type DeliveryTier = "ready" | "pending" | "delayed";

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

export function getDeliveryTier(job: JobCard): DeliveryTier {
  if (
    isOverdue(job.dates.promisedAt) &&
    job.status !== "delivered" &&
    job.status !== "cancelled"
  ) {
    return "delayed";
  }
  if (job.status === "ready" || job.status === "finishing") return "ready";
  return "pending";
}

function formatInr(n: number | undefined): string {
  if (!n || n === 0) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

function jobAmount(job: JobCard): string {
  const due = job.pricing?.balance;
  const quoted = job.pricing?.quoted;
  if (due && due > 0) return formatInr(due);
  return formatInr(quoted);
}

function statusChipLabel(job: JobCard, tier: DeliveryTier): string {
  if (tier === "delayed") return "Delayed";
  return STATUS_LABEL[job.status] ?? job.status;
}

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

function formatPromisedTime(
  iso: string | undefined,
  language: string
): string {
  const d = toDate(iso);
  if (!d) return "—";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (hh === "00" && mm === "00") {
    return formatDate(iso, { language });
  }
  return `${hh}:${mm}`;
}

export function TodayDeliveryRow({
  job,
  customerName,
  customerPhone,
}: {
  job: JobCard;
  customerName?: string;
  customerPhone?: string;
}) {
  const { t, language } = useI18n();
  const tier = getDeliveryTier(job);
  const garment = job.items?.[0]?.garmentType ?? "custom";
  const garmentLabel =
    job.items?.[0]?.garmentLabel || getGarmentLabel(garment, language);
  const chipLabel = statusChipLabel(job, tier);
  const displayName = customerName?.trim() || "—";
  const jobRef = job.jobNumber ? `#${job.jobNumber}` : "";
  const href = `/jobs/${job._id}`;
  const smsBody = `${displayName} — ${garmentLabel}`;
  const initials = customerInitials(displayName);
  const avatarClass =
    avatarVariant(job._id) === "primary"
      ? styles.avatarPrimary
      : styles.avatarAccent;

  return (
    <article className={`${styles.row} ${styles[`row_${tier}`]}`}>
      <Link href={href} className={styles.rowLink}>
        <div
          className={`${styles.avatar} ${avatarClass}`}
          aria-hidden
        >
          {initials}
        </div>
        <div className={styles.chipCol}>
          <span className={`${styles.chip} ${styles[`chip_${tier}`]}`}>
            {chipLabel}
          </span>
        </div>
        <div className={styles.main}>
          <div className={styles.nameRow}>
            <h3 className={styles.customerName}>{displayName}</h3>
            {jobRef ? <span className={styles.jobRef}>{jobRef}</span> : null}
          </div>
          <p className={styles.garment}>{garmentLabel}</p>
          <p className={styles.time}>
            {formatPromisedTime(job.dates.promisedAt, language)}
          </p>
        </div>
        <div className={styles.amountCol}>
          <span className={styles.amount}>{jobAmount(job)}</span>
        </div>
      </Link>
      {customerPhone ? (
        <div className={styles.actions}>
          <a
            href={getWaShareLink(customerPhone, smsBody)}
            className={styles.actionWa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <MaterialIcon name="chat" size={18} />
            {t("customers.whatsapp")}
          </a>
          <a
            href={getSmsLink(customerPhone, smsBody)}
            className={styles.actionSms}
            onClick={(e) => e.stopPropagation()}
          >
            <MaterialIcon name="sms" size={18} />
            {t("customers.sms")}
          </a>
        </div>
      ) : null}
    </article>
  );
}

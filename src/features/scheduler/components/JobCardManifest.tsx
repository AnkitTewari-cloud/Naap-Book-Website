"use client";

import Link from "next/link";

import { getGarmentEmoji, getGarmentLabel } from "@/constants/garments";
import { useI18n } from "@/i18n/useI18n";
import type { SupportedLanguage } from "@/i18n/strings";
import { getStatusColor, useTheme } from "@/theme/ThemeProvider";
import type { Customer, JobCard } from "@/types/shared";
import { daysBetween, formatDate, isOverdue } from "@/utils/dates";

import styles from "./JobCardManifest.module.css";

export function getCustomerDisplayName(
  customer: Pick<Customer, "name" | "namesByLang"> | null | undefined,
  language: SupportedLanguage
): string {
  if (!customer) return "";
  const localized = customer.namesByLang?.[language];
  if (localized?.trim()) return localized;
  return customer.name ?? "";
}

interface JobCardManifestProps {
  job: JobCard;
  customerName?: string;
  sample?: boolean;
  href?: string;
}

const FABRIC_COLOR_HEX: Record<string, string> = {
  white: "#FFFFFF",
  cream: "#FFF8E7",
  black: "#111111",
  navy: "#1E3A8A",
  maroon: "#7F1D1D",
  red: "#DC2626",
  pink: "#EC4899",
  peach: "#FCA5A5",
  yellow: "#FDE047",
  gold: "#D4AF37",
  green: "#16A34A",
  mint: "#A7F3D0",
  emerald: "#047857",
  blue: "#2563EB",
  sky: "#60A5FA",
  teal: "#14B8A6",
  purple: "#7C3AED",
  brown: "#7C2D12",
  charcoal: "#374151",
  ivory: "#FFFFF0",
  beige: "#F5F0E1",
  silver: "#C0C0C0",
  rose: "#FB7185",
  "off-white": "#F8F1E5",
  "royal blue": "#1D4ED8",
};

function inr(n: number | undefined): string {
  if (!n || n === 0) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

function resolveColorChip(color?: string): string | null {
  if (!color) return null;
  const key = color.trim().toLowerCase();
  if (FABRIC_COLOR_HEX[key]) return FABRIC_COLOR_HEX[key];
  const firstToken = key.split(/[\s/]+/)[0] ?? "";
  return FABRIC_COLOR_HEX[firstToken] ?? null;
}

function relativeDate(iso?: string, language?: string): string {
  if (!iso) return "—";
  const diff = daysBetween(new Date(), iso);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1) return `in ${diff} days`;
  if (diff < -1) return `${Math.abs(diff)} days ago`;
  return formatDate(iso, { language });
}

export function JobCardManifest({
  job,
  customerName,
  sample,
  href,
}: JobCardManifestProps) {
  const theme = useTheme();
  const { language } = useI18n();

  const item = job.items?.[0];
  const garment = item?.garmentType ?? "custom";
  const emoji = getGarmentEmoji(garment);
  const garmentLabel = item?.garmentLabel || getGarmentLabel(garment, language);
  const quantity = item?.quantity ?? 1;

  const statusColor = getStatusColor(theme, job.status);
  const overdue =
    isOverdue(job.dates.promisedAt) &&
    job.status !== "delivered" &&
    job.status !== "cancelled";
  const colorChip = resolveColorChip(job.fabric?.color);
  const linkHref = href ?? `/jobs/${job._id}`;

  return (
    <Link
      href={linkHref}
      className={`${styles.card} touch-target ${overdue ? styles.cardOverdue : ""}`}
    >
      <div
        className={styles.stripe}
        style={{
          backgroundColor: overdue ? theme.colors.statusOverdue : statusColor,
        }}
      />
      <div className={styles.body}>
        <div className={styles.headerRow}>
          <span className={styles.emoji} aria-hidden>
            {emoji}
          </span>
          <div className={styles.headerMain}>
            <p className={styles.customerName}>{customerName ?? "—"}</p>
            <p className={styles.jobMeta}>
              {job.jobNumber}
              {sample ? " · Sample" : ""}
            </p>
          </div>
          <span
            className={styles.statusPill}
            style={{ backgroundColor: statusColor }}
          >
            {job.status}
          </span>
        </div>

        <div className={styles.garmentRow}>
          <span className={styles.garmentLabel}>
            {garmentLabel} × {quantity}
          </span>
          {job.priority && job.priority !== "normal" ? (
            <span
              className={styles.priorityPill}
              style={{
                backgroundColor:
                  job.priority === "urgent"
                    ? theme.colors.statusOverdue
                    : theme.colors.statusTrial,
              }}
            >
              {job.priority}
            </span>
          ) : null}
        </div>

        {job.fabric?.type || job.fabric?.color ? (
          <div className={styles.fabricRow}>
            <span>
              {[job.fabric?.type, job.fabric?.color].filter(Boolean).join(" · ")}
            </span>
            {colorChip ? (
              <span
                className={styles.colorChip}
                style={{ backgroundColor: colorChip }}
              />
            ) : null}
          </div>
        ) : null}

        <div className={styles.divider} />

        <div className={styles.priceRow}>
          <PriceTile label="Quoted" value={inr(job.pricing?.quoted)} />
          <PriceTile label="Advance" value={inr(job.pricing?.advance)} />
          <PriceTile
            label={job.status === "delivered" ? "Paid" : "Due"}
            value={inr(job.pricing?.balance)}
            danger={!!job.pricing?.balance && job.status !== "delivered"}
          />
        </div>

        <div>
          <DateRow
            label={job.status === "delivered" ? "Delivered" : "Delivery"}
            value={
              job.status === "delivered"
                ? formatDate(job.dates.deliveredAt, { language })
                : `${relativeDate(job.dates.promisedAt, language)} · ${formatDate(job.dates.promisedAt, { language })}`
            }
            highlight={overdue}
          />
          {job.dates.trialAt && job.status !== "delivered" ? (
            <DateRow
              label="Trial"
              value={`${relativeDate(job.dates.trialAt, language)} · ${formatDate(job.dates.trialAt, { language })}`}
            />
          ) : null}
          <DateRow
            label="Received"
            value={`${relativeDate(job.dates.receivedAt, language)} · ${formatDate(job.dates.receivedAt, { language })}`}
            muted
          />
        </div>

        {item?.notes ? (
          <div className={styles.notesBox}>
            <p className={styles.notesTitle}>Notes</p>
            <p style={{ margin: 0 }}>{item.notes}</p>
          </div>
        ) : null}

        {item?.customMeasurements &&
        Object.keys(item.customMeasurements).length > 0 ? (
          <div className={styles.measureChips}>
            {Object.entries(item.customMeasurements)
              .slice(0, 6)
              .map(([k, v]) => (
                <span key={k} className={styles.measureChip}>
                  {k} <span className={styles.measureValue}>{v}</span>
                </span>
              ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function PriceTile({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className={styles.priceTile}>
      <div className={styles.priceLabel}>{label}</div>
      <div
        className={`${styles.priceValue} ${danger ? styles.priceDanger : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

function DateRow({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div className={styles.dateRow}>
      <span className={styles.dateLabel}>{label}</span>
      <span
        className={
          highlight
            ? styles.dateOverdue
            : muted
              ? styles.dateMuted
              : styles.dateValue
        }
      >
        {value}
      </span>
    </div>
  );
}

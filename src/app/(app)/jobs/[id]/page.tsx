"use client";

import Link from "next/link";
import { use, type CSSProperties } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getGarmentEmoji, getGarmentLabel } from "@/constants/garments";
import { getEffectiveMeasurementFields } from "@/features/measurements/measurementFieldStorage";
import { getCustomerDisplayName } from "@/features/scheduler/components/JobCardManifest";
import { useI18n } from "@/i18n/useI18n";
import type { StringKey, SupportedLanguage } from "@/i18n/strings";
import { useGetCustomerQuery } from "@/store/api/customerApi";
import { useGetJobQuery, useUpdateJobStatusMutation } from "@/store/api/jobCardApi";
import { getStatusColor, useTheme } from "@/theme/ThemeProvider";
import {
  JOB_STATUS_FLOW,
  type GarmentType,
  type JobCard,
  type JobStatus,
  type MeasurementSet,
} from "@/types/shared";
import { formatDate, isOverdue } from "@/utils/dates";
import { formatIndianPhone, getCallLink, getWaShareLink } from "@/utils/phone";

import styles from "./job-detail.module.css";

const STATUS_KEYS: Record<JobStatus, StringKey> = {
  received: "job.status.received",
  cutting: "job.status.cutting",
  stitching: "job.status.stitching",
  trial: "job.status.trial",
  finishing: "job.status.finishing",
  ready: "job.status.ready",
  delivered: "job.status.delivered",
  cancelled: "job.status.cancelled",
};

const PIPELINE_STATUSES: JobStatus[] = [
  "received",
  "cutting",
  "stitching",
  "trial",
  "finishing",
  "ready",
  "delivered",
];

const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

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

function pillStyle(color: string): CSSProperties {
  return { ["--pill-bg" as string]: color };
}

function btnStyle(color: string): CSSProperties {
  return { ["--btn-bg" as string]: color };
}

function stepStyle(color: string): CSSProperties {
  return { ["--step-color" as string]: color };
}

function inr(n: number | undefined): string {
  if (n == null) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

function resolveColorChip(color?: string): string | null {
  if (!color) return null;
  const key = color.trim().toLowerCase();
  if (FABRIC_COLOR_HEX[key]) return FABRIC_COLOR_HEX[key];
  const firstToken = key.split(/[\s/]+/)[0] ?? "";
  return FABRIC_COLOR_HEX[firstToken] ?? null;
}

type MeasurementDisplayEntry = {
  key: string;
  label: string;
  display: string;
};

function measurementEntriesFromSet(
  data: Pick<MeasurementSet, "fields" | "textFields" | "unit">,
  garment: GarmentType,
  language: SupportedLanguage
): MeasurementDisplayEntry[] {
  const fieldDefs = getEffectiveMeasurementFields(garment);
  const labelFor = (key: string) => {
    const def = fieldDefs.find((f) => f.key === key);
    return def?.labels[language] ?? def?.labels.en ?? key;
  };
  const unit = data.unit;
  const entries: MeasurementDisplayEntry[] = [];

  for (const [key, value] of Object.entries(data.fields ?? {})) {
    const textVal = data.textFields?.[key];
    entries.push({
      key,
      label: labelFor(key),
      display: textVal ?? `${value}${unit ? ` ${unit}` : ""}`,
    });
  }
  for (const [key, value] of Object.entries(data.textFields ?? {})) {
    if (data.fields?.[key] !== undefined) continue;
    entries.push({ key, label: labelFor(key), display: value });
  }
  return entries;
}

function buildMeasurementDisplay(
  job: JobCard,
  garment: GarmentType,
  language: SupportedLanguage,
  customerMeasurements?: MeasurementSet
): { entries: MeasurementDisplayEntry[] } | null {
  const item = job.items[0];
  const snap = item?.measurementSnapshot;
  if (snap) {
    const entries = measurementEntriesFromSet(snap, garment, language);
    if (entries.length > 0) return { entries };
  }
  const custom = item?.customMeasurements;
  if (custom && Object.keys(custom).length > 0) {
    const entries = Object.entries(custom).map(([key, value]) => ({
      key,
      label: key,
      display: `${value}${snap?.unit ? ` ${snap.unit}` : ""}`,
    }));
    if (entries.length > 0) return { entries };
  }
  if (
    customerMeasurements?.fields &&
    Object.keys(customerMeasurements.fields).length > 0
  ) {
    const entries = measurementEntriesFromSet(
      customerMeasurements,
      garment,
      language
    );
    if (entries.length > 0) return { entries };
  }
  return null;
}

function pipelineIndex(status: JobStatus): number {
  if (status === "cancelled") return -1;
  return PIPELINE_STATUSES.indexOf(status);
}

function WhatsAppIcon() {
  return (
    <svg className={styles.waIcon} viewBox="0 0 24 24" aria-hidden>
      <path d={WA_PATH} />
    </svg>
  );
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, language } = useI18n();
  const theme = useTheme();

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useGetJobQuery(id, { skip: !id });
  const { data: customer } = useGetCustomerQuery(job?.customerId ?? "", {
    skip: !job?.customerId,
  });
  const [updateStatus, { isLoading: updating }] = useUpdateJobStatusMutation();

  if (!id) {
    return (
      <MotionDiv className={`${styles.page} stitch-page-pattern`}>
        <p className={styles.stateError}>{t("common.error")}</p>
      </MotionDiv>
    );
  }

  if (isLoading) {
    return (
      <MotionDiv className={`${styles.page} stitch-page-pattern`}>
        <p className={styles.stateMessage}>{t("common.loading")}</p>
      </MotionDiv>
    );
  }

  if (isError || !job) {
    return (
      <MotionDiv className={`${styles.page} stitch-page-pattern`}>
        <BackLink />
        <p className={styles.stateMessage}>{t("common.error")}</p>
        <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
          {t("common.retry")}
        </button>
      </MotionDiv>
    );
  }

  const nextStates = JOB_STATUS_FLOW[job.status];
  const customerDisplayName = getCustomerDisplayName(customer, language);
  const item = job.items[0];
  const garment = item?.garmentType ?? "custom";
  const garmentLabel =
    item?.garmentLabel || getGarmentLabel(garment, language);
  const quantity = item?.quantity ?? 1;
  const statusColor = getStatusColor(theme, job.status);
  const overdue =
    isOverdue(job.dates.promisedAt) &&
    job.status !== "delivered" &&
    job.status !== "cancelled";
  const colorChip = resolveColorChip(job.fabric?.color);
  const displayMeasurements = buildMeasurementDisplay(
    job,
    garment,
    language,
    customer?.measurements?.[garment]
  );
  const currentPipelineIdx = pipelineIndex(job.status);
  const phone = customer?.phone ?? "";

  const shareText =
    `${t("app.name")}: ${customerDisplayName || job.jobNumber}\n` +
    `${getGarmentEmoji(garment)} ${garmentLabel}\n` +
    `${t("job.wizard.deliveryDate")}: ${formatDate(job.dates.promisedAt, { language })}\n` +
    `${t(STATUS_KEYS[job.status])}`;

  const forwardStates = nextStates.filter((s) => s !== "cancelled");
  const canCancel = nextStates.includes("cancelled");

  return (
    <MotionDiv className={`${styles.page} stitch-page-pattern`}>
      <header className={styles.topBar}>
        <BackLink />
        <MotionDiv className={styles.headerMain}>
          <h1 className={styles.jobNumber}>{job.jobNumber}</h1>
          <div className={styles.headerMeta}>
            <span className={styles.statusPill} style={pillStyle(statusColor)}>
              {t(STATUS_KEYS[job.status])}
            </span>
            <span
              className={`${styles.dateChip}${overdue ? ` ${styles.dateChipOverdue}` : ""}`}
            >
              <MaterialIcon name="event" size={16} />
              {formatDate(job.dates.promisedAt, { language })}
            </span>
            {overdue ? (
              <span className={styles.overdueBadge}>
                <MaterialIcon name="warning" size={14} />
                Overdue
              </span>
            ) : null}
          </div>
        </MotionDiv>
      </header>

      {customer ? (
        <section className={styles.customerCard}>
          <div className={styles.customerRow}>
            <MotionDiv className={styles.avatar} aria-hidden>
              {initials(customerDisplayName || "?")}
            </MotionDiv>
            <div className={styles.customerInfo}>
              <h2 className={styles.customerName}>
                {customerDisplayName || t("customers.title")}
              </h2>
              {phone ? (
                <p className={styles.customerPhone}>{formatIndianPhone(phone)}</p>
              ) : null}
            </div>
          </div>
          {phone ? (
            <MotionDiv className={styles.contactActions}>
              <a
                href={getCallLink(phone)}
                className={`${styles.contactBtn} ${styles.contactCall}`}
              >
                <MaterialIcon name="call" size={18} />
                {t("customers.callNow")}
              </a>
              <a
                href={getWaShareLink(phone, shareText)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.contactBtn} ${styles.contactWa}`}
              >
                <WhatsAppIcon />
                {t("customers.whatsapp")}
              </a>
            </MotionDiv>
          ) : null}
        </section>
      ) : null}

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t("job.wizard.pickGarment")}</h2>
        <div className={styles.garmentRow}>
          <span className={styles.garmentEmoji} aria-hidden>
            {getGarmentEmoji(garment)}
          </span>
          <div>
            <p className={styles.garmentLabel}>{garmentLabel}</p>
            <p className={styles.garmentQty}>× {quantity}</p>
          </div>
        </div>
        {job.fabric?.type || job.fabric?.color ? (
          <div className={styles.fabricRow}>
            {colorChip ? (
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: colorChip }}
                title={job.fabric.color}
                aria-hidden
              />
            ) : null}
            <span>
              {[job.fabric.type, job.fabric.color].filter(Boolean).join(" · ")}
            </span>
          </div>
        ) : null}
        {job.fabric?.notes ? (
          <p className={styles.fabricNotes}>{job.fabric.notes}</p>
        ) : null}
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t("job.wizard.measurements")}</h2>
        {displayMeasurements ? (
          <ul className={styles.measureGrid}>
            {displayMeasurements.entries.map((entry) => (
              <li key={entry.key} className={styles.measureChip}>
                {entry.label}: <strong>{entry.display}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyHint}>{t("measurements.emptyHint")}</p>
        )}
      </section>

      {job.pricing?.quoted !== undefined ? (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t("job.wizard.price")}</h2>
          <p className={styles.priceMain}>{inr(job.pricing.quoted)}</p>
          <div className={styles.priceBreakdown}>
            <span>
              Advance {inr(job.pricing.advance ?? 0)}
            </span>
          </div>
          <MotionDiv className={styles.balanceRow}>
            <span className={styles.balanceLabel}>Balance</span>
            <span className={styles.balanceAmount}>
              {inr(job.pricing.balance ?? 0)}
            </span>
          </MotionDiv>
        </section>
      ) : null}

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t("job.markNextStatus")}</h2>
        {job.status === "cancelled" ? (
          <p className={styles.emptyHint}>{t(STATUS_KEYS.cancelled)}</p>
        ) : (
          <div
            className={styles.stepper}
            role="list"
            aria-label={t("job.markNextStatus")}
          >
            {PIPELINE_STATUSES.map((stepStatus, idx) => {
              const isActive = stepStatus === job.status;
              const isDone =
                currentPipelineIdx >= 0 && idx < currentPipelineIdx;
              const stepColor = getStatusColor(theme, stepStatus);
              const stepClass = [
                styles.step,
                isActive ? styles.stepActive : "",
                isDone ? styles.stepDone : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <MotionDiv
                  key={stepStatus}
                  className={stepClass}
                  style={stepStyle(stepColor)}
                  role="listitem"
                >
                  <span className={styles.stepDot} />
                  <span className={styles.stepLabel}>
                    {t(STATUS_KEYS[stepStatus])}
                  </span>
                </MotionDiv>
              );
            })}
          </div>
        )}

        {nextStates.length > 0 ? (
          <div className={styles.statusActions}>
            {forwardStates.length > 0 ? (
              <div className={styles.nextStatusRow}>
                {forwardStates.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={updating}
                    className={styles.statusBtn}
                    style={btnStyle(getStatusColor(theme, status))}
                    onClick={() =>
                      updateStatus({ id, payload: { status } })
                    }
                  >
                    → {t(STATUS_KEYS[status])}
                  </button>
                ))}
              </div>
            ) : null}
            {canCancel ? (
              <button
                type="button"
                disabled={updating}
                className={styles.statusBtnCancel}
                onClick={() =>
                  updateStatus({ id, payload: { status: "cancelled" } })
                }
              >
                {t(STATUS_KEYS.cancelled)}
              </button>
            ) : null}
          </div>
        ) : null}
      </section>

      {job.statusHistory.length > 0 ? (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Timeline</h2>
          <ul className={styles.timelineList}>
            {job.statusHistory.map((h, i) => (
              <li key={i} className={styles.timelineItem}>
                {formatDate(h.at, { language, withTime: true })} ·{" "}
                {t(STATUS_KEYS[h.status])}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className={styles.actions}>
        <Link href={`/jobs/${id}/receipt`} className={styles.actionLink}>
          <MaterialIcon name="receipt_long" size={20} />
          View receipt
        </Link>
        {phone ? (
          <a
            href={getWaShareLink(phone, shareText)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.actionWa}
          >
            <WhatsAppIcon />
            {t("job.shareOnWhatsapp")}
          </a>
        ) : null}
      </div>
    </MotionDiv>
  );
}

function BackLink() {
  const { t } = useI18n();
  return (
    <Link
      href="/today"
      className={`${styles.backLink} touch-target`}
      aria-label={t("common.back")}
    >
      <MaterialIcon name="arrow_back" size={22} />
    </Link>
  );
}

/** Alias avoids clashing with framer-motion if added later */
function MotionDiv({
  className,
  children,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  role?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

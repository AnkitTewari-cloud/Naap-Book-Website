"use client";

import Link from "next/link";
import { use, useMemo } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getGarmentEmoji, getGarmentLabel } from "@/constants/garments";
import { getCustomerDisplayName } from "@/features/scheduler/components/JobCardManifest";
import { useI18n } from "@/i18n/useI18n";
import type { StringKey } from "@/i18n/strings";
import { useGetCustomerQuery } from "@/store/api/customerApi";
import { useListJobsQuery } from "@/store/api/jobCardApi";
import {
  GARMENT_TYPES,
  type Customer,
  type GarmentType,
  type JobCard,
  type JobStatus,
  type MeasurementSet,
} from "@/types/shared";
import { formatDate } from "@/utils/dates";
import {
  formatIndianPhone,
  getCallLink,
  getSmsLink,
  getWaShareLink,
} from "@/utils/phone";

import styles from "./customer-detail.module.css";

const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

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

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

function avatarVariant(name: string): "default" | "alt" | "green" {
  const code = name.charCodeAt(0) ?? 0;
  if (code % 3 === 1) return "alt";
  if (code % 3 === 2) return "green";
  return "default";
}

function formatTagLabel(tag: string): string {
  if (tag === "vip") return "VIP Client";
  if (tag === "active") return "Active";
  return tag.replace(/_/g, " ");
}

function WhatsAppIcon() {
  return (
    <svg className={styles.waIcon} viewBox="0 0 24 24" aria-hidden>
      <path d={WA_PATH} />
    </svg>
  );
}

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, language } = useI18n();
  const { data: customer, isLoading, isError } = useGetCustomerQuery(id, {
    skip: !id,
  });
  const { data: jobsData } = useListJobsQuery(
    { customerId: id, limit: 50 },
    { skip: !id }
  );

  const pastJobs = useMemo(() => {
    const items = jobsData?.items ?? [];
    return [...items].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [jobsData?.items]);

  if (!id) {
    return (
      <PageShell>
        <p className={styles.error}>{t("common.error")}</p>
      </PageShell>
    );
  }

  if (isLoading) {
    return (
      <PageShell>
        <p className={styles.muted}>{t("common.loading")}</p>
      </PageShell>
    );
  }

  if (isError || !customer) {
    return (
      <PageShell>
        <BackLink />
        <p className={styles.error}>{t("common.error")}</p>
      </PageShell>
    );
  }

  const displayName = getCustomerDisplayName(customer, language);
  const measuredGarments = GARMENT_TYPES.filter(
    (g) => customer.measurements?.[g]
  );
  const phone = customer.phone ?? "";
  const waMessage = `Namaste ${displayName}`;

  return (
    <PageShell>
      <BackLink />
      <CustomerHero
        customer={customer}
        displayName={displayName}
        phone={phone}
        waMessage={waMessage}
      />

      {customer.notes ? (
        <section className={styles.section} aria-labelledby="customer-notes">
          <h2 id="customer-notes" className={styles.sectionTitle}>
            Notes
          </h2>
          <p className={styles.notesCard}>{customer.notes}</p>
        </section>
      ) : null}

      <section className={styles.section} aria-labelledby="customer-measurements">
        <h2 id="customer-measurements" className={styles.sectionTitle}>
          {t("job.wizard.measurements")}
        </h2>
        {measuredGarments.length === 0 ? (
          <p className={styles.muted}>No measurements saved yet.</p>
        ) : (
          <ul className={styles.measureGrid}>
            {measuredGarments.map((garmentType) => (
              <MeasurementCard
                key={garmentType}
                garmentType={garmentType}
                measurement={customer.measurements[garmentType]}
              />
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section} aria-labelledby="customer-jobs">
        <h2 id="customer-jobs" className={styles.sectionTitle}>
          Past jobs
        </h2>
        {pastJobs.length === 0 ? (
          <p className={styles.muted}>No past jobs</p>
        ) : (
          <ul className={styles.jobList}>
            {pastJobs.map((job) => (
              <li key={job._id}>
                <PastJobRow job={job} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        href={`/job/new?customerId=${customer._id}`}
        className={styles.newJobBtn}
      >
        <MaterialIcon name="add" size={20} />
        {t("job.new")}
      </Link>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}

function BackLink() {
  const { t } = useI18n();
  return (
    <Link href="/customers" className={styles.backLink}>
      <MaterialIcon name="arrow_back" size={18} />
      {t("common.back")}
    </Link>
  );
}

function CustomerHero({
  customer,
  displayName,
  phone,
  waMessage,
}: {
  customer: Customer;
  displayName: string;
  phone: string;
  waMessage: string;
}) {
  const { t } = useI18n();
  const variant = avatarVariant(displayName);
  const avatarClass =
    variant === "alt"
      ? styles.avatarAlt
      : variant === "green"
        ? styles.avatarGreen
        : "";

  return (
    <article className={styles.heroCard}>
      {variant === "default" ? (
        <div className={styles.heroAccent} aria-hidden />
      ) : null}
      <div className={styles.heroMain}>
        <div className={`${styles.avatar} ${avatarClass}`.trim()}>
          {customer.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={customer.photoUrl} alt="" className={styles.photo} />
          ) : (
            <span>{initials(displayName)}</span>
          )}
        </div>
        <div className={styles.heroInfo}>
          <h1 className={styles.heroName}>{displayName}</h1>
          {phone ? (
            <a href={getCallLink(phone)} className={styles.heroPhone}>
              <MaterialIcon name="call" size={18} />
              {formatIndianPhone(phone)}
            </a>
          ) : null}
          {customer.tags && customer.tags.length > 0 ? (
            <div className={styles.tagRow}>
              {customer.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {formatTagLabel(tag)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {phone ? (
        <div className={styles.actions}>
          <a
            href={getCallLink(phone)}
            className={`${styles.actionBtn} ${styles.actionCall}`}
            title={t("customers.callNow")}
          >
            <MaterialIcon name="call" size={20} />
          </a>
          <a
            href={getSmsLink(phone, waMessage)}
            className={`${styles.actionBtn} ${styles.actionSms}`}
            title={t("customers.sms")}
          >
            <MaterialIcon name="sms" size={20} />
          </a>
          <a
            href={getWaShareLink(phone, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.actionBtn} ${styles.actionWa}`}
            title={t("customers.whatsapp")}
          >
            <WhatsAppIcon />
          </a>
        </div>
      ) : null}
    </article>
  );
}

function MeasurementCard({
  garmentType,
  measurement: set,
}: {
  garmentType: GarmentType;
  measurement?: MeasurementSet;
}) {
  const { language } = useI18n();
  const fields = set?.fields ?? {};
  const fieldEntries = Object.entries(fields);

  return (
    <li className={styles.measureCard}>
      <div className={styles.measureHeader}>
        <span>
          {getGarmentEmoji(garmentType)}{" "}
          {getGarmentLabel(garmentType, language)}
        </span>
        {set?.unit ? (
          <span className={styles.measureUnit}>({set.unit})</span>
        ) : null}
      </div>
      {fieldEntries.length > 0 ? (
        <div className={styles.fieldRow}>
          {fieldEntries.map(([key, value]) => (
            <span key={key} className={styles.fieldChip}>
              {key}: <strong>{value}</strong>
            </span>
          ))}
        </div>
      ) : (
        <p className={styles.measureEmpty}>No fields recorded</p>
      )}
    </li>
  );
}

function PastJobRow({ job }: { job: JobCard }) {
  const { t, language } = useI18n();
  const garment = job.items[0]?.garmentType ?? "custom";
  const garmentLabel =
    job.items[0]?.garmentLabel || getGarmentLabel(garment, language);

  return (
    <Link href={`/jobs/${job._id}`} className={styles.jobRow}>
      <div className={styles.jobRowTop}>
        <p className={styles.jobNumber}>
          {job.jobNumber ? `#${job.jobNumber}` : t("job.title")}
        </p>
        <span className={styles.jobStatus}>{t(STATUS_KEYS[job.status])}</span>
      </div>
      <p className={styles.jobGarment}>
        {getGarmentEmoji(garment)} {garmentLabel}
      </p>
      <p className={styles.jobMeta}>
        <MaterialIcon name="event" size={14} />
        {formatDate(job.dates.promisedAt, { language })}
        <span className={styles.jobChevron} aria-hidden>
          <MaterialIcon name="chevron_right" size={18} />
        </span>
      </p>
    </Link>
  );
}

"use client";

import Link from "next/link";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getGarmentLabel } from "@/constants/garments";
import { getCustomerDisplayName } from "@/features/scheduler/components/JobCardManifest";
import { useI18n } from "@/i18n/useI18n";
import type { Customer, GarmentType } from "@/types/shared";
import {
  formatIndianPhone,
  getCallLink,
  getSmsLink,
  getWaShareLink,
} from "@/utils/phone";

import styles from "./CustomerGridCard.module.css";

const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

function locationLine(customer: Customer): string | null {
  const a = customer.address;
  if (!a) return null;
  const bits = [a.landmark, a.city, a.text].filter(Boolean);
  return bits[0] ?? null;
}

function primaryGarment(customer: Customer): GarmentType | null {
  const keys = Object.keys(customer.measurements ?? {}) as GarmentType[];
  return keys[0] ?? null;
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

export function CustomerGridCard({ customer }: { customer: Customer }) {
  const { t, language } = useI18n();
  const displayName = getCustomerDisplayName(customer, language);
  const phone = customer.phone ?? "";
  const tag = customer.tags?.[0];
  const garment = primaryGarment(customer);
  const hasMeasurements = Object.keys(customer.measurements ?? {}).length > 0;
  const hasActive = customer.tags?.includes("active") || tag === "vip";
  const measurementsPending = !hasMeasurements && !hasActive;
  const variant = avatarVariant(displayName);
  const avatarClass =
    variant === "alt"
      ? styles.avatarAlt
      : variant === "green"
        ? styles.avatarGreen
        : "";

  const loc = locationLine(customer);

  return (
    <article
      className={`${styles.card}${measurementsPending ? ` ${styles.cardMuted}` : ""}`}
    >
      {variant === "default" ? (
        <div className={styles.cardAccent} aria-hidden />
      ) : null}
      <Link href={`/customers/${customer._id}`} className={styles.mainLink}>
        <div className={`${styles.avatar} ${avatarClass}`.trim()}>
          {customer.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={customer.photoUrl} alt="" className={styles.photo} />
          ) : (
            <span>{initials(displayName)}</span>
          )}
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{displayName}</h3>
          <div className={styles.tagRow}>
            {tag ? <p className={styles.tag}>{formatTagLabel(tag)}</p> : null}
            {garment ? (
              <span className={styles.garmentTag}>
                {getGarmentLabel(garment, language)}
              </span>
            ) : null}
          </div>
          {hasActive ? (
            <p className={styles.active}>
              <span className={styles.activeDot} />
              {t("customers.activeOrder")}
            </p>
          ) : measurementsPending ? (
            <p className={styles.pending}>
              <MaterialIcon name="pending_actions" size={14} />
              {t("customers.measurementsPending")}
            </p>
          ) : customer.notes ? (
            <p className={styles.meta}>{customer.notes.slice(0, 48)}</p>
          ) : null}
        </div>
      </Link>
      <div className={styles.details}>
        {phone ? (
          <p className={styles.detailRow}>
            <span className={styles.detailIcon}>
              <MaterialIcon name="call" size={18} />
            </span>
            {formatIndianPhone(phone)}
          </p>
        ) : null}
        {loc ? (
          <p className={styles.detailRow}>
            <span className={styles.detailIcon}>
              <MaterialIcon name="location_on" size={18} />
            </span>
            <span className={styles.truncate}>{loc}</span>
          </p>
        ) : null}
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
            href={getSmsLink(phone, `Namaste ${displayName}`)}
            className={`${styles.actionBtn} ${styles.actionSms}`}
            title={t("customers.sms")}
          >
            <MaterialIcon name="sms" size={20} />
          </a>
          <a
            href={getWaShareLink(phone, `Namaste ${displayName}`)}
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
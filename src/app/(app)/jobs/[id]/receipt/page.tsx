"use client";

import Link from "next/link";
import { use, useMemo } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getGarmentLabel } from "@/constants/garments";
import {
  BillDocument,
  type BillLineItem,
} from "@/features/billing/BillDocument";
import { getCustomerDisplayName } from "@/features/scheduler/components/JobCardManifest";
import { useI18n } from "@/i18n/useI18n";
import { useGetMeQuery } from "@/store/api/authApi";
import { useGetCustomerQuery } from "@/store/api/customerApi";
import { useGetJobQuery } from "@/store/api/jobCardApi";
import type { JobCard } from "@/types/shared";
import { formatDate } from "@/utils/dates";
import { getWaShareLink } from "@/utils/phone";

import styles from "./receipt.module.css";

const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

function inr(n: number | undefined): string {
  if (n == null || n === 0) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

function buildBillItems(job: JobCard): BillLineItem[] {
  const quoted = job.pricing?.quoted ?? 0;
  const items = job.items ?? [];
  if (items.length === 0) {
    if (quoted <= 0) return [];
    return [{ description: "Stitching", qty: 1, rate: quoted }];
  }
  const totalQty = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const rateEach =
    quoted > 0 && totalQty > 0 ? Math.round(quoted / totalQty) : quoted;
  return items.map((item) => ({
    description: item.garmentLabel ?? item.garmentType,
    garmentType: item.garmentType,
    qty: item.quantity || 1,
    rate: rateEach,
  }));
}

function WhatsAppIcon() {
  return (
    <svg className={styles.waIcon} viewBox="0 0 24 24" aria-hidden>
      <path d={WA_PATH} />
    </svg>
  );
}

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, language } = useI18n();
  const { data: job, isLoading } = useGetJobQuery(id, { skip: !id });
  const { data: customer } = useGetCustomerQuery(job?.customerId ?? "", {
    skip: !job?.customerId,
  });
  const { data: tailor } = useGetMeQuery();

  const shareText = useMemo(() => {
    if (!job) return "";
    const garment = job.items?.[0]?.garmentType ?? "custom";
    const lines = [
      `${tailor?.shopName ?? t("app.name")}`,
      customer ? getCustomerDisplayName(customer, language) : "",
      `${getGarmentLabel(garment, language)} · ${job.jobNumber}`,
      `${t("job.wizard.deliveryDate")}: ${formatDate(job.dates.promisedAt, { language })}`,
      `Quoted: ${inr(job.pricing?.quoted)}`,
      `Advance: ${inr(job.pricing?.advance)}`,
      `Balance: ${inr(job.pricing?.balance)}`,
    ];
    return lines.filter(Boolean).join("\n");
  }, [job, customer, tailor, language, t]);

  const billItems = useMemo(
    () => (job ? buildBillItems(job) : []),
    [job]
  );

  if (isLoading || !job) {
    return (
      <div className={`${styles.page} stitch-page-pattern`}>
        <div className={styles.inner}>
          <p className={styles.loading}>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const customerName = customer
    ? getCustomerDisplayName(customer, language)
    : "—";
  const phone = customer?.phone ?? "";
  const billDate = formatDate(job.dates.receivedAt, { language });

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <div className={styles.inner}>
        <header className={styles.toolbar}>
          <Link href={`/jobs/${id}`} className={styles.backLink}>
            <MaterialIcon name="arrow_back" size={20} />
            {t("common.back")}
          </Link>
          <button
            type="button"
            className={styles.printBtn}
            onClick={() => window.print()}
          >
            <MaterialIcon name="print" size={20} />
            Print
          </button>
        </header>

        <h1 className={styles.pageTitle}>Receipt</h1>

        <section className={styles.billCard} aria-label="Bill">
          <BillDocument
            className={styles.billDoc}
            shopName={tailor?.shopName ?? t("app.name")}
            shopPhone={tailor?.phone}
            billNumber={job.jobNumber}
            billDate={billDate}
            customerName={customerName}
            customerPhone={customer?.phone}
            items={billItems}
            advance={job.pricing?.advance ?? 0}
            withGst={false}
          />
        </section>

        {phone || (typeof navigator !== "undefined" && "share" in navigator) ? (
          <div className={styles.shareSection}>
            {phone ? (
              <a
                className={styles.waBtn}
                href={getWaShareLink(phone, shareText)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                {t("job.shareOnWhatsapp")}
              </a>
            ) : null}
            <div className={styles.secondaryActions}>
              {phone ? (
                <>
                  <a className={styles.secondaryBtn} href={`tel:${phone}`}>
                    <MaterialIcon name="call" size={18} />
                    {t("customers.callNow")}
                  </a>
                  <a
                    className={styles.secondaryBtn}
                    href={`sms:${phone}?body=${encodeURIComponent(shareText)}`}
                  >
                    <MaterialIcon name="sms" size={18} />
                    SMS
                  </a>
                </>
              ) : null}
              {typeof navigator !== "undefined" && "share" in navigator ? (
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() =>
                    void navigator.share({
                      title: t("app.name"),
                      text: shareText,
                    })
                  }
                >
                  <MaterialIcon name="share" size={18} />
                  Share
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

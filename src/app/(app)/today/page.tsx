"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getCustomerDisplayName } from "@/features/scheduler/components/JobCardManifest";
import {
  TodayDeliveryRow,
  getDeliveryTier,
  type DeliveryTier,
} from "@/features/scheduler/components/TodayDeliveryRow";
import { useI18n } from "@/i18n/useI18n";
import { useListCustomersQuery } from "@/store/api/customerApi";
import { useListJobsQuery } from "@/store/api/jobCardApi";
import { endOfDay, startOfDay } from "@/utils/dates";

import styles from "./today.module.css";

type StatusFilter = Record<DeliveryTier, boolean>;

const TIER_ORDER: Record<DeliveryTier, number> = {
  delayed: 0,
  pending: 1,
  ready: 2,
};

const DEFAULT_FILTER: StatusFilter = {
  ready: true,
  pending: true,
  delayed: true,
};

export default function TodayPage() {
  const { t, language } = useI18n();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(DEFAULT_FILTER);

  const range = useMemo(() => {
    const today = new Date();
    return {
      from: startOfDay(today).toISOString(),
      to: endOfDay(today).toISOString(),
    };
  }, []);

  const { data: jobs, isLoading } = useListJobsQuery({
    from: range.from,
    to: range.to,
    status: "not_delivered",
    limit: 50,
  });
  const { data: customers } = useListCustomersQuery({ limit: 200 });

  const customerById = useMemo(() => {
    const map: Record<string, { name: string; phone?: string }> = {};
    customers?.items.forEach((c) => {
      map[c._id] = {
        name: getCustomerDisplayName(c, language),
        phone: c.phone,
      };
    });
    return map;
  }, [customers, language]);

  const filteredItems = useMemo(() => {
    const items = jobs?.items ?? [];
    return items
      .filter((job) => statusFilter[getDeliveryTier(job)])
      .sort((a, b) => {
        const ta = TIER_ORDER[getDeliveryTier(a)];
        const tb = TIER_ORDER[getDeliveryTier(b)];
        if (ta !== tb) return ta - tb;
        return (
          new Date(a.dates.promisedAt).getTime() -
          new Date(b.dates.promisedAt).getTime()
        );
      });
  }, [jobs, statusFilter]);

  const toggleFilter = (tier: DeliveryTier) => {
    setStatusFilter((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <div className={styles.inner}>
        <header className={styles.pageHeader}>
          <div className={styles.headerIcon} aria-hidden>
            <MaterialIcon name="checkroom" size={28} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>{t("today.title")}</h1>
            <p className={styles.pageSubtitle}>
              Manage jobs scheduled for pickup today.
            </p>
          </div>
        </header>

        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>Filter by Status:</span>
          <div className={styles.filterOptions}>
            {(["ready", "pending", "delayed"] as const).map((tier) => (
              <label key={tier} className={styles.filterOption}>
                <input
                  type="checkbox"
                  className={styles.filterCheck}
                  checked={statusFilter[tier]}
                  onChange={() => toggleFilter(tier)}
                />
                <span className={styles.filterText}>
                  {tier === "ready"
                    ? "Ready"
                    : tier === "pending"
                      ? "Pending"
                      : "Delayed"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className={styles.muted}>{t("common.loading")}</p>
        ) : filteredItems.length === 0 ? (
          <TodayEmpty hasJobs={(jobs?.items?.length ?? 0) > 0} />
        ) : (
          <ul className={styles.list}>
            {filteredItems.map((job) => (
              <li key={job._id}>
                <TodayDeliveryRow
                  job={job}
                  customerName={customerById[job.customerId]?.name}
                  customerPhone={customerById[job.customerId]?.phone}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TodayEmpty({ hasJobs }: { hasJobs: boolean }) {
  const { t } = useI18n();
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden>
        <MaterialIcon name="checkroom" size={48} />
      </span>
      <p className={styles.muted}>
        {hasJobs
          ? "No deliveries match the selected filters."
          : t("today.empty")}
      </p>
      <Link href="/job/new" className={styles.cta}>
        {t("job.new")}
      </Link>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import type { DayStatusSummary } from "@/components/calendar/MonthCalendar";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { CalendarDeliveryCard } from "@/features/calendar/CalendarDeliveryCard";
import { getCustomerDisplayName } from "@/features/scheduler/components/JobCardManifest";
import { useI18n } from "@/i18n/useI18n";
import { useListCustomersQuery } from "@/store/api/customerApi";
import { useListJobsQuery } from "@/store/api/jobCardApi";
import type { JobStatus } from "@/types/shared";
import {
  endOfDay,
  formatDate,
  isoDateOnly,
  startOfDay,
} from "@/utils/dates";

import styles from "./calendar-page.module.css";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const READY_STATUSES: JobStatus[] = ["ready", "delivered"];

export default function CalendarPage() {
  const { t, language } = useI18n();
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedIso, setSelectedIso] = useState(() => isoDateOnly(today));

  const monthStart = useMemo(() => new Date(year, month, 1), [year, month]);
  const monthEnd = useMemo(() => new Date(year, month + 1, 0), [year, month]);

  const { data: jobs, isLoading } = useListJobsQuery({
    from: startOfDay(monthStart).toISOString(),
    to: endOfDay(monthEnd).toISOString(),
    limit: 200,
  });
  const { data: customers } = useListCustomersQuery({ limit: 200 });

  const customerNames = useMemo(() => {
    const map: Record<string, string> = {};
    customers?.items.forEach((c) => {
      map[c._id] = getCustomerDisplayName(c, language);
    });
    return map;
  }, [customers, language]);

  const countsByDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (const job of jobs?.items ?? []) {
      const key = isoDateOnly(job.dates.promisedAt);
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }, [jobs]);

  const statusByDay = useMemo(() => {
    const map: Record<string, DayStatusSummary> = {};
    for (const job of jobs?.items ?? []) {
      const key = isoDateOnly(job.dates.promisedAt);
      if (!map[key]) map[key] = { ready: 0, active: 0 };
      if (READY_STATUSES.includes(job.status)) map[key].ready += 1;
      else if (job.status !== "cancelled") map[key].active += 1;
    }
    return map;
  }, [jobs]);

  const selectedJobs = useMemo(() => {
    return (jobs?.items ?? [])
      .filter((j) => isoDateOnly(j.dates.promisedAt) === selectedIso)
      .sort(
        (a, b) =>
          new Date(a.dates.promisedAt).getTime() -
          new Date(b.dates.promisedAt).getTime()
      );
  }, [jobs, selectedIso]);

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const deliveryLabel = formatDate(selectedIso, { language });
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <div className={styles.inner}>
        <section className={styles.calendarCard} aria-label={t("calendar.title")}>
          <div className={styles.calendarHeader}>
            <h1 className={styles.monthTitle}>{monthLabel}</h1>
            <nav className={styles.monthNav} aria-label="Month navigation">
              <button
                type="button"
                className={styles.navBtn}
                onClick={goPrevMonth}
                aria-label="Previous month"
              >
                <MaterialIcon name="chevron_left" size={24} />
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navBtnNext}`}
                onClick={goNextMonth}
                aria-label="Next month"
              >
                <MaterialIcon name="chevron_right" size={24} />
              </button>
            </nav>
          </div>
          <div className={styles.calendarBody}>
            <MonthCalendar
              year={year}
              month={month}
              selectedIso={selectedIso}
              countsByDay={countsByDay}
              statusByDay={statusByDay}
              onSelectDay={setSelectedIso}
              embedded
            />
          </div>
        </section>

        <section className={styles.deliveriesSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              {t("calendar.deliveriesFor")} {deliveryLabel}
            </h2>
            {selectedJobs.length > 0 ? (
              <span className={styles.badge}>
                {t("calendar.jobCount").replace(
                  "{count}",
                  String(selectedJobs.length)
                )}
              </span>
            ) : null}
          </div>

          {isLoading ? (
            <p className={styles.muted}>{t("common.loading")}</p>
          ) : selectedJobs.length === 0 ? (
            <p className={styles.muted}>{t("calendar.noJobs")}</p>
          ) : (
            <ul className={styles.list}>
              {selectedJobs.map((job) => (
                <li key={job._id}>
                  <CalendarDeliveryCard
                    job={job}
                    customerName={customerNames[job.customerId]}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

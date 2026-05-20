"use client";

import { useMemo } from "react";

import { isoDateOnly, monthGrid } from "@/utils/dates";

import styles from "./MonthCalendar.module.css";

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

export interface DayStatusSummary {
  ready: number;
  active: number;
}

export interface MonthCalendarProps {
  year: number;
  month: number;
  selectedIso: string;
  countsByDay: Record<string, number>;
  statusByDay?: Record<string, DayStatusSummary>;
  onSelectDay: (iso: string) => void;
  /** When true, omit outer card chrome (parent provides card wrapper). */
  embedded?: boolean;
}

export function MonthCalendar({
  year,
  month,
  selectedIso,
  countsByDay,
  statusByDay,
  onSelectDay,
  embedded = false,
}: MonthCalendarProps) {
  const weeks = useMemo(() => monthGrid(year, month, "mon"), [year, month]);
  const todayIso = isoDateOnly(new Date());

  const rootClass = [styles.root, embedded ? styles.rootEmbedded : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <div className={styles.weekdayRow} aria-hidden>
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className={styles.weekday}>
            {label}
          </span>
        ))}
      </div>
      <div className={styles.weeks}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map((day) => {
              const iso = isoDateOnly(day);
              const inMonth = day.getMonth() === month;
              const count = countsByDay[iso] ?? 0;
              const status = statusByDay?.[iso];
              const isToday = iso === todayIso;
              const isSelected = iso === selectedIso;
              const classNames = [
                styles.day,
                !inMonth ? styles.dayOutside : "",
                isToday ? styles.dayToday : "",
                isSelected ? styles.daySelected : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={iso}
                  type="button"
                  className={classNames}
                  onClick={() => onSelectDay(iso)}
                  aria-label={`${day.getDate()}, ${count} jobs`}
                  aria-pressed={isSelected}
                >
                  <span className={styles.dayNum}>{day.getDate()}</span>
                  {status && (status.ready > 0 || status.active > 0) ? (
                    <span className={styles.statusDots} aria-hidden>
                      {status.ready > 0 ? (
                        <span className={`${styles.dot} ${styles.dotReady}`} />
                      ) : null}
                      {status.active > 0 ? (
                        <span className={`${styles.dot} ${styles.dotActive}`} />
                      ) : null}
                    </span>
                  ) : count > 0 ? (
                    <span className={styles.badge} aria-hidden>
                      {count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

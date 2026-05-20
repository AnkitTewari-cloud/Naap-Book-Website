"use client";

import Link from "next/link";
import { useMemo } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useI18n } from "@/i18n/useI18n";
import { useSummaryQuery, useTakeawaysQuery } from "@/store/api/insightsApi";

import styles from "./insights.module.css";

const KPI_ICONS = ["checkroom", "trending_up", "groups"] as const;

function takeawayMaterialIcon(iconKey: string): string {
  const map: Record<string, string> = {
    calendar: "event",
    trend_up: "trending_up",
    rupee: "payments",
    warning: "warning",
    star: "star",
    workload: "schedule",
    pricing: "sell",
  };
  return map[iconKey] ?? "lightbulb";
}

function formatGarmentLabel(garmentType: string): string {
  return garmentType.charAt(0).toUpperCase() + garmentType.slice(1);
}

export default function InsightsPage() {
  const { t, language } = useI18n();
  const { data: summary, isLoading } = useSummaryQuery({ language });
  const { data: takeaways, isLoading: takeawaysLoading } = useTakeawaysQuery({
    language,
  });

  const topGarment = summary?.garmentMix?.[0];
  const forecast = summary?.forecast;
  const segments = summary?.customerSegments;

  const segmentTotal = segments
    ? segments.newCount + segments.repeatCount + segments.vipCount
    : null;

  const kpis = useMemo(
    () => [
      {
        label: t("insights.garmentMix"),
        value: topGarment ? formatGarmentLabel(topGarment.garmentType) : "—",
        detail:
          topGarment != null ? `${topGarment.percentage}%` : undefined,
        icon: KPI_ICONS[0],
      },
      {
        label: t("insights.forecast"),
        value:
          forecast?.next1Month?.orders != null
            ? String(forecast.next1Month.orders)
            : "—",
        detail: t("insights.nextMonth"),
        icon: KPI_ICONS[1],
      },
      {
        label: t("insights.customerSegments"),
        value: segmentTotal != null ? String(segmentTotal) : "—",
        detail:
          segments != null
            ? `${segments.newCount} / ${segments.repeatCount} / ${segments.vipCount}`
            : undefined,
        icon: KPI_ICONS[2],
      },
    ],
    [t, topGarment, forecast, segmentTotal, segments]
  );

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <div className={styles.inner}>
        <header className={styles.pageHeader}>
          <div className={styles.headerIcon} aria-hidden>
            <MaterialIcon name="psychology" size={28} />
          </div>
          <div className={styles.pageHeaderText}>
            <h1 className={styles.pageTitle}>{t("insights.title")}</h1>
            <p className={styles.pageSubtitle}>{t("analytics.subtitle")}</p>
          </div>
          <Link href="/analytics" className={styles.analyticsLink}>
            <MaterialIcon name="bar_chart" size={18} />
            {t("analytics.title")}
          </Link>
        </header>

        <section className={styles.kpiRow} aria-label={t("insights.title")}>
          {isLoading ? (
            <p className={styles.muted}>{t("common.loading")}</p>
          ) : (
            kpis.map((kpi) => (
              <article key={kpi.label} className={styles.kpiCard}>
                <div className={styles.kpiTop}>
                  <span className={styles.kpiLabel}>{kpi.label}</span>
                  <MaterialIcon
                    name={kpi.icon}
                    size={22}
                    className={styles.kpiIcon}
                  />
                </div>
                <div className={styles.kpiBottom}>
                  <span className={styles.kpiValue}>{kpi.value}</span>
                  {kpi.detail ? (
                    <span className={styles.kpiDetail}>{kpi.detail}</span>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </section>

        <section className={styles.takeawaysSection}>
          <h2 className={styles.sectionTitle}>{t("insights.takeaways")}</h2>
          {takeawaysLoading ? (
            <p className={styles.muted}>{t("common.loading")}</p>
          ) : takeaways && takeaways.length > 0 ? (
            <ul className={styles.takeawayList}>
              {takeaways.map((ta) => (
                <li key={ta.id}>
                  <article className={styles.takeawayCard}>
                    <div className={styles.takeawayHeader}>
                      <MaterialIcon
                        name={takeawayMaterialIcon(ta.iconKey)}
                        size={22}
                        className={styles.takeawayIcon}
                      />
                      <span className={styles.takeawayCategory}>
                        {ta.category.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className={styles.takeawayText}>{ta.text}</p>
                  </article>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </div>
  );
}

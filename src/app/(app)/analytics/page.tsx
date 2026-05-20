"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import {
  DUMMY_ANALYTICS,
  type AnalyticsRepeatCustomer,
} from "@/features/dashboard/dummyDashboardData";
import { useI18n } from "@/i18n/useI18n";

import styles from "./analytics.module.css";

function formatInr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatOrdersLabel(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

const KPI_ICONS = [
  "trending_up",
  "receipt_long",
  "group_add",
  "speed",
] as const;

const PERIOD_KEYS = [
  "analytics.period.thisMonth",
  "analytics.period.lastMonth",
  "analytics.period.thisQuarter",
  "analytics.period.thisYear",
] as const;

type PeriodKey = (typeof PERIOD_KEYS)[number];

export default function AnalyticsPage() {
  const { t } = useI18n();
  const [period, setPeriod] = useState<PeriodKey>("analytics.period.thisMonth");

  const chartData = useMemo(
    () =>
      DUMMY_ANALYTICS.monthLabels.map((month, i) => ({
        month,
        revenue: DUMMY_ANALYTICS.monthlyRevenue[i] ?? 0,
        expenses: DUMMY_ANALYTICS.monthlyExpenses[i] ?? 0,
      })),
    []
  );

  const kpis = useMemo(
    () => [
      {
        label: t("analytics.kpi.totalRevenue"),
        value: formatInr(DUMMY_ANALYTICS.totalRevenue),
        delta: DUMMY_ANALYTICS.kpiDeltas.totalRevenue,
        icon: KPI_ICONS[0],
      },
      {
        label: t("analytics.kpi.avgOrderValue"),
        value: formatInr(DUMMY_ANALYTICS.avgOrderValue),
        delta: DUMMY_ANALYTICS.kpiDeltas.avgOrderValue,
        icon: KPI_ICONS[1],
      },
      {
        label: t("analytics.kpi.customerRetention"),
        value: `${DUMMY_ANALYTICS.repeatCustomers}%`,
        delta: DUMMY_ANALYTICS.kpiDeltas.repeatCustomers,
        icon: KPI_ICONS[2],
      },
      {
        label: t("analytics.kpi.efficiency"),
        value: String(DUMMY_ANALYTICS.efficiencyJobsPerDay),
        delta: DUMMY_ANALYTICS.kpiDeltas.efficiency,
        icon: KPI_ICONS[3],
      },
    ],
    [t]
  );

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <Link href="/dashboard" className={styles.backLink}>
        <MaterialIcon name="arrow_back" size={20} />
        {t("analytics.backToDashboard")}
      </Link>

      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>{t("analytics.title")}</h1>
          <p className={styles.pageSubtitle}>{t("analytics.subtitle")}</p>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.selectWrap}>
            <select
              className={styles.periodSelect}
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodKey)}
              aria-label={t("analytics.period.thisMonth")}
            >
              {PERIOD_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(key)}
                </option>
              ))}
            </select>
            <MaterialIcon
              name="arrow_drop_down"
              size={22}
              className={styles.selectIcon}
            />
          </div>
          <button type="button" className={styles.exportBtn}>
            <MaterialIcon name="download" size={18} />
            {t("analytics.export")}
          </button>
        </div>
      </header>

      <section className={styles.kpiRow} aria-label={t("analytics.title")}>
        {kpis.map((kpi) => (
          <article key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <MaterialIcon name={kpi.icon} size={22} className={styles.kpiIcon} />
            </div>
            <div className={styles.kpiBottom}>
              <span className={styles.kpiValue}>{kpi.value}</span>
              <span
                className={
                  kpi.delta.positive ? styles.deltaUp : styles.deltaDown
                }
              >
                {kpi.delta.value}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.chartsRow}>
        <article className={`${styles.card} ${styles.chartWide}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>
              {t("analytics.chart.revenueVsExpenses")}
            </h2>
            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendRevenue}`} />
                {t("analytics.chart.revenue")}
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendExpenses}`} />
                {t("analytics.chart.expenses")}
              </span>
            </div>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-danger)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-danger)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--color-border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(Number(v) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-text)",
                    fontSize: 13,
                  }}
                  formatter={(value, name) => [
                    formatInr(Number(value)),
                    name === "revenue"
                      ? t("analytics.chart.revenue")
                      : t("analytics.chart.expenses"),
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  fill="url(#revenueFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--color-danger)"
                  fill="url(#expenseFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.sectionTitle}>
            {t("analytics.chart.ordersByGarment")}
          </h2>
          <ul className={styles.garmentList}>
            {DUMMY_ANALYTICS.topGarments.map((g, i) => (
              <li key={g.name} className={styles.garmentRow}>
                <div className={styles.garmentMeta}>
                  <span className={styles.garmentName}>{g.name}</span>
                  <span className={styles.garmentPct}>{g.pct}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${g.pct}%`,
                      opacity: 1 - i * 0.12,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className={styles.bottomRow}>
        <article className={`${styles.card} ${styles.customersWide}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>
              {t("analytics.topRepeatCustomers")}
            </h2>
            <button type="button" className={styles.viewAllBtn}>
              {t("analytics.viewAll")}
            </button>
          </div>
          <ul className={styles.customerList}>
            {DUMMY_ANALYTICS.topRepeatCustomers.map((c) => (
              <CustomerRow
                key={c.initials}
                customer={c}
                ordersLabel={formatOrdersLabel(
                  t("analytics.ordersThisMonth"),
                  c.ordersThisMonth
                )}
              />
            ))}
          </ul>
        </article>

        <div className={styles.insightsCol}>
          <article className={styles.insightCard}>
            <div className={styles.insightHeader}>
              <MaterialIcon name="schedule" size={22} className={styles.insightIcon} />
              <span className={styles.insightLabel}>
                {t("analytics.insight.peakHours")}
              </span>
            </div>
            <h3 className={styles.insightValue}>
              {DUMMY_ANALYTICS.insights.peakHours}
            </h3>
            <p className={styles.insightNote}>
              {DUMMY_ANALYTICS.insights.peakHoursNote}
            </p>
          </article>
          <article className={styles.insightCard}>
            <div className={styles.insightHeader}>
              <MaterialIcon name="star" size={22} className={styles.insightIcon} />
              <span className={styles.insightLabel}>
                {t("analytics.insight.topGarment")}
              </span>
            </div>
            <h3 className={styles.insightValue}>
              {DUMMY_ANALYTICS.insights.topGarment}
            </h3>
            <p className={styles.insightNote}>
              {DUMMY_ANALYTICS.insights.topGarmentNote}
            </p>
          </article>
        </div>
      </section>

      <p className={styles.demoNote}>{t("analytics.demoNote")}</p>
    </div>
  );
}

function CustomerRow({
  customer,
  ordersLabel,
}: {
  customer: AnalyticsRepeatCustomer;
  ordersLabel: string;
}) {
  const trendIcon =
    customer.trendPositive === true
      ? "arrow_upward"
      : customer.trendPositive === false
        ? "arrow_downward"
        : "horizontal_rule";

  return (
    <li className={styles.customerRow}>
      <div className={styles.customerLeft}>
        <span
          className={`${styles.avatar} ${styles[`avatar_${customer.avatarTone}`]}`}
        >
          {customer.initials}
        </span>
        <div>
          <p className={styles.customerName}>{customer.name}</p>
          <p className={styles.customerMeta}>{ordersLabel}</p>
        </div>
      </div>
      <div className={styles.customerRight}>
        <p className={styles.customerSpend}>{formatInr(customer.spend)}</p>
        <p
          className={
            customer.trendPositive === true
              ? styles.trendUp
              : customer.trendPositive === false
                ? styles.trendDown
                : styles.trendNeutral
          }
        >
          <MaterialIcon name={trendIcon} size={14} />
          {customer.trendLabel}
        </p>
      </div>
    </li>
  );
}

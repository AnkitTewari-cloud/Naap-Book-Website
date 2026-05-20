"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import {
  DASHBOARD_KPI,
  DUMMY_TODAY_ORDERS,
  DUMMY_TOMORROW_ORDERS,
} from "@/features/dashboard/dummyDashboardData";
import { useI18n } from "@/i18n/useI18n";

import styles from "./dashboard.module.css";

const THREAD_SPOOL_IMG =
  "https://lh3.googleusercontent.com/aida/ADBb0uhX1mzOBgEokOuORU6irXieR-TNfo7vX7ulKQ5kjffM_kCC69qTAfwPfkBeDzpQI-t0vxoOzfLxMyiT0DAs8rceMMoydldBECkvKqqxEwsMlTxsRqz7_Wl1lWNM8LneZsL2u0PrWryzqtTY_99-KIytySt4-AHmYtQYyWEYvfZUnbNfrjV8awSyGGpH1MXaL413nreiAKW1-iqm0iGojm4LLuyd2JiEm0k0PxvOMZpIxykYhg2NdyiY4qA";

type UrgentAlert = {
  id: string;
  border: "error" | "warning" | "info";
  icon: string;
  title: string;
  detail: string;
  href?: string;
};

const URGENT_ALERTS: UrgentAlert[] = [
  {
    id: "overdue",
    border: "error",
    icon: "warning",
    title: "Overdue Delivery",
    detail: "Job #NB-8422 (Priya Singh) was due yesterday.",
    href: "/jobs/demo-job-t-3",
  },
  {
    id: "inventory",
    border: "warning",
    icon: "inventory_2",
    title: "Low Inventory",
    detail: "White thread stock is running low (approx. 2 days left).",
  },
  {
    id: "inquiry",
    border: "info",
    icon: "support_agent",
    title: "Customer Inquiry",
    detail: "New message from Rahul regarding fabric choice.",
  },
];

function formatDashboardNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

function customerInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusVariant(
  label: string,
): "success" | "warning" | "neutral" | "danger" {
  const lower = label.toLowerCase();
  if (lower.includes("ready") || lower.includes("delivered")) return "success";
  if (lower.includes("pending") || lower.includes("fabric")) return "danger";
  if (
    lower.includes("progress") ||
    lower.includes("stitch") ||
    lower.includes("finish") ||
    lower.includes("cut")
  ) {
    return "warning";
  }
  return "neutral";
}

function avatarTone(index: number): "primary" | "info" | "tertiary" {
  const tones: ("primary" | "info" | "tertiary")[] = [
    "primary",
    "info",
    "tertiary",
  ];
  return tones[index % tones.length];
}

function exportReportStub() {
  window.alert("Export report will be available in a future release.");
}

const URGENT_PINNED_KEY = "naapbook_dashboard_urgent_pinned";
const URGENT_OPEN_KEY = "naapbook_dashboard_urgent_open";

function readStoredFlag(key: string, defaultValue: boolean): boolean {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return raw === "1";
  } catch {
    return defaultValue;
  }
}

function writeStoredFlag(key: string, value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [urgentPinned, setUrgentPinned] = useState(false);
  const [urgentOpen, setUrgentOpen] = useState(true);
  const [urgentHydrated, setUrgentHydrated] = useState(false);

  useEffect(() => {
    setUrgentPinned(readStoredFlag(URGENT_PINNED_KEY, false));
    setUrgentOpen(readStoredFlag(URGENT_OPEN_KEY, true));
    setUrgentHydrated(true);
  }, []);

  const toggleUrgentOpen = useCallback(() => {
    if (urgentPinned) return;
    setUrgentOpen((open) => {
      const next = !open;
      writeStoredFlag(URGENT_OPEN_KEY, next);
      return next;
    });
  }, [urgentPinned]);

  const toggleUrgentPin = useCallback(() => {
    setUrgentPinned((pinned) => {
      const next = !pinned;
      writeStoredFlag(URGENT_PINNED_KEY, next);
      if (next) {
        setUrgentOpen(true);
        writeStoredFlag(URGENT_OPEN_KEY, true);
      }
      return next;
    });
  }, []);

  const urgentExpanded = urgentPinned || urgentOpen;
  const tomorrowPreview = DUMMY_TOMORROW_ORDERS.slice(0, 3);
  const tomorrowOverflow = Math.max(
    0,
    DASHBOARD_KPI.dueTomorrowCount - tomorrowPreview.length,
  );

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageSub}>
            Welcome back. Here&apos;s what&apos;s happening with your shop today.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/analytics" className={styles.btnPrimary}>
            <MaterialIcon name="analytics" size={18} />
            Advanced Analytics
          </Link>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={exportReportStub}
          >
            <MaterialIcon name="download" size={18} />
            Export Report
          </button>
        </div>
      </header>

      <div className={styles.kpiGrid}>
        <section className={styles.kpiCard} aria-label="Total sales">
          <div className={styles.kpiCardTop}>
            <span className={`${styles.kpiIcon} ${styles.kpiIconSecondary}`}>
              <MaterialIcon name="payments" filled size={22} />
            </span>
            <span className={styles.trendBadge}>
              <MaterialIcon name="trending_up" size={12} />
              {DASHBOARD_KPI.totalSalesTrendPct}%
            </span>
          </div>
          <div>
            <h2 className={styles.kpiLabel}>Total Sales</h2>
            <p className={styles.kpiValue}>
              {formatDashboardNumber(DASHBOARD_KPI.totalSales)}
            </p>
            <p className={styles.kpiHint}>vs last month</p>
          </div>
        </section>

        <section className={styles.kpiCard} aria-label="Forecast revenue">
          <div className={styles.kpiCardTop}>
            <span className={`${styles.kpiIcon} ${styles.kpiIconInfo}`}>
              <MaterialIcon name="monitoring" filled size={22} />
            </span>
            <span className={styles.trendBadge}>
              <MaterialIcon name="trending_up" size={12} />
              {DASHBOARD_KPI.forecastTrendPct}%
            </span>
          </div>
          <div>
            <h2 className={styles.kpiLabel}>Forecast Revenue</h2>
            <p className={styles.kpiValue}>
              {formatDashboardNumber(DASHBOARD_KPI.forecastRevenue)}
            </p>
            <p className={styles.kpiHint}>Projected for current month</p>
          </div>
        </section>

        <section className={styles.kpiCard} aria-label="Due tomorrow">
          <div className={styles.kpiCardTop}>
            <span className={`${styles.kpiIcon} ${styles.kpiIconMuted}`}>
              <MaterialIcon name="event_upcoming" filled size={22} />
            </span>
          </div>
          <div>
            <h2 className={styles.kpiLabel}>Due Tomorrow</h2>
            <p className={styles.kpiValue}>{DASHBOARD_KPI.dueTomorrowCount}</p>
            <div className={styles.avatarStack} aria-hidden>
              {tomorrowPreview.map((order, index) => (
                <span
                  key={order.jobId}
                  className={`${styles.stackAvatar} ${styles[`avatar_${avatarTone(index)}`]}`}
                  title={order.customerName}
                >
                  {customerInitials(order.customerName)}
                </span>
              ))}
              {tomorrowOverflow > 0 ? (
                <span className={styles.stackMore}>+{tomorrowOverflow}</span>
              ) : null}
            </div>
          </div>
        </section>

        <Link
          href="/job/new"
          className={`${styles.kpiCard} ${styles.kpiCardNewJob}`}
        >
          <div className={styles.kpiCardTop}>
            <span className={styles.newJobIcon}>
              <MaterialIcon name="add" size={24} />
            </span>
          </div>
          <div>
            <p className={styles.newJobTitle}>{t("job.new")}</p>
            <p className={styles.newJobSub}>Quick Entry</p>
          </div>
        </Link>
      </div>

      <div className={styles.mainGrid}>
        <section
          className={styles.deliveriesPanel}
          aria-label="Today's deliveries"
        >
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={THREAD_SPOOL_IMG}
                alt=""
                className={styles.threadIcon}
                width={24}
                height={24}
              />
              Today&apos;s Deliveries
            </h2>
            <Link href="/today" className={styles.viewAll}>
              View All
            </Link>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Item</th>
                  <th scope="col">Job ID</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_TODAY_ORDERS.map((order, index) => {
                  const variant = statusVariant(order.statusLabel);
                  const tone = avatarTone(index);
                  const jobHref = `/jobs/${order.jobId}`;
                  return (
                    <tr key={order.jobId} className={styles.tableRow}>
                      <td>
                        <Link href={jobHref} className={styles.cellLink}>
                          <span
                            className={`${styles.statusBadge} ${styles[`status_${variant}`]}`}
                          >
                            {order.statusLabel}
                          </span>
                        </Link>
                      </td>
                      <td>
                        <Link href={jobHref} className={styles.cellLink}>
                          <span className={styles.customerCell}>
                            <span
                              className={`${styles.avatar} ${styles[`avatar_${tone}`]}`}
                              aria-hidden
                            >
                              {customerInitials(order.customerName)}
                            </span>
                            <span>{order.customerName}</span>
                          </span>
                        </Link>
                      </td>
                      <td>
                        <Link href={jobHref} className={styles.cellLink}>
                          <span className={styles.itemCell}>
                            {order.garmentLabel}
                          </span>
                        </Link>
                      </td>
                      <td>
                        <Link href={jobHref} className={styles.cellLink}>
                          <span className={styles.jobIdCell}>
                            {order.jobNumber}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.quickActions}>
            <h2 className={styles.quickActionsTitle}>Quick Actions</h2>
            <div className={styles.quickActionsGrid}>
              <Link href="/job/new" className={styles.quickActionBtn}>
                <MaterialIcon name="qr_code_scanner" filled size={24} />
                <span>Scan Tag</span>
              </Link>
              <Link href="/customers/new" className={styles.quickActionBtn}>
                <MaterialIcon name="person_add" filled size={24} />
                <span>New Client</span>
              </Link>
              <Link href="/customers" className={styles.quickActionBtn}>
                <MaterialIcon name="sms" filled size={24} />
                <span>Send SMS</span>
              </Link>
              <Link href="/today" className={styles.quickActionBtn}>
                <MaterialIcon name="receipt_long" filled size={24} />
                <span>Invoice</span>
              </Link>
            </div>
          </div>

          <section
            className={`${styles.urgentPanel} ${urgentPinned ? styles.urgentPanelPinned : ""} ${!urgentExpanded ? styles.urgentPanelCollapsed : ""}`}
            aria-label="Urgent attention"
          >
            <div className={styles.urgentPanelHeader}>
              <button
                type="button"
                className={styles.urgentToggle}
                onClick={toggleUrgentOpen}
                aria-expanded={urgentExpanded}
                aria-controls="urgent-attention-list"
                disabled={urgentPinned}
                title={
                  urgentPinned
                    ? t("dashboard.urgentUnpin")
                    : urgentExpanded
                      ? t("dashboard.urgentCollapse")
                      : t("dashboard.urgentExpand")
                }
              >
                <h2 className={styles.urgentTitle}>Urgent Attention</h2>
                <MaterialIcon
                  name={urgentExpanded ? "expand_less" : "expand_more"}
                  size={22}
                  className={styles.urgentChevron}
                />
              </button>
              <button
                type="button"
                className={`${styles.pinBtn} ${urgentPinned ? styles.pinBtnActive : ""}`}
                onClick={toggleUrgentPin}
                aria-pressed={urgentPinned}
                aria-label={urgentPinned ? t("dashboard.urgentUnpin") : t("dashboard.urgentPin")}
                title={urgentPinned ? t("dashboard.urgentUnpin") : t("dashboard.urgentPin")}
              >
                <MaterialIcon name="push_pin" size={20} filled={urgentPinned} />
              </button>
            </div>
            {urgentHydrated && urgentExpanded ? (
              <ul id="urgent-attention-list" className={styles.urgentList}>
                {URGENT_ALERTS.map((alert) => (
                  <li
                    key={alert.id}
                    className={`${styles.urgentItem} ${styles[`urgent_${alert.border}`]}`}
                  >
                    {alert.href ? (
                      <Link href={alert.href} className={styles.urgentLink}>
                        <UrgentAlertBody alert={alert} />
                      </Link>
                    ) : (
                      <div className={styles.urgentLink}>
                        <UrgentAlertBody alert={alert} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}

function UrgentAlertBody({ alert }: { alert: UrgentAlert }) {
  return (
    <>
      <span
        className={`${styles.urgentIcon} ${styles[`urgentIcon_${alert.border}`]}`}
      >
        <MaterialIcon name={alert.icon} size={18} />
      </span>
      <div>
        <p className={styles.urgentItemTitle}>{alert.title}</p>
        <p className={styles.urgentItemDetail}>{alert.detail}</p>
      </div>
    </>
  );
}

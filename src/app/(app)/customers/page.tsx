"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { CustomerGridCard } from "@/features/customers/CustomerGridCard";
import { getCustomerDisplayName } from "@/features/scheduler/components/JobCardManifest";
import { useI18n } from "@/i18n/useI18n";
import { useListCustomersQuery } from "@/store/api/customerApi";
import type { Customer } from "@/types/shared";

import styles from "./customers.module.css";

type SortMode = "name" | "recent";
type TagFilter = "all" | "vip" | "active";

function exportCustomersCsv(customers: Customer[]) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = ["name", "phone", "altPhone", "notes", "tags"];
  const rows = customers.map((c) =>
    [c.name, c.phone ?? "", c.altPhone ?? "", c.notes ?? "", (c.tags ?? []).join(";")]
      .map(escape)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function CustomersPage() {
  const { t, language } = useI18n();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("name");
  const [tagFilter, setTagFilter] = useState<TagFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(12);

  const { data, isLoading } = useListCustomersQuery({
    search: search.trim() || undefined,
    limit: 200,
  });

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    const q = search.trim().toLowerCase();
    let list = items;
    if (q) {
      list = list.filter((c) => {
        const name = getCustomerDisplayName(c, language).toLowerCase();
        const phone = (c.phone ?? "").toLowerCase();
        const loc = [
          c.address?.city,
          c.address?.landmark,
          c.address?.text,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return name.includes(q) || phone.includes(q) || loc.includes(q);
      });
    }
    if (tagFilter === "vip") {
      list = list.filter((c) => c.tags?.includes("vip"));
    } else if (tagFilter === "active") {
      list = list.filter((c) => c.tags?.includes("active"));
    }
    const sorted = [...list];
    if (sort === "name") {
      sorted.sort((a, b) =>
        getCustomerDisplayName(a, language).localeCompare(
          getCustomerDisplayName(b, language)
        )
      );
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return sorted;
  }, [data?.items, search, language, tagFilter, sort]);

  const visible = filtered.slice(0, visibleLimit);
  const hasMore = visibleLimit < filtered.length;

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{t("customers.directoryTitle")}</h1>
            <p className={styles.subtitle}>{t("customers.subtitle")}</p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.exportBtn}
              onClick={() => exportCustomersCsv(filtered)}
              disabled={filtered.length === 0}
            >
              CSV
            </button>
            <Link href="/customers/new" className={styles.primaryBtn}>
              <MaterialIcon name="person_add" size={18} />
              {t("customers.add")}
            </Link>
          </div>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>
              <MaterialIcon name="search" size={22} />
            </span>
            <input
              type="search"
              className={styles.searchInput}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleLimit(12);
              }}
              placeholder={t("customers.searchPlaceholder")}
            />
          </div>
          <div className={styles.toolbarActions}>
            <button
              type="button"
              className={`${styles.toolBtn} ${showFilters ? styles.toolBtnActive : ""}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <MaterialIcon name="filter_list" size={18} />
              {t("customers.filters")}
            </button>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={() =>
                setSort((s) => (s === "name" ? "recent" : "name"))
              }
              aria-label={
                sort === "name"
                  ? t("customers.sortName")
                  : t("customers.sortRecent")
              }
            >
              <MaterialIcon name="sort" size={18} />
              {t("customers.sort")}
            </button>
          </div>
        </div>

        {showFilters ? (
          <div className={styles.filterPanel}>
            <p className={styles.filterLabel}>{t("customers.filters")}</p>
            <div className={styles.chipRow}>
              {(["all", "vip", "active"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`${styles.chip} ${tagFilter === f ? styles.chipOn : ""}`}
                  onClick={() => {
                    setTagFilter(f);
                    setVisibleLimit(12);
                  }}
                >
                  {f === "all" ? "All" : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <p className={styles.muted}>{t("common.loading")}</p>
        ) : filtered.length === 0 ? (
          <p className={styles.muted}>{t("customers.empty")}</p>
        ) : (
          <>
            <ul className={styles.grid}>
              {visible.map((customer) => (
                <li key={customer._id}>
                  <CustomerGridCard customer={customer} />
                </li>
              ))}
            </ul>
            {hasMore ? (
              <div className={styles.loadMoreWrap}>
                <button
                  type="button"
                  className={styles.loadMore}
                  onClick={() => setVisibleLimit((n) => n + 12)}
                >
                  {t("customers.loadMore")}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

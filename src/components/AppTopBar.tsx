"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useI18n } from "@/i18n/useI18n";
import { useGetMeQuery } from "@/store/api/authApi";

import styles from "./AppTopBar.module.css";

const PAGE_TITLE_KEYS: Record<string, string> = {
  "/dashboard": "dashboard.title",
  "/today": "today.title",
  "/gallery": "gallery.title",
  "/customers": "customers.title",
  "/calendar": "calendar.title",
  "/profile": "profile.systemSettings",
  "/analytics": "dashboard.title",
};

function resolvePageTitleKey(pathname: string): string | null {
  if (PAGE_TITLE_KEYS[pathname]) return PAGE_TITLE_KEYS[pathname]!;
  if (pathname.startsWith("/profile")) return "profile.title";
  if (pathname.startsWith("/calendar")) return "calendar.title";
  if (pathname.startsWith("/customers")) return "customers.title";
  if (pathname.startsWith("/gallery")) return "gallery.title";
  if (pathname.startsWith("/today")) return "today.title";
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/analytics"))
    return "dashboard.title";
  return null;
}

function initialsFromName(name?: string): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function AppTopBar() {
  const pathname = usePathname() ?? "";
  const { t } = useI18n();
  const { data: tailor } = useGetMeQuery();

  const pageTitleKey = resolvePageTitleKey(pathname);
  const title = pageTitleKey
    ? t(
        pageTitleKey as
          | "calendar.title"
          | "profile.title"
          | "dashboard.title"
          | "today.title"
          | "gallery.title"
          | "customers.title"
      )
    : tailor?.shopName?.trim() || t("app.name");

  return (
    <header className={styles.bar} aria-label="Page header">
      <div className={styles.titleWrap}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <MaterialIcon name="notifications" size={24} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label={t("profile.help")}>
          <MaterialIcon name="help" size={24} />
        </button>
        <Link href="/profile" className={styles.avatar} aria-label={t("profile.title")}>
          <span className={styles.avatarInitials}>
            {initialsFromName(tailor?.name)}
          </span>
        </Link>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { AppTopBar } from "@/components/AppTopBar";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useI18n } from "@/i18n/useI18n";
import { useGetMeQuery } from "@/store/api/authApi";

import styles from "./AppShell.module.css";

type NavItem = {
  key: string;
  href: string;
  labelKey:
    | "dashboard.title"
    | "today.title"
    | "gallery.title"
    | "customers.title"
    | "calendar.title"
    | "profile.title"
    | "profile.systemSettings";
  icon: string;
  match: (path: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    labelKey: "dashboard.title",
    icon: "dashboard",
    match: (p) =>
      p === "/dashboard" ||
      p.startsWith("/dashboard/") ||
      p === "/analytics" ||
      p.startsWith("/analytics/"),
  },
  {
    key: "today",
    href: "/today",
    labelKey: "today.title",
    icon: "event_available",
    match: (p) => p === "/today" || p.startsWith("/today/"),
  },
  {
    key: "gallery",
    href: "/gallery",
    labelKey: "gallery.title",
    icon: "photo_library",
    match: (p) => p === "/gallery" || p.startsWith("/gallery/"),
  },
  {
    key: "customers",
    href: "/customers",
    labelKey: "customers.title",
    icon: "group",
    match: (p) => p === "/customers" || p.startsWith("/customers/"),
  },
  {
    key: "calendar",
    href: "/calendar",
    labelKey: "calendar.title",
    icon: "calendar_month",
    match: (p) => p === "/calendar" || p.startsWith("/calendar/"),
  },
  {
    key: "profile",
    href: "/profile",
    labelKey: "profile.title",
    icon: "person",
    match: (p) => p === "/profile" || p.startsWith("/profile/"),
  },
];

const MOBILE_BOTTOM_ITEMS: NavItem[] = [
  NAV_ITEMS[0]!,
  NAV_ITEMS[1]!,
  { ...NAV_ITEMS[2]!, icon: "gallery_thumbnail" },
  {
    key: "profile",
    href: "/profile",
    labelKey: "profile.systemSettings",
    icon: "settings",
    match: (p) => p === "/profile" || p.startsWith("/profile/"),
  },
];

function shopInitials(shopName?: string): string {
  if (!shopName?.trim()) return "NB";
  const words = shopName.trim().split(/\s+/);
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return `${words[0]![0] ?? ""}${words[1]![0] ?? ""}`.toUpperCase();
}

type MobileTitleKey =
  | "app.name"
  | "calendar.title"
  | "customers.title"
  | "dashboard.title"
  | "gallery.title"
  | "profile.title"
  | "today.title";

function resolveMobileTitle(
  pathname: string,
  t: (key: MobileTitleKey) => string,
  shopName?: string
): string {
  if (pathname.startsWith("/profile")) return t("profile.title");
  if (pathname.startsWith("/calendar")) return t("calendar.title");
  if (pathname.startsWith("/customers")) return t("customers.title");
  if (pathname.startsWith("/gallery")) return t("gallery.title");
  if (pathname.startsWith("/today")) return t("today.title");
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/analytics")
  ) {
    return t("dashboard.title");
  }
  return shopName?.trim() || t("app.name");
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const { t } = useI18n();
  const { data: tailor } = useGetMeQuery();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileNav();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen, closeMobileNav]);

  const mobileTitle = resolveMobileTitle(pathname, t, tailor?.shopName);
  const logoLabel = shopInitials(tailor?.shopName);

  const renderNavLinks = (onNavigate?: () => void) =>
    NAV_ITEMS.map((item) => {
      const active = item.match(pathname);
      return (
        <li key={item.key}>
          <Link
            href={item.href}
            className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
            onClick={onNavigate}
          >
            <MaterialIcon name={item.icon} size={24} filled={active} />
            {t(item.labelKey)}
          </Link>
        </li>
      );
    });

  return (
    <div className={`app-shell ${styles.shell}`}>
      <button
            type="button"
            className={`${styles.mobileBackdrop} ${mobileNavOpen ? styles.mobileBackdropVisible : ""}`}
            aria-label="Close menu"
            onClick={closeMobileNav}
          />

          <nav
            className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarMobileOpen : ""}`}
            aria-label="Main navigation"
          >
            <div className={styles.brandBlock}>
              <div className={styles.brandLogo} aria-hidden>
                {logoLabel}
              </div>
              <div>
                <div className={styles.brandTitle}>{t("app.name")}</div>
                <p className={styles.brandSub}>Management Portal</p>
              </div>
            </div>

            <Link
              href="/customers"
              className={styles.sidebarSearch}
              onClick={closeMobileNav}
            >
              <MaterialIcon name="search" size={20} filled />
              {t("common.search")}
            </Link>

            <ul className={styles.navList}>{renderNavLinks(closeMobileNav)}</ul>

            <Link
              href="/job/new"
              className={styles.sidebarNewJob}
              onClick={closeMobileNav}
            >
              <MaterialIcon name="add" size={20} filled />
              {t("job.new")}
            </Link>

            <div className={styles.sidebarFooter}>
              <hr className={styles.sidebarFooterRule} />
              <Link
                href="/profile"
                className={`${styles.footerLink} ${pathname.startsWith("/profile") ? styles.footerLinkActive : ""}`}
                onClick={closeMobileNav}
              >
                <MaterialIcon name="settings" size={24} />
                {t("profile.systemSettings")}
              </Link>
            </div>
          </nav>

          <header className={styles.mobileHeader}>
            <Link href="/dashboard" className={styles.mobileBrand}>
              <div className={styles.mobileLogo} aria-hidden>
                {logoLabel}
              </div>
              <h2 className={styles.mobileTitle}>{mobileTitle}</h2>
            </Link>
            <button
              type="button"
              className={styles.menuBtn}
              aria-label="Open menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <MaterialIcon name="menu" size={24} />
            </button>
          </header>

      <AppTopBar />

      <div className={styles.body}>
        <main className={`${styles.main} stitch-page-pattern`}>{children}</main>
      </div>

      <nav
        className={`bottom-nav ${styles.bottomNav}`}
        aria-label="Mobile navigation"
      >
        {MOBILE_BOTTOM_ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`${styles.bottomItem} ${active ? styles.bottomItemActive : ""}`}
            >
              <MaterialIcon name={item.icon} size={24} filled={active} />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

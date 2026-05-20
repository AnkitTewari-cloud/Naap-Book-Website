"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import {
  loadShopSettings,
  saveShopSettings,
  touchLastSync,
} from "@/features/settings/shopSettingsStorage";
import { useI18n } from "@/i18n/useI18n";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  useGetMeQuery,
  useLogoutMutation,
  useUpdateMeMutation,
} from "@/store/api/authApi";
import { clearAuth } from "@/store/authSlice";
import { webStorage } from "@/store/localStorage";
import { useThemeControls } from "@/theme/ThemeProvider";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  THEME_NAMES,
  type SupportedLanguage,
  type ThemeName,
} from "@/types/shared";

import styles from "./profile.module.css";

const THEME_LABELS: Record<ThemeName, string> = {
  minimal_white: "Minimal",
  vibrant: "Vibrant",
  green: "Green",
  dark: "Dark",
};

const THEME_PREVIEW_CLASS: Record<ThemeName, string> = {
  minimal_white: styles.previewLight,
  vibrant: styles.previewVibrant,
  green: styles.previewGreen,
  dark: styles.previewDark,
};

function initialsOf(name?: string): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  return (
    parts
      .slice(0, 2)
      .map((p) => p[0] ?? "")
      .join("")
      .toUpperCase() || "?"
  );
}

function splitName(full?: string): { first: string; last: string } {
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0]!, last: "" };
  return { first: parts[0]!, last: parts.slice(1).join(" ") };
}

function formatLastSync(iso: string | null, language: SupportedLanguage): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const locale =
    language === "hi"
      ? "hi-IN"
      : language === "mr"
        ? "mr-IN"
        : language === "ta"
          ? "ta-IN"
          : language === "kn"
            ? "kn-IN"
            : "en-IN";
  try {
    return d.toLocaleString(locale, {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return d.toLocaleString();
  }
}

function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`${styles.toggle} ${on ? styles.toggleOn : ""}`}
      onClick={onToggle}
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}

export default function ProfilePage() {
  const { t, setLanguage } = useI18n();
  const language = useAppSelector((s) => s.app.language);
  const { themeName, setThemeName } = useThemeControls();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);

  const { data: profile } = useGetMeQuery();
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();

  const [shopDraft, setShopDraft] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [emailAlertsOn, setEmailAlertsOn] = useState(false);
  const [twoFactorOn, setTwoFactorOn] = useState(false);
  const [dataSyncOn, setDataSyncOn] = useState(true);
  const [businessHours, setBusinessHours] = useState("");
  const [lastSyncIso, setLastSyncIso] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.shopName !== undefined) setShopDraft(profile.shopName);
    if (profile?.name !== undefined) {
      setNameDraft(profile.name);
      const { first, last } = splitName(profile.name);
      setFirstName(first);
      setLastName(last);
    }
  }, [profile?.shopName, profile?.name]);

  useEffect(() => {
    const settings = loadShopSettings();
    setNotificationsOn(settings.notificationsEnabled);
    setEmailAlertsOn(settings.emailAlertsEnabled);
    setBusinessHours(settings.businessHours);
    setLastSyncIso(settings.lastSyncIso);
  }, []);

  const changeLanguage = async (lang: SupportedLanguage) => {
    setLanguage(lang);
    try {
      await updateMe({ preferredLanguage: lang }).unwrap();
      const stored = webStorage.getItem("tailor");
      if (stored) {
        const tailor = JSON.parse(stored) as { preferredLanguage?: string };
        tailor.preferredLanguage = lang;
        webStorage.setItem("tailor", JSON.stringify(tailor));
      }
    } catch {
      /* keep local */
    }
  };

  const changeTheme = async (name: ThemeName) => {
    setThemeName(name);
    try {
      await updateMe({ preferredTheme: name }).unwrap();
    } catch {
      /* keep local */
    }
  };

  const isDarkTheme = themeName === "dark";

  const saveDetails = async () => {
    const shopName = shopDraft.trim();
    const name = isDarkTheme
      ? [firstName.trim(), lastName.trim()].filter(Boolean).join(" ")
      : nameDraft.trim();
    try {
      await updateMe({ shopName, name }).unwrap();
    } catch {
      /* ignore */
    }
  };

  const setNotifications = (notificationsEnabled: boolean) => {
    setNotificationsOn(notificationsEnabled);
    saveShopSettings({ notificationsEnabled });
  };

  const setEmailAlerts = (emailAlertsEnabled: boolean) => {
    setEmailAlertsOn(emailAlertsEnabled);
    saveShopSettings({ emailAlertsEnabled });
  };

  const onBusinessHoursBlur = () => {
    const trimmed = businessHours.trim();
    const next = trimmed || loadShopSettings().businessHours;
    setBusinessHours(next);
    saveShopSettings({ businessHours: next });
  };

  const onSyncNow = () => {
    const iso = touchLastSync();
    setLastSyncIso(iso);
  };

  const doLogout = useCallback(async () => {
    try {
      if (refreshToken) await logout({ refreshToken }).unwrap();
    } catch {
      /* ignore */
    }
    dispatch(clearAuth());
    webStorage.clearAuth();
    router.replace("/login");
  }, [dispatch, logout, refreshToken, router]);

  const displayPhone = profile?.phone?.trim();

  const basicDetailsSection = (
    <section className={styles.card}>
      <div className={styles.sectionHead}>
        <MaterialIcon
          name={isDarkTheme ? "manage_accounts" : "account_circle"}
          size={24}
          className={styles.sectionIcon}
        />
        <h2>{isDarkTheme ? "Basic Details" : t("profile.profile")}</h2>
      </div>

      {isDarkTheme ? (
        <>
          <div className={styles.darkPhotoRow}>
            <div className={styles.avatar} aria-hidden>
              {initialsOf(profile?.name)}
            </div>
            <div>
              <button type="button" className={styles.changePhotoDark}>
                Change Photo
              </button>
              <p className={styles.photoHint}>JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>
          <div className={styles.formFields}>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>First Name</span>
                <input
                  type="text"
                  className={styles.input}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Last Name</span>
                <input
                  type="text"
                  className={styles.input}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t("profile.shopName")}</span>
              <input
                type="text"
                className={styles.input}
                value={shopDraft}
                onChange={(e) => setShopDraft(e.target.value)}
              />
            </label>
            {displayPhone ? (
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Phone Number</span>
                <input
                  type="tel"
                  className={styles.input}
                  value={displayPhone}
                  readOnly
                />
              </label>
            ) : null}
            <div className={styles.saveRow}>
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={isLoading}
                onClick={saveDetails}
              >
                {t("profile.saveChanges")}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.basicBody}>
          <div className={styles.avatarCol}>
            <div className={styles.avatar}>
              <span aria-hidden>{initialsOf(nameDraft || profile?.name)}</span>
              <button type="button" className={styles.avatarOverlay} aria-label="Edit photo">
                <MaterialIcon name="edit" size={22} />
              </button>
            </div>
            <button type="button" className={styles.changePhoto}>
              Change Photo
            </button>
          </div>
          <div className={styles.formFields}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t("profile.shopName")}</span>
              <input
                type="text"
                className={styles.input}
                value={shopDraft}
                onChange={(e) => setShopDraft(e.target.value)}
              />
            </label>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>{t("profile.ownerName")}</span>
                <input
                  type="text"
                  className={styles.input}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                />
              </label>
              {displayPhone ? (
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Phone Number</span>
                  <input
                    type="tel"
                    className={styles.input}
                    value={displayPhone}
                    readOnly
                  />
                </label>
              ) : (
                <div />
              )}
            </div>
            <div className={styles.saveRow}>
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={isLoading}
                onClick={saveDetails}
              >
                {t("profile.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );

  const languageSection = (
    <section className={styles.card}>
      <div className={styles.sectionHead}>
        <MaterialIcon name="language" size={24} className={styles.sectionIcon} />
        <h2>{t("profile.language")}</h2>
      </div>
      {isDarkTheme ? (
        <label className={styles.field}>
          <span className={styles.fieldLabel}>System Language</span>
          <div className={styles.langSelectWrap}>
            <select
              className={styles.langSelect}
              value={language}
              onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang].english}
                </option>
              ))}
            </select>
            <MaterialIcon
              name="expand_more"
              size={22}
              className={styles.langSelectIcon}
            />
          </div>
        </label>
      ) : (
        <>
          <p className={styles.langHint}>Select your preferred app language.</p>
          <div className={styles.langList} role="radiogroup" aria-label={t("profile.language")}>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const selected = language === lang;
              return (
                <label
                  key={lang}
                  className={`${styles.langOption} ${selected ? styles.langOptionSelected : ""}`}
                >
                  <span className={selected ? styles.langOptionLabelSelected : undefined}>
                    {LANGUAGE_LABELS[lang].native}
                  </span>
                  <input
                    type="radio"
                    name="app-language"
                    value={lang}
                    className={styles.langRadio}
                    checked={selected}
                    onChange={() => void changeLanguage(lang)}
                    aria-checked={selected}
                  />
                </label>
              );
            })}
          </div>
        </>
      )}
    </section>
  );

  const themeSection = (
    <section className={styles.card}>
      <div className={styles.sectionHead}>
        <MaterialIcon name="palette" size={24} className={styles.sectionIcon} />
        <h2>{t("profile.theme")}</h2>
      </div>
      {isDarkTheme ? (
        <div className={styles.darkThemeGrid}>
          <button
            type="button"
            className={`${styles.darkThemeBtn} ${themeName !== "dark" ? styles.darkThemeBtnSelected : ""}`}
            onClick={() => changeTheme("minimal_white")}
          >
            <div className={`${styles.darkThemeSwatch} ${styles.swatchLight}`}>
              <MaterialIcon name="light_mode" size={22} />
            </div>
            <span className={styles.darkThemeLabel}>Light</span>
          </button>
          <button
            type="button"
            className={`${styles.darkThemeBtn} ${themeName === "dark" ? styles.darkThemeBtnSelected : ""}`}
            onClick={() => changeTheme("dark")}
          >
            <div className={`${styles.darkThemeSwatch} ${styles.swatchDark}`}>
              <MaterialIcon name="dark_mode" size={22} />
            </div>
            <span className={styles.darkThemeLabel}>Midnight Pro</span>
          </button>
        </div>
      ) : (
        <div className={styles.themeGrid}>
          {THEME_NAMES.map((name) => {
            const selected = themeName === name;
            return (
              <button
                key={name}
                type="button"
                className={`${styles.themeTile} ${selected ? styles.themeTileSelected : ""}`}
                onClick={() => changeTheme(name)}
              >
                <div
                  className={`${styles.themePreview} ${THEME_PREVIEW_CLASS[name]}`}
                >
                  <div className={styles.themePreviewBar} />
                  <div className={styles.themePreviewBody}>
                    <div className={styles.themePreviewSidebar} />
                    <div className={styles.themePreviewMain} />
                  </div>
                </div>
                <span className={styles.themeLabel}>{THEME_LABELS[name]}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );

  const systemSection = (
    <section className={`${styles.card} ${styles.systemCard}`}>
      <header className={styles.systemHeader}>
        <h2>{t("profile.systemSettings")}</h2>
      </header>

      <div className={styles.settingRow}>
        <div className={styles.settingInfo}>
          <span className={styles.settingIconWrap}>
            <MaterialIcon
              name={isDarkTheme ? "notifications" : "notifications_active"}
              size={isDarkTheme ? 22 : 18}
            />
          </span>
          <div>
            <p className={styles.settingTitle}>
              {isDarkTheme ? "Email Notifications" : t("profile.notifications")}
            </p>
            <p className={styles.settingHint}>
              {isDarkTheme
                ? "Receive updates on new jobs"
                : "Manage SMS and Email alerts"}
            </p>
          </div>
        </div>
        <Toggle
          label={t("profile.notifications")}
          on={isDarkTheme ? emailAlertsOn : notificationsOn}
          onToggle={() =>
            isDarkTheme
              ? setEmailAlerts(!emailAlertsOn)
              : setNotifications(!notificationsOn)
          }
        />
      </div>

      {isDarkTheme ? (
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingIconWrap}>
              <MaterialIcon name="verified_user" size={22} />
            </span>
            <div>
              <p className={styles.settingTitle}>Two-Factor Auth</p>
              <p className={styles.settingHint}>Enhanced account security</p>
            </div>
          </div>
          <Toggle
            label="Two-Factor Auth"
            on={twoFactorOn}
            onToggle={() => setTwoFactorOn(!twoFactorOn)}
          />
        </div>
      ) : (
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingIconWrap}>
              <MaterialIcon name="schedule" size={18} />
            </span>
            <div>
              <p className={styles.settingTitle}>{t("profile.businessHours")}</p>
              <p className={styles.settingHint}>
                Set store opening and closing times
              </p>
            </div>
          </div>
          <input
            type="text"
            className={styles.hoursInput}
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            onBlur={onBusinessHoursBlur}
            aria-label={t("profile.businessHours")}
          />
        </div>
      )}

      <div className={styles.settingRow}>
        <div className={styles.settingInfo}>
          <span className={styles.settingIconWrap}>
            <MaterialIcon name="cloud_sync" size={isDarkTheme ? 22 : 18} />
          </span>
          <div>
            <p className={styles.settingTitle}>
              {isDarkTheme ? "Data Sync" : t("profile.dataBackup")}
            </p>
            <p className={styles.settingHint}>
              {isDarkTheme
                ? "Auto-sync customer records"
                : `Last synced: ${formatLastSync(lastSyncIso, language)}`}
            </p>
          </div>
        </div>
        {isDarkTheme ? (
          <Toggle
            label="Data Sync"
            on={dataSyncOn}
            onToggle={() => setDataSyncOn(!dataSyncOn)}
          />
        ) : (
          <button type="button" className={styles.syncBtn} onClick={onSyncNow}>
            {t("profile.syncNow")}
          </button>
        )}
      </div>
    </section>
  );

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <header className={styles.pageIntro}>
        <h1 className={styles.pageTitle}>{t("profile.title")}</h1>
        <p className={styles.pageSubtitle}>
          Manage your account details, preferences, and system configurations.
        </p>
      </header>

      <div className={styles.lightGrid}>
        <div className={styles.basicCol}>{basicDetailsSection}</div>
        <div className={styles.prefsCol}>{languageSection}</div>
        <div className={styles.themeCol}>{themeSection}</div>
        <div className={styles.systemCol}>{systemSection}</div>
        <div className={styles.logoutCol}>
          <Link href="/job/new" className={styles.newJobBtn}>
            <MaterialIcon name="add" size={20} filled />
            {t("job.new")}
          </Link>
          <button
            type="button"
            className={styles.logoutBtn}
            disabled={loggingOut}
            onClick={doLogout}
          >
            <MaterialIcon name="logout" size={20} />
            {t("profile.logout")}
          </button>
        </div>
      </div>

      <div className={styles.darkGrid}>
        <div className={styles.darkMain}>{basicDetailsSection}</div>
        <div className={styles.darkSide}>
          {languageSection}
          {themeSection}
          {systemSection}
        </div>
        <div className={styles.logoutCol} style={{ gridColumn: "1 / -1" }}>
          <Link href="/job/new" className={styles.newJobBtn}>
            <MaterialIcon name="add" size={20} filled />
            {t("job.new")}
          </Link>
          <button
            type="button"
            className={styles.logoutBtn}
            disabled={loggingOut}
            onClick={doLogout}
          >
            <MaterialIcon name="logout" size={20} />
            {t("profile.logout")}
          </button>
        </div>
      </div>
    </div>
  );
}

const KEYS = {
  notifications: "naapbook_settings_notifications",
  emailAlerts: "naapbook_settings_email_alerts",
  lastSync: "naapbook_settings_last_sync",
  businessHours: "naapbook_settings_business_hours",
} as const;

export interface ShopSettings {
  notificationsEnabled: boolean;
  emailAlertsEnabled: boolean;
  lastSyncIso: string | null;
  businessHours: string;
}

const DEFAULTS: ShopSettings = {
  notificationsEnabled: true,
  emailAlertsEnabled: false,
  lastSyncIso: null,
  businessHours: "10:00 AM – 8:00 PM",
};

export function loadShopSettings(): ShopSettings {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    return {
      notificationsEnabled:
        localStorage.getItem(KEYS.notifications) !== "false",
      emailAlertsEnabled: localStorage.getItem(KEYS.emailAlerts) === "true",
      lastSyncIso: localStorage.getItem(KEYS.lastSync),
      businessHours:
        localStorage.getItem(KEYS.businessHours) ?? DEFAULTS.businessHours,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveShopSettings(patch: Partial<ShopSettings>): ShopSettings {
  const current = loadShopSettings();
  const next = { ...current, ...patch };
  if (typeof window === "undefined") return next;
  localStorage.setItem(
    KEYS.notifications,
    next.notificationsEnabled ? "true" : "false"
  );
  localStorage.setItem(KEYS.emailAlerts, next.emailAlertsEnabled ? "true" : "false");
  if (next.lastSyncIso) localStorage.setItem(KEYS.lastSync, next.lastSyncIso);
  localStorage.setItem(KEYS.businessHours, next.businessHours);
  return next;
}

export function touchLastSync(): string {
  const iso = new Date().toISOString();
  saveShopSettings({ lastSyncIso: iso });
  return iso;
}

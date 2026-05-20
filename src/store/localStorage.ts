const KEYS = ["accessToken", "refreshToken", "tailor"] as const;

export type StorageKey = (typeof KEYS)[number];

export const webStorage = {
  getItem(key: StorageKey): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: StorageKey, value: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore quota / private mode */
    }
  },
  removeItem(key: StorageKey): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  clearAuth(): void {
    KEYS.forEach((k) => webStorage.removeItem(k));
  },
};

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { DEMO_TAILOR } from "@/features/demo/demoFixtures";
import { DEMO_SKIP_LOGIN } from "@/features/demo/demoMode";
import { setAuth, setHydrated } from "@/store/authSlice";
import { setLanguage, setTheme } from "@/store/appSlice";
import { useAppDispatch, useAppSelector, type AppDispatch } from "@/store";
import { webStorage } from "@/store/localStorage";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type AuthTailor,
  type SupportedLanguage,
  type ThemeName,
} from "@/types/shared";

const PUBLIC_PATHS = new Set(["/login", "/verify-otp", "/demo-access"]);

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.has(pathname);
}

export function persistAuthSession(payload: {
  accessToken: string;
  refreshToken: string;
  tailor: AuthTailor;
}): void {
  webStorage.setItem("accessToken", payload.accessToken);
  webStorage.setItem("refreshToken", payload.refreshToken);
  webStorage.setItem("tailor", JSON.stringify(payload.tailor));
}

export function resolvePreferredLanguage(
  raw?: string | null
): SupportedLanguage {
  const trimmed = raw?.trim();
  if (
    trimmed &&
    SUPPORTED_LANGUAGES.includes(trimmed as SupportedLanguage)
  ) {
    return trimmed as SupportedLanguage;
  }
  return DEFAULT_LANGUAGE;
}

/** Normalize tailor record so stale/missing language does not stick in storage. */
export function normalizeTailorPreferences(tailor: AuthTailor): AuthTailor {
  let next = tailor;

  if (DEMO_SKIP_LOGIN && tailor.id === DEMO_TAILOR.id) {
    next = {
      ...next,
      preferredLanguage: DEMO_TAILOR.preferredLanguage,
      preferredTheme: next.preferredTheme ?? DEMO_TAILOR.preferredTheme,
    };
  }

  const language = resolvePreferredLanguage(next.preferredLanguage);
  if (next.preferredLanguage !== language) {
    next = { ...next, preferredLanguage: language };
  }

  return next;
}

export function applyTailorPreferences(
  dispatch: AppDispatch,
  tailor: AuthTailor
): void {
  dispatch(setLanguage(resolvePreferredLanguage(tailor.preferredLanguage)));
  if (tailor.preferredTheme) {
    dispatch(setTheme(tailor.preferredTheme as ThemeName));
  }
}

export function AppBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const hydrated = useAppSelector((s) => s.auth.hydrated);
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const storedAccess = webStorage.getItem("accessToken");
    const storedRefresh = webStorage.getItem("refreshToken");
    const storedTailor = webStorage.getItem("tailor");

    if (storedAccess && storedRefresh && storedTailor) {
      try {
        const parsed = JSON.parse(storedTailor) as AuthTailor;
        const tailor = normalizeTailorPreferences(parsed);
        if (tailor !== parsed) {
          webStorage.setItem("tailor", JSON.stringify(tailor));
        }
        dispatch(
          setAuth({
            accessToken: storedAccess,
            refreshToken: storedRefresh,
            tailor,
          })
        );
        applyTailorPreferences(dispatch, tailor);
        dispatch(setHydrated(true));
        return;
      } catch {
        webStorage.clearAuth();
      }
    }

    if (DEMO_SKIP_LOGIN) {
      const tailor = normalizeTailorPreferences({
        ...DEMO_TAILOR,
        preferredLanguage: "en",
      });
      const demoSession = {
        accessToken: "demo-access-token",
        refreshToken: "demo-refresh-token",
        tailor,
      };
      persistAuthSession(demoSession);
      dispatch(setAuth(demoSession));
      dispatch(setLanguage("en"));
      applyTailorPreferences(dispatch, tailor);
      dispatch(setHydrated(true));
      return;
    }

    dispatch(setHydrated(true));
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;

    if (pathname === "/") {
      router.replace(accessToken ? "/dashboard" : "/login");
      return;
    }

    const isAuthed = Boolean(accessToken);
    const isPublic = isPublicPath(pathname);

    if (!isAuthed && !isPublic) {
      router.replace("/login");
      return;
    }

    if (isAuthed && (pathname === "/login" || pathname === "/verify-otp")) {
      router.replace("/dashboard");
    }
  }, [hydrated, pathname, accessToken, router]);

  if (!hydrated && !isPublicPath(pathname)) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-muted)",
        }}
      >
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { Provider } from "react-redux";
import { useEffect, type ReactNode } from "react";

import { AppBootstrap } from "@/components/AppBootstrap";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { store, useAppDispatch, useAppSelector } from "@/store";
import { setLanguage, setTheme } from "@/store/appSlice";
import type { SupportedLanguage, ThemeName } from "@/types/shared";

function AppProvidersInner({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((s) => s.app.language);
  const theme = useAppSelector((s) => s.app.theme);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language === "en" ? "en" : language;
    }
  }, [language]);

  return (
    <ThemeProvider
      themeName={theme}
      onThemeNameChange={(name: ThemeName) => dispatch(setTheme(name))}
    >
      <I18nProvider
        language={language}
        onLanguageChange={(lang: SupportedLanguage) => {
          dispatch(setLanguage(lang));
          if (typeof document !== "undefined") {
            document.documentElement.lang = lang === "en" ? "en" : lang;
          }
        }}
      >
        <AppBootstrap>{children}</AppBootstrap>
      </I18nProvider>
    </ThemeProvider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AppProvidersInner>{children}</AppProvidersInner>
    </Provider>
  );
}

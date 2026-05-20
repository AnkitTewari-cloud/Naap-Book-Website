"use client";

import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { DEFAULT_LANGUAGE, type SupportedLanguage } from "./strings";

type I18nContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
};

export const I18nContext = createContext<I18nContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

/**
 * Language state for the web app. Pass `language` from Redux `appSlice` when
 * the store exists: `<I18nProvider language={useAppSelector(s => s.app.language)}>`.
 */
export function I18nProvider({
  children,
  language: controlledLanguage,
  onLanguageChange,
}: {
  children: ReactNode;
  language?: SupportedLanguage;
  onLanguageChange?: (language: SupportedLanguage) => void;
}) {
  const [internalLanguage, setInternalLanguage] =
    useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  const language = controlledLanguage ?? internalLanguage;

  const setLanguage = useCallback(
    (next: SupportedLanguage) => {
      if (controlledLanguage === undefined) {
        setInternalLanguage(next);
      }
      onLanguageChange?.(next);
    },
    [controlledLanguage, onLanguageChange]
  );

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage]
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

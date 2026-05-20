"use client";

import { useCallback, useContext } from "react";

import { I18nContext } from "./I18nProvider";
import { getString, type StringKey } from "./strings";
import type { SupportedLanguage } from "./strings";

export function useI18n(): {
  t: (key: StringKey) => string;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
} {
  const { language, setLanguage } = useContext(I18nContext);
  const t = useCallback(
    (key: StringKey) => getString(language, key),
    [language]
  );
  return { t, language, setLanguage };
}

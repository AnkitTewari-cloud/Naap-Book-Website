"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { applyThemeToDocument } from "./applyTheme";
import { minimalWhite } from "./themes/minimalWhite";
import { vibrant } from "./themes/vibrant";
import { green } from "./themes/green";
import { dark } from "./themes/dark";
import type { JobStatus, Theme, ThemeName } from "./tokens";

export const ALL_THEMES: Record<ThemeName, Theme> = {
  minimal_white: minimalWhite,
  vibrant,
  green,
  dark,
};

const DEFAULT_THEME: ThemeName = "minimal_white";

type ThemeContextValue = {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: minimalWhite,
  themeName: DEFAULT_THEME,
  setThemeName: () => {},
});

export function ThemeProvider({
  children,
  themeName: controlledThemeName,
  onThemeNameChange,
}: {
  children: ReactNode;
  /** When Redux (or parent) controls theme, pass `app.theme` here. */
  themeName?: ThemeName;
  onThemeNameChange?: (name: ThemeName) => void;
}) {
  const [internalThemeName, setInternalThemeName] =
    useState<ThemeName>(DEFAULT_THEME);

  const themeName = controlledThemeName ?? internalThemeName;

  const setThemeName = useCallback(
    (name: ThemeName) => {
      if (controlledThemeName === undefined) {
        setInternalThemeName(name);
      }
      onThemeNameChange?.(name);
    },
    [controlledThemeName, onThemeNameChange]
  );

  const theme = useMemo(
    () => ALL_THEMES[themeName] ?? minimalWhite,
    [themeName]
  );

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, themeName, setThemeName }),
    [theme, themeName, setThemeName]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext).theme;
}

export function useThemeControls(): Pick<
  ThemeContextValue,
  "themeName" | "setThemeName"
> {
  const { themeName, setThemeName } = useContext(ThemeContext);
  return { themeName, setThemeName };
}

export function getStatusColor(theme: Theme, status: JobStatus): string {
  switch (status) {
    case "received":
      return theme.colors.statusReceived;
    case "cutting":
      return theme.colors.statusCutting;
    case "stitching":
      return theme.colors.statusStitching;
    case "trial":
      return theme.colors.statusTrial;
    case "finishing":
      return theme.colors.statusFinishing;
    case "ready":
      return theme.colors.statusReady;
    case "delivered":
      return theme.colors.statusDelivered;
    case "cancelled":
      return theme.colors.statusCancelled;
    default:
      return theme.colors.textMuted;
  }
}

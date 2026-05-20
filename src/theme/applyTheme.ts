import type { Theme } from "./tokens";

/** Stitch Naap Book (Refined) — WhiteTheme.md / naap_book_refined/DESIGN.md */
const STITCH_LIGHT_SURFACES = {
  primaryFixed: "#e2dfff",
  primaryFixedDim: "#c3c0ff",
  surfaceVariant: "#e4e1ee",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f5f2ff",
  surfaceContainer: "#f9fafb",
  surfaceContainerHigh: "#eae6f4",
  surfaceContainerHighest: "#e4e1ee",
} as const;

/** Stitch Midnight Pro — MidnightProTheme.md / midnight_pro/DESIGN.md */
const STITCH_DARK_SURFACES = {
  primaryFixed: "#e2dfff",
  primaryFixedDim: "#c3c0ff",
  surfaceVariant: "#2d3449",
  surfaceContainerLowest: "#060e20",
  surfaceContainerLow: "#131b2e",
  surfaceContainer: "#171f33",
  surfaceContainerHigh: "#222a3d",
  surfaceContainerHighest: "#2d3449",
} as const;

function setColorVars(root: HTMLElement, theme: Theme): void {
  const { colors, name: themeName } = theme;
  const isDark = themeName === "dark";
  const stitch = isDark ? STITCH_DARK_SURFACES : STITCH_LIGHT_SURFACES;
  const map: Record<string, string> = {
    "--color-background": colors.background,
    "--color-surface": colors.surface,
    "--color-surface-elevated": colors.surfaceElevated,
    "--color-surface-muted": colors.surfaceMuted,
    "--color-primary-fixed": stitch.primaryFixed,
    "--color-primary-fixed-dim": stitch.primaryFixedDim,
    "--color-surface-variant": stitch.surfaceVariant,
    "--color-surface-container-lowest": stitch.surfaceContainerLowest,
    "--color-surface-container-low": stitch.surfaceContainerLow,
    "--color-surface-container": stitch.surfaceContainer,
    "--color-surface-container-high": stitch.surfaceContainerHigh,
    "--color-surface-container-highest": stitch.surfaceContainerHighest,
    "--color-primary": colors.primary,
    "--color-primary-text": colors.primaryText,
    "--color-secondary": colors.secondary,
    "--color-secondary-muted": colors.secondaryMuted,
    "--color-text": colors.text,
    "--color-text-muted": colors.textMuted,
    "--color-border": colors.border,
    "--color-border-variant": colors.borderVariant,
    "--color-status-received": colors.statusReceived,
    "--color-status-cutting": colors.statusCutting,
    "--color-status-stitching": colors.statusStitching,
    "--color-status-trial": colors.statusTrial,
    "--color-status-finishing": colors.statusFinishing,
    "--color-status-ready": colors.statusReady,
    "--color-status-delivered": colors.statusDelivered,
    "--color-status-cancelled": colors.statusCancelled,
    "--color-status-overdue": colors.statusOverdue,
    "--color-accent": colors.accent,
    "--color-accent-muted": colors.accentMuted,
    "--color-success": colors.success,
    "--color-warning": colors.warning,
    "--color-danger": colors.danger,
    "--color-whatsapp": colors.whatsappGreen,
    "--shadow-card": isDark
      ? "0 2px 12px rgba(0, 0, 0, 0.35)"
      : "0 2px 10px -4px rgba(0, 0, 0, 0.05)",
    "--shadow-card-hover": isDark
      ? "0 4px 24px rgba(0, 0, 0, 0.45)"
      : "0 4px 20px -4px rgba(0, 0, 0, 0.08)",
    "--background": colors.background,
    "--foreground": colors.text,
  };
  for (const [key, value] of Object.entries(map)) {
    root.style.setProperty(key, value);
  }
}

function setPxVars(
  root: HTMLElement,
  prefix: string,
  values: Record<string, number>
): void {
  for (const [key, value] of Object.entries(values)) {
    root.style.setProperty(`${prefix}-${key}`, `${value}px`);
  }
}

export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.name);
  root.style.colorScheme = theme.name === "dark" ? "dark" : "light";
  setColorVars(root, theme);
  setPxVars(root, "--spacing", theme.spacing as unknown as Record<string, number>);
  setPxVars(root, "--radius", theme.radii as unknown as Record<string, number>);
  setPxVars(root, "--font-size", theme.fontSize as unknown as Record<string, number>);
}

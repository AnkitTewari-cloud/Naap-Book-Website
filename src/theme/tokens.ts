export type ThemeName = "minimal_white" | "vibrant" | "green" | "dark";

export const THEME_NAMES: ThemeName[] = [
  "minimal_white",
  "vibrant",
  "green",
  "dark",
];

export type JobStatus =
  | "received"
  | "cutting"
  | "stitching"
  | "trial"
  | "finishing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface ThemeColors {
  background: string;
  surface: string;
  /** surface-container-high (dark) / elevated cards (light) */
  surfaceElevated: string;
  /** surface-container-low on Midnight Pro; muted panels on light */
  surfaceMuted: string;
  primary: string;
  primaryText: string;
  /** Nav accent & active states (Stitch secondary green on light) */
  secondary: string;
  secondaryMuted: string;
  text: string;
  textMuted: string;
  border: string;
  borderVariant: string;
  statusReceived: string;
  statusCutting: string;
  statusStitching: string;
  statusTrial: string;
  statusFinishing: string;
  statusReady: string;
  statusDelivered: string;
  statusCancelled: string;
  statusOverdue: string;
  accent: string;
  accentMuted: string;
  success: string;
  warning: string;
  danger: string;
  whatsappGreen: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeRadii {
  sm: number;
  md: number;
  lg: number;
  pill: number;
}

export interface ThemeFontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
}

export interface Theme {
  name: ThemeName;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  fontSize: ThemeFontSizes;
}

export const DEFAULT_SPACING: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 32,
};

export const DEFAULT_RADII: ThemeRadii = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const DEFAULT_FONT_SIZE: ThemeFontSizes = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 26,
  "2xl": 32,
  "3xl": 40,
};

export const DEFAULT_COLORS: ThemeColors = {
  background: "#FCF8FF",
  surface: "#FFFFFF",
  surfaceElevated: "#F5F2FF",
  surfaceMuted: "#F0ECF9",
  primary: "#4F46E5",
  primaryText: "#FFFFFF",
  secondary: "#006D2F",
  secondaryMuted: "rgba(0, 109, 47, 0.1)",
  text: "#111827",
  textMuted: "#464555",
  border: "#E5E7EB",
  borderVariant: "#C7C4D8",
  statusReceived: "#9CA3AF",
  statusCutting: "#F59E0B",
  statusStitching: "#3B82F6",
  statusTrial: "#8B5CF6",
  statusFinishing: "#0EA5E9",
  statusReady: "#22C55E",
  statusDelivered: "#22C55E",
  statusCancelled: "#EF4444",
  statusOverdue: "#DC2626",
  accent: "#4F46E5",
  accentMuted: "rgba(79, 70, 229, 0.12)",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  whatsappGreen: "#25D366",
};

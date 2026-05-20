import {
  DEFAULT_FONT_SIZE,
  DEFAULT_SPACING,
  type Theme,
} from "../tokens";

/**
 * Stitch Midnight Pro — midnight_pro/DESIGN.md + profile_settings_midnight_pro_aligned
 * - Canvas: #0b1326 · container-low: #131b2e · container: #171f33 · high: #222a3d
 * - Brand accent (nav, links): #c3c0ff
 * - Primary CTA / filled buttons: #4f46e5 (primary-container)
 */
export const dark: Theme = {
  name: "dark",
  colors: {
    background: "#0B1326",
    surface: "#171F33",
    surfaceElevated: "#222A3D",
    surfaceMuted: "#131B2E",
    primary: "#4F46E5",
    primaryText: "#FFFFFF",
    secondary: "#C3C0FF",
    secondaryMuted: "rgba(195, 192, 255, 0.14)",
    text: "#DAE2FD",
    textMuted: "#C7C4D8",
    border: "#334155",
    borderVariant: "#464555",
    statusReceived: "#918FA1",
    statusCutting: "#F59E0B",
    statusStitching: "#60A5FA",
    statusTrial: "#A78BFA",
    statusFinishing: "#22D3EE",
    statusReady: "#34D399",
    statusDelivered: "#10B981",
    statusCancelled: "#FFB4AB",
    statusOverdue: "#FFB4AB",
    accent: "#C3C0FF",
    accentMuted: "rgba(195, 192, 255, 0.18)",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#FFB4AB",
    whatsappGreen: "#25D366",
  },
  spacing: { ...DEFAULT_SPACING },
  radii: { sm: 6, md: 8, lg: 16, pill: 999 },
  fontSize: { ...DEFAULT_FONT_SIZE },
};

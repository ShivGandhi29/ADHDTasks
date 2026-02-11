/**
 * App theme palettes. Use with useTheme() to get the active palette.
 */

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

export type AppPalette = {
  background: string;
  card: string;
  cardMuted: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  inputBg: string;
  brand: string;
  alert: string;
  accentRed: string;
  appBackground: string;
  surface: string;
  shadow: string;
  white: string;
  black: string;
  /** Tab bar / icon default */
  icon: string;
  iconMuted: string;
};

const lightPalette: AppPalette = {
  background: "#FFFFFF",
  card: "#FFFFFF",
  cardMuted: "#F8F8F8",
  text: "#111111",
  textSecondary: "#222222",
  textMuted: "#888888",
  border: "#DDDDDD",
  borderLight: "#E6E6E6",
  inputBg: "#F8F8F8",
  brand: "#0A7EA4",
  alert: "#E5484D",
  accentRed: "#A30000",
  appBackground: "#E6F4FE",
  surface: "#F2F2F2",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#687076",
  iconMuted: "#9BA1A6",
};

const darkPalette: AppPalette = {
  background: "#151718",
  card: "#222425",
  cardMuted: "#1C1D1E",
  text: "#ECEDEE",
  textSecondary: "#C8C9CA",
  textMuted: "#9BA1A6",
  border: "#3D4043",
  borderLight: "#2D3032",
  inputBg: "#222425",
  brand: "#0A7EA4",
  alert: "#E5484D",
  accentRed: "#FF6B6B",
  appBackground: "#0D1F2D",
  surface: "#1C1D1E",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#9BA1A6",
  iconMuted: "#687076",
};

// --- Forest (greens, natural) ---
const forestLightPalette: AppPalette = {
  background: "#FFFFFF",
  card: "#FFFFFF",
  cardMuted: "#F2F7F2",
  text: "#1A2E1A",
  textSecondary: "#2D3D2D",
  textMuted: "#5C735C",
  border: "#C5D4C5",
  borderLight: "#DCE8DC",
  inputBg: "#F2F7F2",
  brand: "#2D6A4F",
  alert: "#C1121F",
  accentRed: "#A30000",
  appBackground: "#E8F5E9",
  surface: "#E8F0E8",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#5C735C",
  iconMuted: "#7D9B7D",
};

const forestDarkPalette: AppPalette = {
  background: "#0F1F14",
  card: "#1A2E1F",
  cardMuted: "#152619",
  text: "#E8F0E8",
  textSecondary: "#B8D0B8",
  textMuted: "#7D9B7D",
  border: "#2D4A32",
  borderLight: "#223829",
  inputBg: "#1A2E1F",
  brand: "#40916C",
  alert: "#E5484D",
  accentRed: "#FF6B6B",
  appBackground: "#0D1A10",
  surface: "#152619",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#7D9B7D",
  iconMuted: "#5C735C",
};

// --- Ocean (teal / blue) ---
const oceanLightPalette: AppPalette = {
  background: "#FFFFFF",
  card: "#FFFFFF",
  cardMuted: "#F4F8FA",
  text: "#0D2137",
  textSecondary: "#1E3A52",
  textMuted: "#5B7A94",
  border: "#B8D4E3",
  borderLight: "#D6E8F0",
  inputBg: "#F4F8FA",
  brand: "#0077B6",
  alert: "#E5484D",
  accentRed: "#A30000",
  appBackground: "#E3F2FD",
  surface: "#E8F4F8",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#5B7A94",
  iconMuted: "#7A9BB5",
};

const oceanDarkPalette: AppPalette = {
  background: "#0A1628",
  card: "#132F4C",
  cardMuted: "#0F2438",
  text: "#E6F2FA",
  textSecondary: "#B3D4ED",
  textMuted: "#7A9BB5",
  border: "#1E4976",
  borderLight: "#173A5E",
  inputBg: "#132F4C",
  brand: "#00B4D8",
  alert: "#E5484D",
  accentRed: "#FF6B6B",
  appBackground: "#061018",
  surface: "#0F2438",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#7A9BB5",
  iconMuted: "#5B7A94",
};

// --- Warm (amber / terracotta) ---
const warmLightPalette: AppPalette = {
  background: "#FFFBF7",
  card: "#FFFFFF",
  cardMuted: "#FBF5EF",
  text: "#2C1810",
  textSecondary: "#4A3020",
  textMuted: "#8B7355",
  border: "#E0D0C0",
  borderLight: "#EDE4DB",
  inputBg: "#FBF5EF",
  brand: "#B45309",
  alert: "#C1121F",
  accentRed: "#A30000",
  appBackground: "#FFF8F0",
  surface: "#F5EDE4",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#8B7355",
  iconMuted: "#A89078",
};

const warmDarkPalette: AppPalette = {
  background: "#1C1410",
  card: "#2A2018",
  cardMuted: "#231A14",
  text: "#F5EDE4",
  textSecondary: "#D4C4B0",
  textMuted: "#A89078",
  border: "#4A3C30",
  borderLight: "#352A22",
  inputBg: "#2A2018",
  brand: "#D97706",
  alert: "#E5484D",
  accentRed: "#FF6B6B",
  appBackground: "#14100C",
  surface: "#231A14",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#A89078",
  iconMuted: "#8B7355",
};

// --- High contrast (dark mode: near-black, bright text & borders) ---
const highContrastLightPalette: AppPalette = {
  ...lightPalette,
  text: "#000000",
  textSecondary: "#1A1A1A",
  textMuted: "#525252",
  border: "#737373",
  borderLight: "#A3A3A3",
};

const highContrastDarkPalette: AppPalette = {
  background: "#0A0A0A",
  card: "#141414",
  cardMuted: "#1A1A1A",
  text: "#FAFAFA",
  textSecondary: "#E5E5E5",
  textMuted: "#A3A3A3",
  border: "#525252",
  borderLight: "#404040",
  inputBg: "#141414",
  brand: "#38BDF8",
  alert: "#F87171",
  accentRed: "#FF6B6B",
  appBackground: "#050505",
  surface: "#1A1A1A",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#D4D4D4",
  iconMuted: "#A3A3A3",
};

// --- Midnight (dark mode: deep blue-black, high contrast) ---
const midnightLightPalette: AppPalette = {
  ...oceanLightPalette,
  appBackground: "#E8F4FC",
};

const midnightDarkPalette: AppPalette = {
  background: "#030712",
  card: "#0F172A",
  cardMuted: "#0C1222",
  text: "#F8FAFC",
  textSecondary: "#E2E8F0",
  textMuted: "#94A3B8",
  border: "#334155",
  borderLight: "#1E293B",
  inputBg: "#0F172A",
  brand: "#22D3EE",
  alert: "#F87171",
  accentRed: "#FF6B6B",
  appBackground: "#020617",
  surface: "#0C1222",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#CBD5E1",
  iconMuted: "#94A3B8",
};

// --- Rose (soft pink / blush) ---
const roseLightPalette: AppPalette = {
  background: "#FFFFFF",
  card: "#FFFFFF",
  cardMuted: "#FDF2F4",
  text: "#43141A",
  textSecondary: "#5C1E26",
  textMuted: "#9F4D56",
  border: "#F0C5CA",
  borderLight: "#F8E2E5",
  inputBg: "#FDF2F4",
  brand: "#BE123C",
  alert: "#E5484D",
  accentRed: "#A30000",
  appBackground: "#FFF1F2",
  surface: "#FCE7EB",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#9F4D56",
  iconMuted: "#C0848C",
};

const roseDarkPalette: AppPalette = {
  background: "#1C0F12",
  card: "#2A1519",
  cardMuted: "#231318",
  text: "#FCE7EB",
  textSecondary: "#E8BEC5",
  textMuted: "#C0848C",
  border: "#5C2E35",
  borderLight: "#3D1F24",
  inputBg: "#2A1519",
  brand: "#FB7185",
  alert: "#F87171",
  accentRed: "#FF6B6B",
  appBackground: "#140A0C",
  surface: "#231318",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#C0848C",
  iconMuted: "#9F4D56",
};

// --- Slate (cool gray / minimal) ---
const slateLightPalette: AppPalette = {
  background: "#FFFFFF",
  card: "#FFFFFF",
  cardMuted: "#F8FAFC",
  text: "#0F172A",
  textSecondary: "#1E293B",
  textMuted: "#64748B",
  border: "#CBD5E1",
  borderLight: "#E2E8F0",
  inputBg: "#F8FAFC",
  brand: "#475569",
  alert: "#E5484D",
  accentRed: "#A30000",
  appBackground: "#F1F5F9",
  surface: "#F1F5F9",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#64748B",
  iconMuted: "#94A3B8",
};

const slateDarkPalette: AppPalette = {
  background: "#0F172A",
  card: "#1E293B",
  cardMuted: "#172033",
  text: "#F1F5F9",
  textSecondary: "#CBD5E1",
  textMuted: "#94A3B8",
  border: "#334155",
  borderLight: "#1E293B",
  inputBg: "#1E293B",
  brand: "#94A3B8",
  alert: "#F87171",
  accentRed: "#FF6B6B",
  appBackground: "#020617",
  surface: "#172033",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#94A3B8",
  iconMuted: "#64748B",
};

// --- Sunset (coral / peach / golden) ---
const sunsetLightPalette: AppPalette = {
  background: "#FFFBEB",
  card: "#FFFFFF",
  cardMuted: "#FEF3C7",
  text: "#292524",
  textSecondary: "#44403C",
  textMuted: "#78716C",
  border: "#FDE68A",
  borderLight: "#FEF9C3",
  inputBg: "#FEF3C7",
  brand: "#EA580C",
  alert: "#E5484D",
  accentRed: "#A30000",
  appBackground: "#FFF7ED",
  surface: "#FFEDD5",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#78716C",
  iconMuted: "#A8A29E",
};

const sunsetDarkPalette: AppPalette = {
  background: "#1C1917",
  card: "#292524",
  cardMuted: "#292524",
  text: "#FAFAF9",
  textSecondary: "#E7E5E4",
  textMuted: "#A8A29E",
  border: "#57534E",
  borderLight: "#44403C",
  inputBg: "#292524",
  brand: "#FB923C",
  alert: "#F87171",
  accentRed: "#FF6B6B",
  appBackground: "#0C0A09",
  surface: "#292524",
  shadow: "#000000",
  white: "#FFFFFF",
  black: "#000000",
  icon: "#A8A29E",
  iconMuted: "#78716C",
};

export type PaletteSetName =
  | "default"
  | "forest"
  | "ocean"
  | "warm"
  | "highContrast"
  | "midnight"
  | "rose"
  | "slate"
  | "sunset";

export const palettes: Record<Theme, AppPalette> = {
  light: lightPalette,
  dark: darkPalette,
};

export const paletteSets: Record<PaletteSetName, Record<Theme, AppPalette>> = {
  default: { light: lightPalette, dark: darkPalette },
  forest: { light: forestLightPalette, dark: forestDarkPalette },
  ocean: { light: oceanLightPalette, dark: oceanDarkPalette },
  warm: { light: warmLightPalette, dark: warmDarkPalette },
  highContrast: { light: highContrastLightPalette, dark: highContrastDarkPalette },
  midnight: { light: midnightLightPalette, dark: midnightDarkPalette },
  rose: { light: roseLightPalette, dark: roseDarkPalette },
  slate: { light: slateLightPalette, dark: slateDarkPalette },
  sunset: { light: sunsetLightPalette, dark: sunsetDarkPalette },
};

/** Legacy shape for useThemeColor / ThemedText */
export const Colors = {
  light: {
    text: lightPalette.text,
    background: lightPalette.background,
    tint: lightPalette.brand,
    icon: lightPalette.icon,
    tabIconDefault: lightPalette.icon,
    tabIconSelected: lightPalette.brand,
  },
  dark: {
    text: darkPalette.text,
    background: darkPalette.background,
    tint: darkPalette.brand,
    icon: darkPalette.icon,
    tabIconDefault: darkPalette.icon,
    tabIconSelected: darkPalette.brand,
  },
};

/** Legacy: map palette to old AppColors keys for gradual migration if needed */
export function paletteToLegacyKeys(p: AppPalette) {
  return {
    Black: p.black,
    White: p.white,
    OffWhite: p.cardMuted,
    WhiteSmoke: p.surface,
    LightGray: p.borderLight,
    BorderGray: p.border,
    MutedGray: p.textMuted,
    SlateGray: p.textSecondary,
    Charcoal: p.textSecondary,
    Ink: p.textSecondary,
    TextDark: p.text,
    TextDarker: p.text,
    IconGray: p.icon,
    IconGrayLight: p.iconMuted,
    BackgroundDark: p.background,
    TextLight: p.text,
    BrandBlue: p.brand,
    AlertRed: p.alert,
    AccentRed: p.accentRed,
    AppBackground: p.appBackground,
  };
}

export default palettes;

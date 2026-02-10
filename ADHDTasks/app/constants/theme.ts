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
  brand: "#4DB8E2",
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

export const palettes: Record<Theme, AppPalette> = {
  light: lightPalette,
  dark: darkPalette,
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

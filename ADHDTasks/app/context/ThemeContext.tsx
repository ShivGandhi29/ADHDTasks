import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  type Theme,
  type ThemePreference,
  type PaletteSetName,
  paletteSets,
  type AppPalette,
} from "../constants/theme";

const THEME_PREFERENCE_KEY = "@adhdtasks/theme_preference";
const PALETTE_SET_KEY = "@adhdtasks/palette_set";

type ThemeContextValue = {
  /** Resolved theme (always "light" or "dark") */
  theme: Theme;
  /** User preference: "light" | "dark" | "system" */
  themePreference: ThemePreference;
  /** Color palette set: "default" | "forest" | "ocean" | "warm" */
  paletteSet: PaletteSetName;
  /** Palette for the current resolved theme */
  colors: AppPalette;
  /** Set and persist theme preference */
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  /** Set and persist palette set */
  setPaletteSet: (name: PaletteSetName) => Promise<void>;
  /** True once preference has been loaded from storage */
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>("system");
  const [paletteSet, setPaletteSetState] = useState<PaletteSetName>("default");
  const [isReady, setIsReady] = useState(false);

  const theme: Theme =
    themePreference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : themePreference;

  const colors = paletteSets[paletteSet][theme];

  useEffect(() => {
    (async () => {
      try {
        const [storedTheme, storedPalette] = await Promise.all([
          AsyncStorage.getItem(THEME_PREFERENCE_KEY),
          AsyncStorage.getItem(PALETTE_SET_KEY),
        ]);
        if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
          setThemePreferenceState(storedTheme);
        }
        const validPalettes: PaletteSetName[] = [
          "default",
          "forest",
          "ocean",
          "warm",
          "highContrast",
          "midnight",
          "rose",
          "slate",
          "sunset",
        ];
        if (storedPalette != null && validPalettes.includes(storedPalette as PaletteSetName)) {
          setPaletteSetState(storedPalette as PaletteSetName);
        }
      } catch {
        // ignore
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const setThemePreference = useCallback(async (preference: ThemePreference) => {
    setThemePreferenceState(preference);
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference);
    } catch {
      // ignore
    }
  }, []);

  const setPaletteSet = useCallback(async (name: PaletteSetName) => {
    setPaletteSetState(name);
    try {
      await AsyncStorage.setItem(PALETTE_SET_KEY, name);
    } catch {
      // ignore
    }
  }, []);

  const value: ThemeContextValue = {
    theme,
    themePreference,
    paletteSet,
    colors,
    setThemePreference,
    setPaletteSet,
    isReady,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

export default ThemeContext;

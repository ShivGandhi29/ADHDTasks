import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  type Theme,
  type ThemePreference,
  palettes,
  type AppPalette,
} from "../constants/theme";

const THEME_PREFERENCE_KEY = "@adhdtasks/theme_preference";

type ThemeContextValue = {
  /** Resolved theme (always "light" or "dark") */
  theme: Theme;
  /** User preference: "light" | "dark" | "system" */
  themePreference: ThemePreference;
  /** Palette for the current resolved theme */
  colors: AppPalette;
  /** Set and persist theme preference */
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  /** True once preference has been loaded from storage */
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>("system");
  const [isReady, setIsReady] = useState(false);

  const theme: Theme =
    themePreference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : themePreference;

  const colors = palettes[theme];

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system") {
          setThemePreferenceState(stored);
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

  const value: ThemeContextValue = {
    theme,
    themePreference,
    colors,
    setThemePreference,
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

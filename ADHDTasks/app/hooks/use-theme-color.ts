/**
 * Resolves a theme color. Uses ThemeContext when available (app theme),
 * so it respects the user's Light/Dark/System choice from Settings.
 */

import { Colors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme } = useTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
}

export default function UseThemeColorScreen() {
  return null;
}

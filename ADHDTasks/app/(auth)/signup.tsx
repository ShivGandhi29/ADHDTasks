import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SignupScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        },
        text: {
          fontSize: 16,
          color: colors.textSecondary,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Signup coming soon.</Text>
    </View>
  );
}

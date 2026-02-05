import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AppColors } from "../components/ui/ThemeColors";

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Signup coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: AppColors.SlateGray,
  },
});

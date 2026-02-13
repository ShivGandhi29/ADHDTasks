import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Image,
  Keyboard,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./context/ThemeContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const SIGNUP_BG = "#0d1b2a";

const USER_NAME_KEY = "@adhdtasks/user_name";

export default function SignupScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [name, setName] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [eulaAccepted, setEulaAccepted] = useState(false);

  const canContinue =
    name.trim().length > 0 && privacyAccepted && eulaAccepted;

  const handleContinue = useCallback(async () => {
    if (!canContinue) return;
    Keyboard.dismiss();
    try {
      await AsyncStorage.setItem(USER_NAME_KEY, name.trim());
    } catch {
      // continue to navigate even if storage fails
    }
    // Navigate directly to home so index screen is never shown
    requestAnimationFrame(() => {
      router.replace("/(tabs)/home" as const);
    });
  }, [canContinue, name, router]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: SIGNUP_BG,
        },
        scrollWrap: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 32,
          maxWidth: 400,
          width: "100%",
          alignSelf: "center",
        },
        hero: {
          marginBottom: 40,
          alignItems: "center",
        },
        heroImage: {
          width: 160,
          height: 160,
          marginBottom: 24,
          resizeMode: "contain",
        },
        titleLogo: {
          height: 100,
          width: 860,
          marginBottom: 8,
          resizeMode: "contain",
        },
        tagline: {
          fontSize: 17,
          color: "rgba(255,255,255,0.9)",
          lineHeight: 24,
          textAlign: "center",
        },
        card: {
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: colors.borderLight,
        },
        label: {
          fontSize: 15,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 10,
        },
        input: {
          paddingVertical: 16,
          fontSize: 35,
          color: colors.text,
          marginBottom: 24,
          fontWeight: "700",
          textAlign: "center",
        },
        checkboxes: {
          gap: 16,
        },
        checkboxRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        checkbox: {
          width: 26,
          height: 26,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: colors.border,
          marginRight: 14,
          alignItems: "center",
          justifyContent: "center",
        },
        checkboxChecked: {
          backgroundColor: colors.brand,
          borderColor: colors.brand,
        },
        checkboxLabel: {
          flex: 1,
          fontSize: 15,
          color: colors.textSecondary,
          lineHeight: 22,
        },
        link: {
          color: colors.brand,
          textDecorationLine: "underline",
          fontWeight: "600",
        },
        continueButton: {
          backgroundColor: colors.brand,
          paddingVertical: 18,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        },
        continueButtonDisabled: {
          opacity: 0.5,
        },
        continueButtonText: {
          fontSize: 17,
          fontWeight: "700",
          color: colors.white,
          letterSpacing: 0.3,
        },
      }),
    [colors, insets.top, insets.bottom],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.hero}>
          <Image
            source={require("../assets/images/launch/ADHDHead.png")}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel="Focused mind"
          />
          <Image
            source={require("../assets/images/focused-branding/focusd-white.png")}
            style={styles.titleLogo}
            resizeMode="contain"
            accessibilityLabel="Focusd"
          />
          <Text style={styles.tagline}>
            One task at a time. Enter your name and we'll get you started.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>What's your first name?</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Sam"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={14}
          />

          <View style={styles.checkboxes}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setPrivacyAccepted((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, privacyAccepted && styles.checkboxChecked]}>
                {privacyAccepted && (
                  <MaterialIcons name="check" size={16} color={colors.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the{" "}
                <Text
                  style={styles.link}
                  onPress={(e) => {
                    e.stopPropagation();
                    Linking.openURL("https://example.com/privacy");
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setEulaAccepted((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, eulaAccepted && styles.checkboxChecked]}>
                {eulaAccepted && (
                  <MaterialIcons name="check" size={16} color={colors.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the{" "}
                <Text
                  style={styles.link}
                  onPress={(e) => {
                    e.stopPropagation();
                    Linking.openURL("https://example.com/eula");
                  }}
                >
                  EULA
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled,
            pressed && { opacity: 0.9 },
          ]}
          onPress={handleContinue}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

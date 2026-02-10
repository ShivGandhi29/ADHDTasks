import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "../context/ThemeContext";

type ThemeOption = "light" | "dark" | "system";

const THEME_OPTIONS: { value: ThemeOption; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function Settings() {
  const { colors, themePreference, setThemePreference } = useTheme();

  function SettingsRow({
    icon,
    label,
    right,
    onPress,
    isLast,
  }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    right?: React.ReactNode;
    onPress?: () => void;
    isLast?: boolean;
  }) {
    const rowStyle = [
      styles.row,
      !isLast && {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      },
    ];
    return (
      <Pressable
        style={({ pressed }) => [rowStyle, pressed && { opacity: 0.7 }]}
        onPress={onPress}
        disabled={!onPress}
      >
        <MaterialIcons name={icon} size={22} color={colors.textSecondary} />
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        {right != null ? (
          right
        ) : onPress ? (
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={colors.textMuted}
          />
        ) : null}
      </Pressable>
    );
  }

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        content: {
          padding: 16,
          paddingBottom: 32,
        },
        sectionTitle: {
          fontSize: 13,
          fontWeight: "600",
          color: colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 8,
          marginTop: 24,
        },
        sectionTitleFirst: {
          marginTop: 8,
        },
        card: {
          backgroundColor: colors.cardMuted,
          borderRadius: 12,
          overflow: "hidden",
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 16,
          gap: 12,
        },
        rowLabel: {
          flex: 1,
          fontSize: 17,
          fontWeight: "500",
        },
        themeOptions: {
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
        },
        themeRow: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          gap: 12,
        },
        themeRadio: {
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          alignItems: "center",
          justifyContent: "center",
        },
        themeRadioInner: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.white,
        },
        themeLabel: {
          fontSize: 17,
          fontWeight: "500",
          color: colors.text,
        },
        premiumBadge: {
          fontSize: 15,
          fontWeight: "600",
          color: "#E67E22",
        },
        referralBanner: {
          backgroundColor: "#E67E22",
          borderRadius: 12,
          padding: 20,
          marginTop: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        referralText: {
          color: "#FFF",
          fontSize: 18,
          fontWeight: "700",
        },
        referralSub: {
          color: "rgba(255,255,255,0.9)",
          fontSize: 14,
          marginTop: 4,
        },
        referralCoin: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        },
      }),
    [colors],
  );

  const onPlaceholder = () => {
    Alert.alert("Coming soon", "This feature is not available yet.");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Appearance */}
        <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>
          Appearance
        </Text>
        <View style={styles.card}>
          <Pressable
            style={({ pressed }) => [
              styles.row,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <MaterialIcons
              name="palette"
              size={22}
              color={colors.textSecondary}
            />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Theme</Text>
            <Text style={[styles.themeLabel, { color: colors.textMuted }]}>
              {themePreference === "system"
                ? "System"
                : themePreference === "light"
                  ? "Light"
                  : "Dark"}
            </Text>

          </Pressable>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map(({ value, label }) => {
              const isActive = themePreference === value;
              return (
                <Pressable
                  key={value}
                  style={styles.themeRow}
                  onPress={() => setThemePreference(value)}
                >
                  <View
                    style={[
                      styles.themeRadio,
                      {
                        borderColor: isActive ? colors.brand : colors.border,
                        backgroundColor: isActive
                          ? colors.brand
                          : "transparent",
                      },
                    ]}
                  >
                    {isActive && <View style={styles.themeRadioInner} />}
                  </View>
                  <Text style={styles.themeLabel}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Account & Privacy
        <Text style={styles.sectionTitle}>Account & Privacy</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="email"
            label="Email"
            onPress={onPlaceholder}
          />
          <SettingsRow
            icon="person"
            label="Username"
            onPress={onPlaceholder}
            isLast={false}
          />
          <SettingsRow
            icon="language"
            label="Language"
            onPress={onPlaceholder}
            isLast={false}
          />
          <SettingsRow
            icon="security"
            label="Privacy"
            onPress={onPlaceholder}
            isLast
          />
        </View> */}

        {/* Premium
        <Text style={styles.sectionTitle}>Premium</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="workspace-premium"
            label="Premium Status"
            right={
              <>
                <Text style={styles.premiumBadge}>Inactive</Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
              </>
            }
            onPress={onPlaceholder}
            isLast
          />
        </View> */}

        {/* Referral banner
        <Pressable style={styles.referralBanner} onPress={onPlaceholder}>
          <View>
            <Text style={styles.referralText}>Refer a friend</Text>
            <View style={[styles.referralCoin, { marginTop: 6 }]}>
              <MaterialIcons name="monetization-on" size={24} color="#FFD700" />
              <Text style={styles.referralSub}>50 / referral</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={28} color="rgba(255,255,255,0.9)" />
        </Pressable> */}

        {/* App Customization
        <Text style={styles.sectionTitle}>App Customization</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="image"
            label="App Icon"
            onPress={onPlaceholder}
          />
          <SettingsRow
            icon="dashboard"
            label="Widget"
            onPress={onPlaceholder}
            isLast
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

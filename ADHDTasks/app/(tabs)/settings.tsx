import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
  Switch,
  TextInput,
  Linking,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "../context/ThemeContext";
import type { PaletteSetName } from "../constants/theme";
import {
  type CompleteTaskSoundId,
  COMPLETE_TASK_SOUND_OPTIONS,
  COMPLETE_TASK_SOUND_SOURCES,
  DEFAULT_COMPLETE_TASK_SOUND,
} from "../constants/sounds";

const PREVIEW_DURATION_MS = 10_000;

const ALARM_ENABLED_KEY = "@adhdtasks/alarm_enabled";
const COMPLETE_TASK_SOUND_KEY = "@adhdtasks/complete_task_sound";
const USER_NAME_KEY = "@adhdtasks/user_name";

const PRIVACY_POLICY_URL = "https://example.com/privacy";
const EULA_URL = "https://example.com/eula";

type ThemeOption = "light" | "dark" | "system";

const THEME_OPTIONS: { value: ThemeOption; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const PALETTE_OPTIONS: { value: PaletteSetName; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "forest", label: "Forest" },
  { value: "ocean", label: "Ocean" },
  { value: "warm", label: "Warm" },
  { value: "highContrast", label: "High contrast" },
  { value: "midnight", label: "Midnight" },
  { value: "rose", label: "Rose" },
  { value: "slate", label: "Slate" },
  { value: "sunset", label: "Sunset" },
];

const TAB_BAR_HEIGHT = 56;

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { colors, themePreference, setThemePreference, paletteSet, setPaletteSet } = useTheme();
  const contentBottomPadding = insets.bottom + TAB_BAR_HEIGHT + 24;
  const [alarmEnabled, setAlarmEnabledState] = useState(true);
  const [completeTaskSound, setCompleteTaskSoundState] =
    useState<CompleteTaskSoundId>(DEFAULT_COMPLETE_TASK_SOUND);
  const [previewingSoundId, setPreviewingSoundId] =
    useState<CompleteTaskSoundId | null>(null);
  const [isPreviewPaused, setIsPreviewPaused] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const soundRef = useRef<Audio.Sound | null>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPreview = useCallback(async () => {
    if (previewTimerRef.current != null) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    const sound = soundRef.current;
    if (sound != null) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch {
        // ignore
      }
      soundRef.current = null;
    }
    setPreviewingSoundId(null);
    setIsPreviewPaused(false);
  }, []);

  const startPreview = useCallback(async (id: CompleteTaskSoundId) => {
    await stopPreview();
    const source = COMPLETE_TASK_SOUND_SOURCES[id];
    if (source == null) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      const { sound } = await Audio.Sound.createAsync(
        source as Parameters<typeof Audio.Sound.createAsync>[0],
      );
      soundRef.current = sound;
      setPreviewingSoundId(id);
      setIsPreviewPaused(false);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          stopPreview();
        }
      });
      previewTimerRef.current = setTimeout(() => {
        previewTimerRef.current = null;
        stopPreview();
      }, PREVIEW_DURATION_MS);
    } catch {
      setPreviewingSoundId(null);
    }
  }, [stopPreview]);

  const handlePlayPausePreview = useCallback(
    async (id: CompleteTaskSoundId) => {
      const sound = soundRef.current;
      if (previewingSoundId === id) {
        if (isPreviewPaused && sound != null) {
          await sound.playFromPositionAsync(0);
          setIsPreviewPaused(false);
          previewTimerRef.current = setTimeout(() => {
            previewTimerRef.current = null;
            stopPreview();
          }, PREVIEW_DURATION_MS);
        } else if (!isPreviewPaused && sound != null) {
          await sound.pauseAsync();
          setIsPreviewPaused(true);
          if (previewTimerRef.current != null) {
            clearTimeout(previewTimerRef.current);
            previewTimerRef.current = null;
          }
        }
        return;
      }
      await startPreview(id);
    },
    [previewingSoundId, isPreviewPaused, startPreview, stopPreview],
  );

  useEffect(() => {
    return () => {
      if (previewTimerRef.current != null) clearTimeout(previewTimerRef.current);
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [storedAlarm, storedSound, storedName] = await Promise.all([
          AsyncStorage.getItem(ALARM_ENABLED_KEY),
          AsyncStorage.getItem(COMPLETE_TASK_SOUND_KEY),
          AsyncStorage.getItem(USER_NAME_KEY),
        ]);
        if (storedAlarm === "false") setAlarmEnabledState(false);
        else if (storedAlarm === "true") setAlarmEnabledState(true);
        if (
          storedSound != null &&
          COMPLETE_TASK_SOUND_OPTIONS.some((o) => o.value === storedSound)
        ) {
          setCompleteTaskSoundState(storedSound as CompleteTaskSoundId);
        }
        if (storedName?.trim()) setUserName(storedName.trim());
      } catch {
        // keep default
      }
    })();
  }, []);

  const setCompleteTaskSound = useCallback(async (value: CompleteTaskSoundId) => {
    setCompleteTaskSoundState(value);
    try {
      await AsyncStorage.setItem(COMPLETE_TASK_SOUND_KEY, value);
    } catch {
      // ignore
    }
  }, []);

  const setAlarmEnabled = useCallback(async (value: boolean) => {
    setAlarmEnabledState(value);
    try {
      await AsyncStorage.setItem(ALARM_ENABLED_KEY, value ? "true" : "false");
    } catch {
      // ignore
    }
  }, []);

  const openNameModal = useCallback(() => {
    setNameDraft(userName ?? "");
    setShowNameModal(true);
  }, [userName]);

  const saveName = useCallback(async () => {
    const trimmed = nameDraft.trim();
    if (trimmed.length === 0 || trimmed.length > 14) return;
    setUserName(trimmed);
    setShowNameModal(false);
    try {
      await AsyncStorage.setItem(USER_NAME_KEY, trimmed);
    } catch {
      // ignore
    }
  }, [nameDraft]);

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
          padding: 24,
          paddingBottom: contentBottomPadding,
          gap: 16,
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
        previewButton: {
          padding: 8,
          marginRight: 4,
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
        modalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 24,
        },
        modalCard: {
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 24,
          maxWidth: 400,
          width: "100%",
          alignSelf: "center",
        },
        modalTitle: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 16,
        },
        modalInput: {
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 17,
          color: colors.text,
          marginBottom: 20,
        },
        modalButtons: {
          flexDirection: "row",
          gap: 12,
          justifyContent: "flex-end",
        },
        modalButton: {
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
        },
        modalButtonPrimary: {
          backgroundColor: colors.brand,
        },
        modalButtonText: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
        },
        modalButtonTextPrimary: {
          color: colors.white,
        },
      }),
    [colors, contentBottomPadding],
  );

  const onPlaceholder = () => {
    Alert.alert("Coming soon", "This feature is not available yet.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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

            <Text style={[styles.rowLabel, { color: colors.text }]}></Text>
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
        <Text style={styles.sectionTitle}>Colour Palette</Text>

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
    
            <Text style={[styles.rowLabel, { color: colors.text }]}>
            </Text>
            <Text style={[styles.themeLabel, { color: colors.textMuted }]}>
              {PALETTE_OPTIONS.find((o) => o.value === paletteSet)?.label ??
                "Default"}
            </Text>
          </Pressable>
          <View style={styles.themeOptions}>
            {PALETTE_OPTIONS.map(({ value, label }) => {
              const isActive = paletteSet === value;
              return (
                <Pressable
                  key={value}
                  style={styles.themeRow}
                  onPress={() => setPaletteSet(value)}
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

        {/* Sounds */}
        <Text style={styles.sectionTitle}>Sounds</Text>
        <View style={styles.card}>
          <View
            style={[
              styles.row,
              alarmEnabled && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <MaterialIcons name="alarm" size={22} color={colors.textSecondary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Alarm</Text>
            <Switch
              value={alarmEnabled}
              onValueChange={setAlarmEnabled}
              trackColor={{ false: colors.border, true: colors.brand }}
              thumbColor={colors.white}
            />
          </View>
          {alarmEnabled && (
            <>

              <View style={styles.themeOptions}>
                {COMPLETE_TASK_SOUND_OPTIONS.map(({ value, label }) => {
                  const isActive = completeTaskSound === value;
                  const isThisPreviewing = previewingSoundId === value;
                  const showPause = isThisPreviewing && !isPreviewPaused;
                  return (
                    <View key={value} style={styles.themeRow}>
                      <Pressable
                        style={({ pressed }) => [
                          { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
                          pressed && { opacity: 0.7 },
                        ]}
                        onPress={() => {
                          setCompleteTaskSound(value);
                          startPreview(value);
                        }}
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
                      {isActive && (
                        <Pressable
                          style={({ pressed }) => [
                            styles.previewButton,
                            pressed && { opacity: 0.7 },
                          ]}
                          onPress={() => handlePlayPausePreview(value)}
                        >
                          <MaterialIcons
                            name={showPause ? "pause" : "play-arrow"}
                            size={24}
                            color={colors.brand}
                          />
                        </Pressable>
                      )}
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="person"
            label="Name"
            right={
              <>
                <Text style={[styles.themeLabel, { color: colors.textMuted }]} numberOfLines={1}>
                  {userName || "Not set"}
                </Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
              </>
            }
            onPress={openNameModal}
            isLast={false}
          />
          <SettingsRow
            icon="policy"
            label="Privacy Policy"
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            isLast={false}
          />
          <SettingsRow
            icon="description"
            label="EULA"
            onPress={() => Linking.openURL(EULA_URL)}
            isLast
          />
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

      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowNameModal(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ alignSelf: "stretch" }}
          >
            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Change name</Text>
              <TextInput
                style={styles.modalInput}
                value={nameDraft}
                onChangeText={setNameDraft}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                maxLength={14}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <Pressable
                  style={({ pressed }) => [styles.modalButton, pressed && { opacity: 0.7 }]}
                  onPress={() => setShowNameModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.modalButtonPrimary,
                    pressed && { opacity: 0.9 },
                    (nameDraft.trim().length === 0 || nameDraft.trim().length > 14) && {
                      opacity: 0.5,
                    },
                  ]}
                  onPress={saveName}
                  disabled={nameDraft.trim().length === 0 || nameDraft.trim().length > 14}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                    Save
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

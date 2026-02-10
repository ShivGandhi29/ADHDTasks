import React, { useMemo } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "../context/ThemeContext";

type InactiveCardProps = {
  task: string;
  durationMinutes: number;
  onDelete: () => void;
  onActivate: () => void;
  expanded?: boolean;
  onCardPress?: () => void;
};

export default function InactiveCard({
  task,
  durationMinutes,
  onDelete,
  onActivate,
  expanded = false,
  onCardPress,
}: InactiveCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.cardMuted,
          borderRadius: 20,
          padding: 20,
        },
        deleteContainer: {
          justifyContent: "center",
          alignItems: "flex-end",
          paddingLeft: 12,
        },
        deleteButton: {
          backgroundColor: colors.alert,
          borderRadius: 16,
          paddingVertical: 12,
          paddingHorizontal: 16,
        },
        deleteText: { color: colors.white, fontWeight: "600" },
        taskText: {
          fontSize: 20,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 6,
        },
        metaText: { fontSize: 14, color: colors.textSecondary },
        startNowButton: {
          marginTop: 12,
          backgroundColor: colors.text,
          paddingVertical: 10,
          borderRadius: 10,
          alignItems: "center",
        },
        startNowText: {
          color: colors.background,
          fontSize: 14,
          fontWeight: "600",
        },
      }),
    [colors]
  );

  const renderRightActions = () => (
    <View style={styles.deleteContainer}>
      <Pressable style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable onPress={onCardPress}>
        <View style={styles.card}>
          <Text style={styles.taskText}>{task}</Text>
          <Text style={styles.metaText}>{durationMinutes} min</Text>
          {expanded && (
            <Pressable style={styles.startNowButton} onPress={onActivate}>
              <Text style={styles.startNowText}>Activate</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Swipeable>
  );
}

import React, { useMemo } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "../context/ThemeContext";
import { formatCreatedAt } from "../utils/formatDate";

type InactiveCardProps = {
  task: string;
  durationMinutes: number;
  createdAt?: string;
  onDelete: () => void;
  onActivate: () => void;
  onMoveToToDo?: () => void;
  expanded?: boolean;
  onCardPress?: () => void;
};

export default function InactiveCard({
  task,
  durationMinutes,
  createdAt,
  onDelete,
  onActivate,
  onMoveToToDo,
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
        metaRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        metaText: { fontSize: 14, color: colors.textSecondary },
        createdText: { fontSize: 13, color: colors.textMuted },
        buttonRow: {
          flexDirection: "row",
          gap: 10,
          marginTop: 12,
        },
        startNowButton: {
          flex: 1,
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
        moveToToDoButton: {
          flex: 1,
          //borderWidth: 1.5,
          //borderColor: colors.border,
          backgroundColor: colors.card,
          paddingVertical: 10,
          borderRadius: 10,
          alignItems: "center",
        },
        moveToToDoText: {
          color: colors.textSecondary,
          fontSize: 14,
          fontWeight: "600",
        },
      }),
    [colors],
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
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{durationMinutes} min</Text>
            {expanded && createdAt ? (
              <Text style={styles.createdText}>
                 {formatCreatedAt(createdAt)}
              </Text>
            ) : null}
          </View>
          {expanded && (
            <View style={styles.buttonRow}>
              <Pressable style={styles.startNowButton} onPress={onActivate}>
                <Text style={styles.startNowText}>Activate</Text>
              </Pressable>
              {onMoveToToDo && (
                <Pressable
                  style={styles.moveToToDoButton}
                  onPress={onMoveToToDo}
                >
                  <Text style={styles.moveToToDoText}>Move to Tasks</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </Pressable>
    </Swipeable>
  );
}

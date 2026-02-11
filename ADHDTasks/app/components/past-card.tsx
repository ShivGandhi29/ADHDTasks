import React, { useMemo } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "../context/ThemeContext";
import { formatCreatedAt } from "../utils/formatDate";

type PastCardProps = {
  label: string;
  task: string;
  durationMinutes: number;
  createdAt?: string;
  onDelete: () => void;
  onReactivate?: () => void;
  onMoveToToDo?: () => void;
  /** Label for the reactivate/add button (e.g. "Add") */
  reactivateLabel?: string;
  /** When true, card is expanded (e.g. show Add button) */
  expanded?: boolean;
  /** Called when the card content is tapped (to expand/collapse) */
  onCardPress?: () => void;
};

export default function PastCard({
  label,
  task,
  durationMinutes,
  createdAt,
  onDelete,
  onReactivate,
  onMoveToToDo,
  reactivateLabel = "Reactivate",
  expanded = false,
  onCardPress,
}: PastCardProps) {
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
        taskLabel: {
          fontSize: 12,
          color: colors.textMuted,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        },
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
        reactivateButton: {
          flex: 1,
          backgroundColor: colors.text,
          paddingVertical: 10,
          borderRadius: 10,
          alignItems: "center",
        },
        reactivateText: {
          color: colors.background,
          fontSize: 14,
          fontWeight: "600",
        },
        moveToToDoButton: {
          flex: 1,
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
      <Pressable
        style={styles.card}
        onPress={onCardPress}
        disabled={!onCardPress}
      >
        <Text style={styles.taskLabel}>{label}</Text>
        <Text style={styles.taskText}>{task}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{durationMinutes} min</Text>
          {expanded && createdAt ? (
            <Text style={styles.createdText}>
               {formatCreatedAt(createdAt)}
            </Text>
          ) : null}
        </View>
        {(onReactivate || onMoveToToDo) && (expanded || !onCardPress) && (
          <View style={styles.buttonRow}>
            {onReactivate && (
              <Pressable
                style={styles.reactivateButton}
                onPress={onReactivate}
                hitSlop={8}
              >
                <Text style={styles.reactivateText}>{reactivateLabel}</Text>
              </Pressable>
            )}
            {onMoveToToDo && (
              <Pressable style={styles.moveToToDoButton} onPress={onMoveToToDo}>
                <Text style={styles.moveToToDoText}>Move to Tasks</Text>
              </Pressable>
            )}
          </View>
        )}
      </Pressable>
    </Swipeable>
  );
}

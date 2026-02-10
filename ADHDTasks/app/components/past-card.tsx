import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { AppColors } from "./ui/ThemeColors";

type PastCardProps = {
  label: string;
  task: string;
  durationMinutes: number;
  onDelete: () => void;
  onReactivate?: () => void;
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
  onDelete,
  onReactivate,
  reactivateLabel = "Reactivate",
  expanded = false,
  onCardPress,
}: PastCardProps) {
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
        <Text style={styles.metaText}>{durationMinutes} min</Text>
        {onReactivate && (expanded || !onCardPress) && (
          <Pressable
            style={styles.reactivateButton}
            onPress={onReactivate}
            hitSlop={8}
          >
            <Text style={styles.reactivateText}>{reactivateLabel}</Text>
          </Pressable>
        )}
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.OffWhite,
    borderRadius: 20,
    padding: 20,
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingLeft: 12,
  },
  deleteButton: {
    backgroundColor: AppColors.AlertRed,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  deleteText: {
    color: AppColors.White,
    fontWeight: "600",
  },
  taskLabel: {
    fontSize: 12,
    color: AppColors.MutedGray,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  taskText: {
    fontSize: 20,
    fontWeight: "600",
    color: AppColors.TextDark,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    color: AppColors.SlateGray,
  },
  reactivateButton: {
    marginTop: 12,
    backgroundColor: AppColors.TextDark,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  reactivateText: {
    color: AppColors.White,
    fontSize: 14,
    fontWeight: "600",
  },
});

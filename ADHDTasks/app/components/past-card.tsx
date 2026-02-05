import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { AppColors } from "./ui/ThemeColors";

type PastCardProps = {
  task: string;
  durationMinutes: number;
  onDelete: () => void;
  onReactivate?: () => void;
};

export default function PastCard({
  task,
  durationMinutes,
  onDelete,
  onReactivate,
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
      <View style={styles.card}>
        <Text style={styles.taskLabel}>Past task</Text>
        <Text style={styles.taskText}>{task}</Text>
        <Text style={styles.metaText}>{durationMinutes} min</Text>
        {onReactivate && (
          <Pressable style={styles.reactivateButton} onPress={onReactivate}>
            <Text style={styles.reactivateText}>Reactivate</Text>
          </Pressable>
        )}
      </View>
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

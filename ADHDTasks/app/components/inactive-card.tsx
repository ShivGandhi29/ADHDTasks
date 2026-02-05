import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

type InactiveCardProps = {
  task: string;
  durationMinutes: number;
  onDelete: () => void;
};

export default function InactiveCard({
  task,
  durationMinutes,
  onDelete,
}: InactiveCardProps) {
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
        <Text style={styles.taskLabel}>Up next</Text>
        <Text style={styles.taskText}>{task}</Text>
        <Text style={styles.metaText}>{durationMinutes} min</Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    padding: 20,

  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingLeft: 12,
  },
  deleteButton: {
    backgroundColor: "#E5484D",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "600",
  },
  taskLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  taskText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
});

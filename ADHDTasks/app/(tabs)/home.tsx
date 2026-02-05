import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useStartTask } from "../hooks/useStartTask";

export default function HomeScreen() {
  const task = "Reply to council email";
  const { isRunning, onStart, remainingSeconds } = useStartTask(10 * 60);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const onSkip = () => {
    console.log("Skip for now");
  };

  const onAddTask = () => {
    console.log("Add task");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.taskLabel}>Right now</Text>

        <Text style={styles.taskText}>{task}</Text>

        <Pressable style={styles.primaryButton} onPress={onStart}>
          <Text style={styles.primaryButtonText}>
            {isRunning
              ? `Time left ${formatTime(remainingSeconds)}`
              : "Start 10 minutes"}
          </Text>
        </Pressable>

        {isRunning && (
          <Text style={styles.countdownText}>
            Countdown: {formatTime(remainingSeconds)}
          </Text>
        )}

        <Text style={styles.reassurance}>Starting is enough.</Text>

        <Pressable onPress={onSkip}>
          <Text style={styles.skipText}>Not now</Text>
        </Pressable>
      </View>

      <Pressable style={styles.addButton} onPress={onAddTask}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  taskLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },

  taskText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111",
    marginBottom: 32,
  },

  primaryButton: {
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },

  reassurance: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },

  countdownText: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 8,
  },

  skipText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

  addButton: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    fontSize: 32,
    color: "#111",
    marginBottom: 2,
  },
});

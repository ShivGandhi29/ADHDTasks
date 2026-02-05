import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useStartTask } from "../hooks/useStartTask";

type ActiveCardProps = {
  task: string;
  durationMinutes?: number;
  onAddToInactive: (task: string, durationMinutes: number) => void;
  onRunningChange?: (isRunning: boolean) => void;
};

export default function ActiveCard({
  task,
  durationMinutes = 10,
  onAddToInactive,
  onRunningChange,
}: ActiveCardProps) {
  const { isRunning, isPaused, onStart, onPause, onComplete, remainingSeconds } =
    useStartTask(
    durationMinutes * 60
    );

  useEffect(() => {
    onRunningChange?.(isRunning);
  }, [isRunning, onRunningChange]);

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

  const handleAdd = () => {
    onAddToInactive(task, durationMinutes);
  };

  return (
    <View style={[styles.card, isRunning && styles.cardFullScreen]}>
      <Text style={styles.taskLabel}>Right now</Text>

      <Text style={styles.taskText}>{task}</Text>

      <Pressable style={styles.primaryButton} onPress={onStart}>
        <Text style={styles.primaryButtonText}>
          {isRunning
            ? `Time left ${formatTime(remainingSeconds)}`
            : `Start ${durationMinutes} minutes`}
        </Text>
      </Pressable>



      <View style={styles.actionRow}>
        <Pressable
          style={[styles.secondaryButton, isPaused && styles.secondaryActive]}
          onPress={onPause}
          disabled={!isRunning}
        >
          <Text style={styles.secondaryButtonText}>
            {isPaused ? "Paused" : "Pause"}
          </Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={onComplete}
          disabled={!isRunning && remainingSeconds === 0}
        >
          <Text style={styles.secondaryButtonText}>Complete</Text>
        </Pressable>
      </View>

      <Text style={styles.reassurance}>Starting is enough.</Text>

      <Pressable onPress={onSkip}>
        <Text style={styles.skipText}>Not now</Text>
      </Pressable>



    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 44,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    //margin: 24,
  },
  cardFullScreen: {
    flex: 1,
    width: "100%",
    borderRadius: 0,
    paddingHorizontal: 32,
    paddingVertical: 48,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
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
  actionRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 12,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  secondaryActive: {
    backgroundColor: "#F2F2F2",
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
  },
  skipText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  addButton: {
    alignSelf: "center",
    marginTop: 20,
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

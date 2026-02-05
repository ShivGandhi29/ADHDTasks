import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

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
  const durationSeconds = useMemo(() => durationMinutes * 60, [durationMinutes]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    onRunningChange?.(isRunning);
  }, [isRunning, onRunningChange]);

  useEffect(() => {
    setRemainingSeconds(durationSeconds);
    setTimerKey((current) => current + 1);
  }, [durationSeconds]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const onStart = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(durationSeconds);
      setTimerKey((current) => current + 1);
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const onPause = () => {
    setIsPaused(true);
  };

  const onComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
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

      {isRunning && (
        <View style={styles.timerWrapper}>
          <CountdownCircleTimer
            key={timerKey}
            isPlaying={!isPaused}
            duration={durationSeconds}
            initialRemainingTime={remainingSeconds}
            colors={["#111", "#666", "#A30000"]}
            colorsTime={[durationSeconds, Math.max(2, durationSeconds * 0.3), 0]}
            strokeWidth={10}
            size={180}
            updateInterval={1}
            onUpdate={(remainingTime) => setRemainingSeconds(remainingTime)}
            onComplete={() => {
              onComplete();
              return { shouldRepeat: false };
            }}
          >
            {({ remainingTime }) => (
              <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
            )}
          </CountdownCircleTimer>
        </View>
      )}

      {(!isRunning || isPaused) && (
        <Pressable style={styles.primaryButton} onPress={onStart}>
          <Text style={styles.primaryButtonText}>
            {isPaused ? "Resume" : `Start ${durationMinutes} minutes`}
          </Text>
        </Pressable>
      )}



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

      <Text style={styles.reassurance}>Focus!!!</Text>





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
  timerWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 22,
    color: "#111",
    fontWeight: "600",
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

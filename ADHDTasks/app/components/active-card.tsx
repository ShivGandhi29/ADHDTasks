import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { AppColors } from "./ui/ThemeColors";

type ActiveCardProps = {
  task: string;
  durationMinutes?: number;
  onRunningChange?: (isRunning: boolean) => void;
  onCancel?: () => void;
  onComplete?: () => void;
};

export default function ActiveCard({
  task,
  durationMinutes = 10,
  onRunningChange,
  onCancel,
  onComplete,
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

  const handleComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    onComplete?.();
  };

  const handleCancel = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(durationSeconds);
    setTimerKey((current) => current + 1);
    onCancel?.();
  };

  return (
    <View style={[styles.card, isRunning && styles.cardFullScreen]}>
      <ScrollView
        contentContainerStyle={[
          styles.cardContent,
          isRunning && styles.cardContentFullScreen,
        ]}
        scrollEnabled={isRunning}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.taskLabel}>Right now</Text>

        <Text style={styles.taskText}>{task}</Text>

        {isRunning && (
          <View style={styles.timerWrapper}>
            <CountdownCircleTimer
              key={timerKey}
              isPlaying={!isPaused}
              duration={durationSeconds}
              initialRemainingTime={remainingSeconds}
              colors={[AppColors.TextDark, AppColors.SlateGray, AppColors.AccentRed]}
              colorsTime={[durationSeconds, Math.max(2, durationSeconds * 0.3), 0]}
              strokeWidth={10}
              size={300}
              updateInterval={1}
              onUpdate={(remainingTime) => setRemainingSeconds(remainingTime)}
              onComplete={() => {
                handleComplete();
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
            onPress={handleComplete}
            disabled={!isRunning && remainingSeconds === 0}
          >
            <Text style={styles.secondaryButtonText}>Complete</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleCancel}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
        </View>

        <Text style={styles.reassurance}>Focus!!!</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.White,
    borderRadius: 20,
    shadowColor: AppColors.Black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    //margin: 24,
  },
  timerWrapper: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  timerText: {
    fontSize: 36,
    color: AppColors.TextDark,
    fontWeight: "600",
  },
  cardFullScreen: {
    flex: 1,
    width: "100%",
    borderRadius: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  cardContent: {
    padding: 44,
  },
  cardContentFullScreen: {
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  taskLabel: {
    fontSize: 14,
    color: AppColors.MutedGray,
    marginBottom: 8,
  },
  taskText: {
    fontSize: 28,
    fontWeight: "600",
    color: AppColors.TextDark,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: AppColors.TextDark,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: AppColors.White,
    fontSize: 18,
    fontWeight: "600",
  },
  reassurance: {
    fontSize: 14,
    color: AppColors.SlateGray,
    textAlign: "center",
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 14,
    color: AppColors.Charcoal,
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
    borderColor: AppColors.BorderGray,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  secondaryActive: {
    backgroundColor: AppColors.WhiteSmoke,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: AppColors.Ink,
    fontWeight: "600",
  },
  skipText: {
    fontSize: 16,
    color: AppColors.SlateGray,
    textAlign: "center",
  },
  addButton: {
    alignSelf: "center",
    marginTop: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.WhiteSmoke,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 32,
    color: AppColors.TextDark,
    marginBottom: 2,
  },
});

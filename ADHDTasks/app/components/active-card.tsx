import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { AppColors } from "./ui/ThemeColors";
import CreateTaskForm from "./create-task-form";

type ActiveCardProps = {
  task: string;
  durationMinutes?: number;
  onRunningChange?: (isRunning: boolean) => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onUpdate?: (task: string, durationMinutes: number) => void;
};

export default function ActiveCard({
  task,
  durationMinutes = 10,
  onRunningChange,
  onCancel,
  onComplete,
  onUpdate,
}: ActiveCardProps) {
  const durationSeconds = useMemo(() => durationMinutes * 60, [durationMinutes]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [timerKey, setTimerKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isTimesUp, setIsTimesUp] = useState(false);

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
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

  const handleTimesUp = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    setIsTimesUp(true);
  };

  const handleComplete = () => {
    setIsTimesUp(false);
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    onComplete?.();
  };

  const handleExtend = (extraMinutes: number) => {
    setIsTimesUp(false);
    setRemainingSeconds(extraMinutes * 60);
    setTimerKey((current) => current + 1);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleCancel = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(durationSeconds);
    setTimerKey((current) => current + 1);
    onCancel?.();
  };

  const handleSaveEdit = (name: string, minutes: number) => {
    onUpdate?.(name, minutes);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const cardBody = (
    <>
      <Text style={styles.taskLabel}>Right now</Text>

      {isEditing ? (
        <CreateTaskForm
          initialTaskName={task}
          initialDuration={durationMinutes}
          onSubmit={handleSaveEdit}
          onCancel={handleCancelEdit}
          showCard={false}
        />
      ) : (
        <Text style={styles.taskText}>{task}</Text>
      )}

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
              handleTimesUp();
              return { shouldRepeat: false };
            }}
          >
            {({ remainingTime }) => (
              <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
            )}
          </CountdownCircleTimer>
        </View>
      )}

      {isTimesUp && (
        <View style={styles.timesUpSection}>
          <Text style={styles.timesUpEmoji}>&#127881;</Text>
          <Text style={styles.timesUpTitle}>Time's up!</Text>
          <Text style={styles.timesUpSubtitle}>
            Great focus session. What would you like to do?
          </Text>

          <Pressable style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Mark as complete</Text>
          </Pressable>

          <Text style={styles.extendLabel}>Need more time?</Text>
          <View style={styles.extendRow}>
            {[2, 5, 10].map((mins) => (
              <Pressable
                key={mins}
                style={styles.extendChip}
                onPress={() => handleExtend(mins)}
              >
                <Text style={styles.extendChipText}>+{mins} min</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {!isTimesUp && (!isRunning || isPaused) && !isEditing && (
        <View style={styles.startSection}>
          <Text style={styles.startMeta}>
            {isPaused
              ? `${formatTime(remainingSeconds)} remaining`
              : `${durationMinutes} minutes`}
          </Text>
          <Pressable style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>
              {isPaused ? "Resume" : "Start"}
            </Text>
          </Pressable>
        </View>
      )}

      {!isTimesUp && !isRunning && !isPaused && !isEditing && (
        <Pressable
          style={styles.editTrigger}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editTriggerText}>Edit task</Text>
        </Pressable>
      )}

      {isRunning && (
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionButton, isPaused && styles.actionButtonActive]}
            onPress={onPause}
          >
            <Text style={styles.actionButtonText}>
              {isPaused ? "Paused" : "Pause"}
            </Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleComplete}>
            <Text style={styles.actionButtonText}>Complete</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.actionButtonCancel]}
            onPress={handleCancel}
          >
            <Text style={[styles.actionButtonText, styles.actionButtonCancelText]}>
              Cancel
            </Text>
          </Pressable>
        </View>
      )}

      {!isEditing && !isTimesUp && (
        <Text style={styles.reassurance}>
          {isRunning ? "You've got this." : "Starting is enough."}
        </Text>
      )}
    </>
  );

  return (
    <View style={[styles.card, isRunning && styles.cardFullScreen]}>
      {isRunning ? (
        <ScrollView
          contentContainerStyle={[styles.cardContent, styles.cardContentFullScreen]}
          showsVerticalScrollIndicator={false}
        >
          {cardBody}
        </ScrollView>
      ) : (
        <View style={styles.cardContent}>{cardBody}</View>
      )}
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
    padding: 28,
  },
  cardContentFullScreen: {
    paddingHorizontal: 28,
    paddingVertical: 40,
  },

  // Header
  taskLabel: {
    fontSize: 13,
    color: AppColors.MutedGray,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  taskText: {
    fontSize: 26,
    fontWeight: "700",
    color: AppColors.TextDark,
    marginBottom: 28,
    lineHeight: 34,
  },

  // Timer
  timerWrapper: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  timerText: {
    fontSize: 38,
    color: AppColors.TextDark,
    fontWeight: "700",
    letterSpacing: 1,
  },

  // Start / Resume
  startSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  startMeta: {
    fontSize: 15,
    color: AppColors.SlateGray,
    marginBottom: 14,
  },
  startButton: {
    backgroundColor: AppColors.TextDark,
    paddingVertical: 22,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
  },
  startButtonText: {
    color: AppColors.White,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Edit trigger
  editTrigger: {
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
  },
  editTriggerText: {
    fontSize: 14,
    color: AppColors.SlateGray,
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  // Running actions
  actionRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginBottom: 16,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: AppColors.BorderGray,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  actionButtonActive: {
    backgroundColor: AppColors.WhiteSmoke,
  },
  actionButtonText: {
    fontSize: 15,
    color: AppColors.Ink,
    fontWeight: "600",
  },
  actionButtonCancel: {
    borderColor: AppColors.AlertRed,
  },
  actionButtonCancelText: {
    color: AppColors.AlertRed,
  },

  // Reassurance
  reassurance: {
    fontSize: 14,
    color: AppColors.SlateGray,
    textAlign: "center",
    marginTop: 16,
  },

  // Time's up
  timesUpSection: {
    alignItems: "center",
    paddingVertical: 8,
  },
  timesUpEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  timesUpTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: AppColors.TextDark,
    marginBottom: 8,
  },
  timesUpSubtitle: {
    fontSize: 15,
    color: AppColors.SlateGray,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  completeButton: {
    backgroundColor: AppColors.TextDark,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  completeButtonText: {
    color: AppColors.White,
    fontSize: 20,
    fontWeight: "700",
  },
  extendLabel: {
    fontSize: 14,
    color: AppColors.MutedGray,
    marginBottom: 12,
  },
  extendRow: {
    flexDirection: "row",
    gap: 12,
  },
  extendChip: {
    borderWidth: 1,
    borderColor: AppColors.BorderGray,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  extendChipText: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.Ink,
  },

});

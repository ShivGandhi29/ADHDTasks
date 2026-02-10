import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { playTimerEndAlarm } from "../utils/timer-alarm";
import { useTheme } from "../context/ThemeContext";
import CreateTaskForm from "./create-task-form";

type ActiveCardProps = {
  task: string;
  durationMinutes?: number;
  onRunningChange?: (isRunning: boolean, remainingSeconds: number) => void;
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
  const durationSeconds = useMemo(
    () => durationMinutes * 60,
    [durationMinutes],
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [currentDurationSeconds, setCurrentDurationSeconds] =
    useState(durationSeconds);
  const [timerKey, setTimerKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState(task);
  const [isTimesUp, setIsTimesUp] = useState(false);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  useEffect(() => {
    // Notify parent when running/paused state changes (not every second tick).
    // isRunning && !isPaused = actively counting down (widget shows live timer).
    // isPaused or !isRunning = stopped (widget shows static state).
    const isActivelyRunning = isRunning && !isPaused;
    onRunningChange?.(isActivelyRunning, remainingSeconds);
  }, [isRunning, isPaused, onRunningChange]);

  useEffect(() => {
    setRemainingSeconds(durationSeconds);
    setCurrentDurationSeconds(durationSeconds);
    setTimerKey((current) => current + 1);
  }, [durationSeconds]);

  useEffect(() => {
    if (!isEditingName) setEditingNameValue(task);
  }, [task, isEditingName]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const onStart = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(durationSeconds);
      setCurrentDurationSeconds(durationSeconds);
      setTimerKey((current) => current + 1);
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const onPause = () => {
    setIsPaused(true);
  };

  const handleTimesUp = () => {
    playTimerEndAlarm();
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
    setCurrentDurationSeconds(extraMinutes * 60);
    setTimerKey((current) => current + 1);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleAddTime = (extraMinutes: number) => {
    const extraSeconds = extraMinutes * 60;
    const newRemaining = remainingSeconds + extraSeconds;
    setRemainingSeconds(newRemaining);
    setCurrentDurationSeconds(newRemaining);
    setTimerKey((current) => current + 1);
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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.cardMuted,
          borderRadius: 20,
        },
        cardFullScreen: {
          width: "100%",
          borderRadius: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: { width: 0, height: 0 },
          elevation: 0,
        },
        cardContent: { padding: 28 },
        cardContentCompact: { paddingTop: 16 },
        cardContentFullScreen: {
          paddingHorizontal: 28,
          paddingVertical: 40,
        },
        taskLabel: {
          fontSize: 13,
          color: colors.textMuted,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        },
        taskNameTouchable: { marginBottom: 28 },
        taskText: {
          fontSize: 26,
          fontWeight: "700",
          color: colors.text,
          lineHeight: 34,
        },
        taskNameInput: {
          marginBottom: 28,
          padding: 0,
          marginVertical: 0,
          minHeight: 34,
          textAlignVertical: "top",
        },
        timerWrapper: {
          alignItems: "center",
          marginBottom: 24,
          marginTop: 8,
        },
        timerText: {
          fontSize: 38,
          color: colors.text,
          fontWeight: "700",
          letterSpacing: 1,
        },
        startSection: { alignItems: "center", marginBottom: 16 },
        startMeta: {
          fontSize: 15,
          color: colors.textSecondary,
          marginBottom: 14,
        },
        startButton: {
          backgroundColor: colors.text,
          paddingVertical: 22,
          paddingHorizontal: 48,
          borderRadius: 16,
          alignItems: "center",
          width: "100%",
        },
        completeButtonRow: { marginTop: 12, marginBottom: 16 },
        startButtonText: {
          color: colors.background,
          fontSize: 22,
          fontWeight: "700",
          letterSpacing: 0.5,
        },
        editTrigger: {
          alignItems: "center",
          paddingVertical: 8,
        },
        editTriggerText: {
          fontSize: 14,
          color: colors.textSecondary,
          fontWeight: "500",
          textDecorationLine: "underline",
        },
        needMoreTimeSection: { marginBottom: 16 },
        needMoreTimeLabel: {
          fontSize: 14,
          color: colors.textMuted,
          marginBottom: 10,
          textAlign: "center",
        },
        needMoreTimeRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
        },
        needMoreTimeChip: {
          borderWidth: 1.5,
          borderColor: colors.borderLight,
          backgroundColor: colors.card,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 999,
        },
        needMoreTimeChipText: {
          fontSize: 14,
          color: colors.textSecondary,
          fontWeight: "600",
        },
        actionRow: {
          flexDirection: "row",
          gap: 10,
          justifyContent: "center",
          marginBottom: 16,
        },
        actionButton: {
          borderWidth: 1,
          borderColor: colors.border,
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderRadius: 12,
        },
        actionButtonActive: { backgroundColor: colors.surface },
        actionButtonText: {
          fontSize: 15,
          color: colors.textSecondary,
          fontWeight: "600",
        },
        actionButtonCancel: { borderColor: colors.alert },
        actionButtonCancelText: { color: colors.alert },
        reassurance: {
          fontSize: 14,
          color: colors.textSecondary,
          textAlign: "center",
          marginTop: 16,
        },
        timesUpSection: { alignItems: "center", paddingVertical: 8 },
        timesUpEmoji: { fontSize: 48, marginBottom: 8 },
        timesUpTitle: {
          fontSize: 28,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 8,
        },
        timesUpSubtitle: {
          fontSize: 15,
          color: colors.textSecondary,
          textAlign: "center",
          marginBottom: 24,
          lineHeight: 22,
        },
        completeButton: {
          backgroundColor: colors.text,
          paddingVertical: 20,
          borderRadius: 16,
          alignItems: "center",
          width: "100%",
          marginBottom: 24,
        },
        completeButtonText: {
          color: colors.background,
          fontSize: 20,
          fontWeight: "700",
        },
        extendLabel: {
          fontSize: 14,
          color: colors.textMuted,
          marginBottom: 12,
        },
        extendRow: { flexDirection: "row", gap: 12 },
        extendChip: {
          borderWidth: 1,
          borderColor: colors.border,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 12,
        },
        extendChipText: {
          fontSize: 15,
          fontWeight: "600",
          color: colors.textSecondary,
        },
      }),
    [colors],
  );

  const cardBody = (
    <>
      {isEditing ? (
        <CreateTaskForm
          initialTaskName={task}
          initialDuration={durationMinutes}
          onSubmit={handleSaveEdit}
          onCancel={handleCancelEdit}
          showCard={false}
        />
      ) : isEditingName ? (
        <TextInput
          style={[styles.taskText, styles.taskNameInput]}
          value={editingNameValue}
          onChangeText={setEditingNameValue}
          placeholder="Task name"
          placeholderTextColor={colors.textMuted}
          autoFocus
          selectTextOnFocus
          multiline
          blurOnSubmit
          returnKeyType="done"
          onSubmitEditing={() => {
            const trimmed = editingNameValue.replace(/[\r\n]+/g, " ").trim();
            if (trimmed) onUpdate?.(trimmed, durationMinutes);
            setIsEditingName(false);
          }}
          onBlur={() => {
            const trimmed = editingNameValue.replace(/[\r\n]+/g, " ").trim();
            if (trimmed) onUpdate?.(trimmed, durationMinutes);
            setIsEditingName(false);
          }}
        />
      ) : (
        <Pressable
          style={styles.taskNameTouchable}
          onPress={() => {
            setEditingNameValue(task);
            setIsEditingName(true);
          }}
        >
          <Text style={styles.taskText}>{task}</Text>
        </Pressable>
      )}

      {isRunning && (
        <View style={styles.timerWrapper}>
          <CountdownCircleTimer
            key={timerKey}
            isPlaying={!isPaused}
            duration={currentDurationSeconds}
            initialRemainingTime={remainingSeconds}
            colors={
              [colors.text, colors.textSecondary, colors.accentRed] as [
                `#${string}`,
                `#${string}`,
                `#${string}`,
              ]
            }
            colorsTime={[
              currentDurationSeconds,
              Math.max(2, currentDurationSeconds * 0.3),
              0,
            ]}
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
        <>
          {!isPaused && (
            <View style={styles.completeButtonRow}>
              <Pressable style={styles.startButton} onPress={handleComplete}>
                <Text style={styles.startButtonText}>Complete</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.needMoreTimeSection}>
            <Text style={styles.needMoreTimeLabel}>Need more time?</Text>
            <View style={styles.needMoreTimeRow}>
              {[5, 10, 15, 30].map((mins) => (
                <Pressable
                  key={mins}
                  style={styles.needMoreTimeChip}
                  onPress={() => handleAddTime(mins)}
                >
                  <Text style={styles.needMoreTimeChipText}>+{mins}m</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.actionRow}>
            <Pressable
              style={[
                styles.actionButton,
                isPaused && styles.actionButtonActive,
              ]}
              onPress={onPause}
            >
              <Text style={styles.actionButtonText}>
                {isPaused ? "Paused" : "Pause"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.actionButtonCancel]}
              onPress={handleCancel}
            >
              <Text
                style={[styles.actionButtonText, styles.actionButtonCancelText]}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </>
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
      <View
        style={[
          styles.cardContent,
          !isRunning && styles.cardContentCompact,
          isRunning && styles.cardContentFullScreen,
        ]}
      >
        {cardBody}
      </View>
    </View>
  );
}

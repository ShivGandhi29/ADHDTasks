import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppColors } from "./ui/ThemeColors";

type CreateTaskFormProps = {
  /** Called when the user submits or saves the form */
  onSubmit: (taskName: string, durationMinutes: number) => void;
  /** Label for the primary button (default: "Create task") */
  submitLabel?: string;
  /** If provided, enables edit mode with Cancel + Save buttons */
  onCancel?: () => void;
  /** Pre-fill the task name (edit mode) */
  initialTaskName?: string;
  /** Pre-fill the duration in minutes (edit mode) */
  initialDuration?: number;
  /** Whether to show the card wrapper with shadow (default: true) */
  showCard?: boolean;
  /** Whether to show the "New Task" heading (default: true). Set false when the parent provides its own header. */
  showHeading?: boolean;
};

export default function CreateTaskForm({
  onSubmit,
  submitLabel = "Create task",
  onCancel,
  initialTaskName = "",
  initialDuration,
  showCard = true,
  showHeading = true,
}: CreateTaskFormProps) {
  const [taskName, setTaskName] = useState(initialTaskName);
  const [durationMinutes, setDurationMinutes] = useState(
    initialDuration ? String(initialDuration) : ""
  );
  const isEditMode = Boolean(onCancel);

  // Sync with external prop changes (e.g. when the parent task changes)
  useEffect(() => {
    setTaskName(initialTaskName);
  }, [initialTaskName]);

  useEffect(() => {
    setDurationMinutes(initialDuration ? String(initialDuration) : "");
  }, [initialDuration]);

  const handleTaskNameChange = (value: string) => {
    // Strip newlines — enter key is blocked, but handle paste too
    setTaskName(value.replace(/[\r\n]+/g, " "));
  };

  const handleSubmit = () => {
    const trimmedName = taskName.trim();
    const parsedMinutes = Number(durationMinutes);
    if (!trimmedName || !Number.isFinite(parsedMinutes) || parsedMinutes <= 0) {
      return;
    }
    onSubmit(trimmedName, parsedMinutes);
    if (!isEditMode) {
      setTaskName("");
      setDurationMinutes("");
    }
  };

  const content = (
    <>
      {!isEditMode && showHeading && (
        <Text style={styles.heading}>New Task</Text>
      )}

      <Text style={styles.fieldLabel}>Task name</Text>
      <TextInput
        style={styles.taskNameInput}
        placeholder="What do you need to do?"
        placeholderTextColor={AppColors.MutedGray}
        value={taskName}
        onChangeText={handleTaskNameChange}
        autoCapitalize="sentences"
        returnKeyType="done"
        multiline={true}
        blurOnSubmit={true}
        onKeyPress={({ nativeEvent }) => {
          if (nativeEvent.key === "Enter") {
            // swallow the enter key
          }
        }}
        scrollEnabled={false}
      />

      <Text style={styles.fieldLabel}>How long will this take?</Text>
      <View style={styles.timeRow}>
        <TextInput
          style={styles.timeInput}
          placeholder="10"
          placeholderTextColor={AppColors.MutedGray}
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          keyboardType="number-pad"
          returnKeyType="done"
        />
        <Text style={styles.timeSuffix}>minutes</Text>
      </View>

      <View style={styles.chipRow}>
        {["5", "10", "15", "30", "60"].map((value) => (
          <Pressable
            key={value}
            style={[
              styles.chip,
              durationMinutes === value && styles.chipActive,
            ]}
            onPress={() => setDurationMinutes(value)}
          >
            <Text
              style={[
                styles.chipText,
                durationMinutes === value && styles.chipTextActive,
              ]}
            >
              {value}m
            </Text>
          </Pressable>
        ))}
      </View>

      {isEditMode ? (
        <View style={styles.editActions}>
          <Pressable
            style={[styles.actionButton, styles.actionButtonOutline]}
            onPress={onCancel}
          >
            <Text style={styles.actionButtonOutlineText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.actionButtonFilled]}
            onPress={handleSubmit}
          >
            <Text style={styles.actionButtonFilledText}>Save</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{submitLabel}</Text>
        </Pressable>
      )}
    </>
  );

  if (!showCard) {
    return <View style={styles.noPadding}>{content}</View>;
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.White,
    borderRadius: 20,
    padding: 28,
    shadowColor: AppColors.Black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  noPadding: {},
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: AppColors.TextDark,
    marginBottom: 24,
    lineHeight: 34,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.SlateGray,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  taskNameInput: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 20,
    color: AppColors.TextDark,
    marginBottom: 40,
fontWeight: "700",    //minHeight: 24,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.OffWhite,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: AppColors.LightGray,
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
    fontSize: 18,
    color: AppColors.TextDark,
    fontWeight: "600",
    paddingVertical: 0,
  },
  timeSuffix: {
    fontSize: 15,
    color: AppColors.MutedGray,
    fontWeight: "500",
    marginLeft: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: AppColors.LightGray,
    backgroundColor: AppColors.White,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipActive: {
    borderColor: AppColors.TextDark,
    backgroundColor: AppColors.TextDark,
  },
  chipText: {
    fontSize: 14,
    color: AppColors.Ink,
    fontWeight: "600",
  },
  chipTextActive: {
    color: AppColors.White,
  },
  // Single submit button (create mode)
  submitButton: {
    backgroundColor: AppColors.TextDark,
    paddingVertical: 20,
    borderRadius: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: AppColors.White,
    fontSize: 20,
    fontWeight: "700",
  },
  // Cancel + Save row (edit mode)
  editActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  actionButtonOutline: {
    borderWidth: 1.5,
    borderColor: AppColors.BorderGray,
    backgroundColor: AppColors.White,
  },
  actionButtonOutlineText: {
    fontSize: 16,
    color: AppColors.Ink,
    fontWeight: "600",
  },
  actionButtonFilled: {
    backgroundColor: AppColors.TextDark,
  },
  actionButtonFilledText: {
    fontSize: 16,
    color: AppColors.White,
    fontWeight: "600",
  },
});

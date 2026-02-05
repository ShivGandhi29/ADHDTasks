import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { addTask, TaskItem } from "../data/tasks";

export default function NewTask() {
  const [taskName, setTaskName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const router = useRouter();
  const maxTaskLines = 5;

  const handleAddTask = async () => {
    const trimmedName = taskName.trim();
    const parsedMinutes = Number(durationMinutes);

    if (!trimmedName || !Number.isFinite(parsedMinutes) || parsedMinutes <= 0) {
      return;
    }

    const newTask: TaskItem = {
      id: `${Date.now()}`,
      name: trimmedName,
      durationMinutes: parsedMinutes,
      createdAt: new Date().toISOString(),
    };

    try {
      await addTask(newTask);
      setTaskName("");
      setDurationMinutes("");
      router.navigate("/(tabs)/home");
    } catch (error) {
      console.log("Failed to save task", error);
    }
  };

  const handleTaskNameChange = (value: string) => {
    const lines = value.split(/\r?\n/);
    if (lines.length > maxTaskLines) {
      setTaskName(lines.slice(0, maxTaskLines).join("\n"));
      return;
    }
    setTaskName(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.taskLabel}>Create task</Text>
        <Text style={styles.taskText}>New Task</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Task name</Text>
          <TextInput
            style={styles.input}
            placeholder="Reply to council email"
            value={taskName}
            onChangeText={handleTaskNameChange}
            autoCapitalize="sentences"
            returnKeyType="next"
            multiline={true}
            numberOfLines={5}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>How long will this take?</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeInputWrapper}>
              <TextInput
                style={styles.timeInput}
                placeholder="10"
                value={durationMinutes}
                onChangeText={setDurationMinutes}
                keyboardType="number-pad"
                returnKeyType="done"
              />
              <Text style={styles.timeSuffix}>min</Text>
            </View>
            <View style={styles.chipRow}>
              {["5", "10", "15", "25"].map((value) => (
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
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleAddTask}>
          <Text style={styles.primaryButtonText}>Add task</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    margin: 24,
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
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  timeRow: {
    gap: 12,
  },
  timeInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  timeInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    paddingVertical: 0,
  },
  timeSuffix: {
    fontSize: 14,
    color: "#888",
    marginLeft: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipActive: {
    borderColor: "#111",
    backgroundColor: "#111",
  },
  chipText: {
    fontSize: 13,
    color: "#222",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFF",
  },
  primaryButton: {
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

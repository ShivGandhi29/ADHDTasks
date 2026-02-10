import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  addTask,
  addToDoListTask,
  getActiveTask,
  getTasks,
  setActiveTask,
  TaskItem,
} from "../data/tasks";
import { useTheme } from "../context/ThemeContext";
import CreateTaskForm from "../components/create-task-form";

const MAX_TASKS = 3;

export default function NewTask() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
          padding: 16,
        },
        header: { marginTop: 14, marginBottom: 16 },
        greeting: {
          fontSize: 32,
          fontWeight: "600",
          color: colors.text,
        },
      }),
    [colors],
  );

  const handleAddTask = async (taskName: string, durationMinutes: number) => {
    const newTask: TaskItem = {
      id: `${Date.now()}`,
      name: taskName,
      durationMinutes,
      createdAt: new Date().toISOString(),
    };

    try {
      const [active, inactive] = await Promise.all([
        getActiveTask(),
        getTasks(),
      ]);
      const totalCount = (active ? 1 : 0) + inactive.length;
      if (totalCount >= MAX_TASKS) {
        await addToDoListTask(newTask);
        Alert.alert(
          "Added to To Do!",
          "You already have 3 active tasks. Complete them first!",
          [{ text: "OK" }],
        );
        return;
      }
      if (!active) {
        await setActiveTask(newTask);
      } else {
        await addTask(newTask);
      }
      router.navigate("/(tabs)/home");
    } catch (error) {
      console.log("Failed to save task", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>New Task</Text>
      </View>
      <CreateTaskForm
        onSubmit={handleAddTask}
        submitLabel="Add Task"
        showHeading={false}
      />
    </SafeAreaView>
  );
}

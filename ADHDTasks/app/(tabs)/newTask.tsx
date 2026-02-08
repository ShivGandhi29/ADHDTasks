import React, { useCallback } from "react";
import { Alert, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { addTask, getActiveTask, getTasks, TaskItem } from "../data/tasks";
import { AppColors } from "../components/ui/ThemeColors";
import CreateTaskForm from "../components/create-task-form";

export default function NewTask() {
  const router = useRouter();

  const checkTaskLimits = useCallback(async () => {
    const [active, inactive] = await Promise.all([getActiveTask(), getTasks()]);
    const isBlocked = Boolean(active) && inactive.length >= 2;
    if (isBlocked) {
      Alert.alert(
        "Finish existing tasks",
        "Please complete your current tasks before creating new ones.",
        [
          {
            text: "Lets get it done!",
            onPress: () => router.navigate("/(tabs)/home"),
          },
        ],
      );
    }
    return isBlocked;
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkTaskLimits();
    }, [checkTaskLimits]),
  );

  const handleAddTask = async (taskName: string, durationMinutes: number) => {
    if (await checkTaskLimits()) {
      return;
    }

    const newTask: TaskItem = {
      id: `${Date.now()}`,
      name: taskName,
      durationMinutes,
      createdAt: new Date().toISOString(),
    };

    try {
      await addTask(newTask);
      router.navigate("/(tabs)/home");
    } catch (error) {
      console.log("Failed to save task", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CreateTaskForm onSubmit={handleAddTask} submitLabel="Add Task" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.White,
    padding: 16,
    //justifyContent: "center",
  },
});

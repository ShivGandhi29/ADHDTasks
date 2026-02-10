import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PastCard from "../components/past-card";
import {
  addTask,
  getActiveTask,
  getHistoryTasks,
  getTasks,
  removeHistoryTask,
  setActiveTask,
  TaskItem,
} from "../data/tasks";
import { AppColors } from "../components/ui/ThemeColors";

const MAX_TASKS = 3;

export default function History() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    const existing = await getHistoryTasks();
    const sorted = [...existing].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setTasks(sorted);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const handleDelete = (taskId: string) => {
    Alert.alert("Delete task?", "This will remove it from your history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeHistoryTask(taskId);
          loadTasks();
        },
      },
    ]);
  };

  const handleAddFromHistory = useCallback(async (item: TaskItem) => {
    const [active, inactiveTasks] = await Promise.all([
      getActiveTask(),
      getTasks(),
    ]);
    const isSameTask = (t: TaskItem) =>
      t.name === item.name && t.durationMinutes === item.durationMinutes;
    const alreadyInActive =
      active && isSameTask(active);
    const alreadyInInactive = inactiveTasks.some(isSameTask);
    if (alreadyInActive || alreadyInInactive) {
      Alert.alert("Already in active tasks", undefined, [{ text: "OK" }]);
      return;
    }
    const totalCount = (active ? 1 : 0) + inactiveTasks.length;
    if (totalCount >= MAX_TASKS) {
      Alert.alert(
        "Too many tasks",
        "Please complete your current tasks before adding a new one."
      );
      return;
    }
    const task: TaskItem = {
      id: `${Date.now()}`,
      name: item.name,
      durationMinutes: item.durationMinutes,
      createdAt: new Date().toISOString(),
    };
    if (!active) {
      await setActiveTask(task);
    } else {
      await addTask(task);
    }
    setExpandedTaskId(null);
  }, []);

  const handleCardPress = useCallback((itemId: string) => {
    setExpandedTaskId((current) => (current === itemId ? null : itemId));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No past tasks yet.</Text>
        ) : (
          <View style={styles.list}>
            {tasks.map((item) => (
              <PastCard
                key={item.id}
                task={item.name}
                durationMinutes={item.durationMinutes}
                onDelete={() => handleDelete(item.id)}
                onReactivate={() => handleAddFromHistory(item)}
                reactivateLabel="Add to Up Next"
                expanded={expandedTaskId === item.id}
                onCardPress={() => handleCardPress(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.White,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  list: {
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.SlateGray,
    textAlign: "center",
    marginTop: 32,
  },
});

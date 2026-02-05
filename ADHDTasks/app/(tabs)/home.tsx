import React, { useCallback, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import ActiveCard from "../components/active-card";
import InactiveCard from "../components/inactive-card";
import { addTask, getTasks, removeTask, TaskItem } from "../data/tasks";

export default function HomeScreen() {
  const [inactiveTasks, setInactiveTasks] = useState<TaskItem[]>([]);

  const activeTask = {
    task: "Reply to council email",
    durationMinutes: 10,
  };

  const loadTasks = useCallback(async () => {
    const tasks = await getTasks();
    setInactiveTasks(tasks);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const handleAddToInactive = async (task: string, durationMinutes: number) => {
    const newTask: TaskItem = {
      id: `${Date.now()}`,
      name: task,
      durationMinutes,
      createdAt: new Date().toISOString(),
    };
    await addTask(newTask);
    loadTasks();
  };

  const handleDeleteInactive = (taskId: string) => {
    Alert.alert("Delete task?", "This will remove it from your list.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeTask(taskId);
          loadTasks();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ActiveCard
          task={activeTask.task}
          durationMinutes={activeTask.durationMinutes}
          onAddToInactive={handleAddToInactive}
        />
        {inactiveTasks.length > 0 && (
          <View style={styles.list}>
            {inactiveTasks.map((item) => (
              <InactiveCard
                key={item.id}
                task={item.name}
                durationMinutes={item.durationMinutes}
                onDelete={() => handleDeleteInactive(item.id)}
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
    backgroundColor: "#F8F8F8",
  },
  content: {
    padding: 24,
    gap: 16,
  },
  list: {
    gap: 12,
  },
});

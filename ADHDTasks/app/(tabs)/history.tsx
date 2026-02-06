import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PastCard from "../components/past-card";
import { getHistoryTasks, removeHistoryTask, TaskItem } from "../data/tasks";
import { AppColors } from "../components/ui/ThemeColors";

export default function History() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);

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
    backgroundColor: AppColors.OffWhite,
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

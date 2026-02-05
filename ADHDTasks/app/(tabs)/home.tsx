import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveCard from "../components/active-card";
import InactiveCard from "../components/inactive-card";
import { addTask, getTasks, removeTask, TaskItem } from "../data/tasks";
import { AppColors } from "../components/ui/ThemeColors";

export default function HomeScreen() {
  const [inactiveTasks, setInactiveTasks] = useState<TaskItem[]>([]);
  const [isActiveRunning, setIsActiveRunning] = useState(false);
  const router = useRouter();
  const [activeTask, setActiveTask] = useState<{
    task: string;
    durationMinutes: number;
  }>({
    task: "Reply to council email",
    durationMinutes: 10,
  });

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

  const activateInactiveTask = async (task: TaskItem) => {
    setActiveTask({ task: task.name, durationMinutes: task.durationMinutes });
    await removeTask(task.id);
    loadTasks();
  };

  const handleActivateInactive = (task: TaskItem) => {
    if (activeTask && activeTask.task !== task.name) {
      Alert.alert(
        "Replace active task?",
        "You already have an active task. Replace it with this one?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Replace",
            style: "destructive",
            onPress: () => activateInactiveTask(task),
          },
        ]
      );
      return;
    }

    activateInactiveTask(task);
  };

  const handleCancelActive = () => {
    router.navigate("/(tabs)/history");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isActiveRunning && styles.contentFullScreen,
        ]}
        scrollEnabled={!isActiveRunning}
      >
        <View style={isActiveRunning ? styles.activeFullScreen : undefined}>
          <ActiveCard
            task={activeTask.task}
            durationMinutes={activeTask.durationMinutes}
            onAddToInactive={handleAddToInactive}
            onRunningChange={setIsActiveRunning}
            onCancel={handleCancelActive}
          />
        </View>
        {!isActiveRunning && inactiveTasks.length > 0 && (
          <View style={styles.list}>
            {inactiveTasks.map((item) => (
              <InactiveCard
                key={item.id}
                task={item.name}
                durationMinutes={item.durationMinutes}
                onDelete={() => handleDeleteInactive(item.id)}
                onActivate={() => handleActivateInactive(item)}
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
  contentFullScreen: {
    flexGrow: 1,
    padding: 0,
  },
  activeFullScreen: {
    flex: 1,
  },
});

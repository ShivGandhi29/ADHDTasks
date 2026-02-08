import React, { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveCard from "../components/active-card";
import InactiveCard from "../components/inactive-card";
import CreateTaskForm from "../components/create-task-form";
import {
  addHistoryTask,
  addTask,
  clearActiveTask,
  getActiveTask,
  getTasks,
  removeTask,
  setActiveTask as setActiveTaskStorage,
  TaskItem,
} from "../data/tasks";
import { syncWidgetWithTask } from "../utils/widget";
import { AppColors } from "../components/ui/ThemeColors";

export default function HomeScreen() {
  const [inactiveTasks, setInactiveTasks] = useState<TaskItem[]>([]);
  const [isActiveRunning, setIsActiveRunning] = useState(false);
  const [activeTask, setActiveTask] = useState<{
    task: string;
    durationMinutes: number;
  } | null>(null);

  const handleRunningChange = useCallback(
    (running: boolean, remainingSeconds: number) => {
      setIsActiveRunning(running);
      if (activeTask) {
        syncWidgetWithTask(
          {
            id: "",
            name: activeTask.task,
            durationMinutes: activeTask.durationMinutes,
            createdAt: "",
          },
          { isRunning: running, remainingSeconds }
        );
      }
    },
    [activeTask]
  );
  const router = useRouter();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const loadTasks = useCallback(async () => {
    const [tasks, active] = await Promise.all([getTasks(), getActiveTask()]);
    setInactiveTasks(tasks);
    if (active) {
      setActiveTask({ task: active.name, durationMinutes: active.durationMinutes });
      syncWidgetWithTask(active);
    } else {
      setActiveTask(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

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
    if (activeTask) {
      const previousActive: TaskItem = {
        id: `${Date.now()}`,
        name: activeTask.task,
        durationMinutes: activeTask.durationMinutes,
        createdAt: new Date().toISOString(),
      };
      await addTask(previousActive);
    }
    setActiveTask({ task: task.name, durationMinutes: task.durationMinutes });
    await setActiveTaskStorage(task);
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

  const handleFinishActive = async () => {
    if (!activeTask) return;
    const historyItem: TaskItem = {
      id: `${Date.now()}`,
      name: activeTask.task,
      durationMinutes: activeTask.durationMinutes,
      createdAt: new Date().toISOString(),
    };
    await addHistoryTask(historyItem);

    if (inactiveTasks.length > 0) {
      const [nextTask, ...remaining] = inactiveTasks;
      await removeTask(nextTask.id);
      setActiveTask({
        task: nextTask.name,
        durationMinutes: nextTask.durationMinutes,
      });
      await setActiveTaskStorage(nextTask);
      setInactiveTasks(remaining);
      await loadTasks();
      return;
    }

    setActiveTask(null);
    await clearActiveTask();
    await loadTasks();
    router.navigate("/(tabs)/history");
  };

  const handleUpdateActive = async (name: string, durationMinutes: number) => {
    if (!activeTask) return;
    const updated: TaskItem = {
      id: activeTask.task + durationMinutes,
      name,
      durationMinutes,
      createdAt: new Date().toISOString(),
    };
    setActiveTask({ task: name, durationMinutes });
    await setActiveTaskStorage(updated);
  };

  const handleCreateActive = async (taskName: string, minutes: number) => {
    const newActive: TaskItem = {
      id: `${Date.now()}`,
      name: taskName,
      durationMinutes: minutes,
      createdAt: new Date().toISOString(),
    };
    setActiveTask({ task: taskName, durationMinutes: minutes });
    await setActiveTaskStorage(newActive);
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
        {!isActiveRunning && (
          <View style={styles.header}>
            <Text style={styles.greeting}>{greeting}</Text>
          </View>
        )}
        {activeTask ? (
          <View style={isActiveRunning ? styles.activeFullScreen : undefined}>
            <ActiveCard
              task={activeTask.task}
              durationMinutes={activeTask.durationMinutes}
              onRunningChange={handleRunningChange}
              onCancel={handleFinishActive}
              onComplete={handleFinishActive}
              onUpdate={handleUpdateActive}
            />
          </View>
        ) : (
          <CreateTaskForm
            onSubmit={handleCreateActive}
            submitLabel="Add Task"
          />
        )}
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
    padding: 16,
    gap: 16,
  },
  list: {
    gap: 12,
  },
  header: {
    marginTop: 14,
    marginBottom: 14,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "600",
    color: AppColors.TextDark,
  },
  contentFullScreen: {
    flexGrow: 1,
    padding: 0,
  },
  activeFullScreen: {
    flex: 1,
  },
});

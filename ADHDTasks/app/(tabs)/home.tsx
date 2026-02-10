import React, { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ActiveCard from "../components/active-card";
import InactiveCard from "../components/inactive-card";
import CreateTaskForm from "../components/create-task-form";
import {
  addHistoryTask,
  addTask,
  addToDoListTask,
  clearActiveTask,
  getActiveTask,
  getTasks,
  getToDoListTasks,
  removeTask,
  removeToDoListTask,
  setActiveTask as setActiveTaskStorage,
  TaskItem,
} from "../data/tasks";
import { syncWidgetWithTask } from "../utils/widget";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { padding: 16, gap: 16 },
        list: { gap: 12 },
        upNextHeader: {
          fontSize: 20,
          fontWeight: "700",
          color: colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 5,
          marginBottom: 8,
          marginTop: 16,
          textAlign: "center",
        },
        header: { marginTop: 14, marginBottom: 14 },
        greeting: {
          fontSize: 32,
          fontWeight: "600",
          color: colors.text,
        },
        contentFullScreen: { padding: 0 },
        activeFullScreen: {},
      }),
    [colors]
  );
  const [inactiveTasks, setInactiveTasks] = useState<TaskItem[]>([]);
  const [isActiveRunning, setIsActiveRunning] = useState(false);
  const [activeTask, setActiveTask] = useState<{
    task: string;
    durationMinutes: number;
  } | null>(null);
  const [expandedInactiveId, setExpandedInactiveId] = useState<string | null>(
    null,
  );

  const handleInactiveCardPress = useCallback((itemId: string) => {
    setExpandedInactiveId((current) => (current === itemId ? null : itemId));
  }, []);

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
          { isRunning: running, remainingSeconds },
        );
      }
    },
    [activeTask],
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
      setActiveTask({
        task: active.name,
        durationMinutes: active.durationMinutes,
      });
      syncWidgetWithTask(active);
    } else {
      setActiveTask(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  const handleDeleteInactive = (taskId: string) => {
    Alert.alert("Delete task?", "This will remove it from your list.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setExpandedInactiveId(null);
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
    setExpandedInactiveId(null);
    setActiveTask({ task: task.name, durationMinutes: task.durationMinutes });
    await setActiveTaskStorage(task);
    await removeTask(task.id);
    loadTasks();
  };

  const handleMoveToToDo = useCallback(
    async (item: TaskItem) => {
      setExpandedInactiveId(null);
      await addToDoListTask(item);
      await removeTask(item.id);
      loadTasks();
    },
    [loadTasks],
  );

  const handleActivateInactive = (task: TaskItem) => {
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

    // If there are inactive tasks, activate the first one
    if (inactiveTasks.length > 0) {
      const [nextTask, ...remaining] = inactiveTasks;
      await removeTask(nextTask.id);
      setActiveTask({
        task: nextTask.name,
        durationMinutes: nextTask.durationMinutes,
      });
      await setActiveTaskStorage(nextTask);
      setInactiveTasks(remaining);

      // Maintain 2 inactive tasks by pulling from To Do list if needed
      const currentInactiveCount = remaining.length;
      if (currentInactiveCount < 2) {
        const toDoTasks = await getToDoListTasks();
        const needed = 2 - currentInactiveCount;
        for (let i = 0; i < needed && i < toDoTasks.length; i++) {
          const taskToAdd = toDoTasks[i];
          await removeToDoListTask(taskToAdd.id);
          await addTask(taskToAdd);
        }
      }

      await loadTasks();
      return;
    }

    // If no inactive tasks, check To Do list and activate the first task from there
    const toDoTasks = await getToDoListTasks();
    if (toDoTasks.length > 0) {
      const [nextTask, ...remainingToDo] = toDoTasks;
      await removeToDoListTask(nextTask.id);
      setActiveTask({
        task: nextTask.name,
        durationMinutes: nextTask.durationMinutes,
      });
      await setActiveTaskStorage(nextTask);

      // Fill inactive tasks up to 2 from remaining To Do list
      const needed = 2;
      for (let i = 0; i < needed && i < remainingToDo.length; i++) {
        await removeToDoListTask(remainingToDo[i].id);
        await addTask(remainingToDo[i]);
      }

      await loadTasks();
      return;
    }

    // No tasks left, clear active and go to history
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
    const newTask: TaskItem = {
      id: `${Date.now()}`,
      name: taskName,
      durationMinutes: minutes,
      createdAt: new Date().toISOString(),
    };
    const [active, inactiveTasksList] = await Promise.all([
      getActiveTask(),
      getTasks(),
    ]);
    const totalCount = (active ? 1 : 0) + inactiveTasksList.length;
    if (totalCount >= 3) {
      await addToDoListTask(newTask);
      Alert.alert(
        "Added to Tasks!",
        "You already have 3 active tasks. Complete them first!",
        [{ text: "OK" }],
      );
      return;
    }
    setActiveTask({ task: taskName, durationMinutes: minutes });
    await setActiveTaskStorage(newTask);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isActiveRunning && styles.contentFullScreen,
        ]}
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
            <Text style={styles.upNextHeader}>Up next</Text>
            {inactiveTasks.map((item) => (
              <InactiveCard
                key={item.id}
                task={item.name}
                durationMinutes={item.durationMinutes}
                onDelete={() => handleDeleteInactive(item.id)}
                onActivate={() => handleActivateInactive(item)}
                onMoveToToDo={() => handleMoveToToDo(item)}
                expanded={expandedInactiveId === item.id}
                onCardPress={() => handleInactiveCardPress(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

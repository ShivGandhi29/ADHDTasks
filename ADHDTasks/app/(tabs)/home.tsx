import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveCard from "../components/active-card";
import InactiveCard from "../components/inactive-card";
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
import { AppColors } from "../components/ui/ThemeColors";

export default function HomeScreen() {
  const [inactiveTasks, setInactiveTasks] = useState<TaskItem[]>([]);
  const [isActiveRunning, setIsActiveRunning] = useState(false);
  const router = useRouter();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);
  const [activeTask, setActiveTask] = useState<{
    task: string;
    durationMinutes: number;
  } | null>(null);
  const [draftTaskName, setDraftTaskName] = useState("");
  const [draftDurationMinutes, setDraftDurationMinutes] = useState("");

  const loadTasks = useCallback(async () => {
    const [tasks, active] = await Promise.all([getTasks(), getActiveTask()]);
    setInactiveTasks(tasks);
    if (active) {
      setActiveTask({ task: active.name, durationMinutes: active.durationMinutes });
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

  const handleCreateActive = async () => {
    const trimmedName = draftTaskName.trim();
    const parsedMinutes = Number(draftDurationMinutes);
    if (!trimmedName || !Number.isFinite(parsedMinutes) || parsedMinutes <= 0) {
      return;
    }
    const newActive: TaskItem = {
      id: `${Date.now()}`,
      name: trimmedName,
      durationMinutes: parsedMinutes,
      createdAt: new Date().toISOString(),
    };
    setActiveTask({ task: trimmedName, durationMinutes: parsedMinutes });
    await setActiveTaskStorage(newActive);
    setDraftTaskName("");
    setDraftDurationMinutes("");
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
              onRunningChange={setIsActiveRunning}
              onCancel={handleFinishActive}
              onComplete={handleFinishActive}
            />
          </View>
        ) : (
          <View style={styles.newTaskCard}>
            <Text style={styles.taskLabel}>Create task</Text>
            <Text style={styles.taskTitle}>New Task</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Task name</Text>
              <TextInput
                style={styles.input}
                placeholder="Reply to council email"
                value={draftTaskName}
                onChangeText={setDraftTaskName}
                autoCapitalize="sentences"
                returnKeyType="next"
                multiline={true}
                numberOfLines={3}
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
                    value={draftDurationMinutes}
                    onChangeText={setDraftDurationMinutes}
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
                        draftDurationMinutes === value && styles.chipActive,
                      ]}
                      onPress={() => setDraftDurationMinutes(value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draftDurationMinutes === value && styles.chipTextActive,
                        ]}
                      >
                        {value}m
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            <Pressable style={styles.primaryButton} onPress={handleCreateActive}>
              <Text style={styles.primaryButtonText}>Create Task</Text>
            </Pressable>
          </View>
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
  newTaskCard: {
    backgroundColor: AppColors.White,
    borderRadius: 20,
    padding: 24,
    shadowColor: AppColors.Black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  taskLabel: {
    fontSize: 14,
    color: AppColors.MutedGray,
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: AppColors.TextDark,
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: AppColors.SlateGray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.White,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: AppColors.TextDark,
    borderWidth: 1,
    borderColor: AppColors.LightGray,
  },
  timeRow: {
    gap: 12,
  },
  timeInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.White,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: AppColors.LightGray,
  },
  timeInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.TextDark,
    paddingVertical: 0,
  },
  timeSuffix: {
    fontSize: 14,
    color: AppColors.MutedGray,
    marginLeft: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: AppColors.LightGray,
    backgroundColor: AppColors.White,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipActive: {
    borderColor: AppColors.TextDark,
    backgroundColor: AppColors.TextDark,
  },
  chipText: {
    fontSize: 13,
    color: AppColors.Ink,
    fontWeight: "600",
  },
  chipTextActive: {
    color: AppColors.White,
  },
  primaryButton: {
    backgroundColor: AppColors.TextDark,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: AppColors.White,
    fontSize: 18,
    fontWeight: "600",
  },
});

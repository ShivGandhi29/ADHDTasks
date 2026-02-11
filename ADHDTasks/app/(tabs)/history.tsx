import React, { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyStateTemplate from "../components/empty-state-template";
import PastCard from "../components/past-card";
import IconSymbol from "../components/ui/icon-symbol";
import {
  addTask,
  addToDoListTask,
  getActiveTask,
  getHistoryTasks,
  getTasks,
  removeHistoryTask,
  setActiveTask,
  TaskItem,
} from "../data/tasks";
import { useTheme } from "../context/ThemeContext";

const MAX_TASKS = 3;

export default function History() {
  const router = useRouter();
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { padding: 24, gap: 16 },
        contentEmpty: {
          flexGrow: 1,
          justifyContent: "center",
          paddingVertical: 48,
        },
        list: { gap: 12 },
        ctaPressable: { alignItems: "center", paddingVertical: 4 },
        ctaPressablePressed: { opacity: 0.85 },
        ctaIconWrap: { marginBottom: 0 },
        ctaHeadline: {
          fontSize: 17,
          fontWeight: "700",
          color: colors.brand,
          marginBottom: 6,
        },
      }),
    [colors]
  );
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    const existing = await getHistoryTasks();
    const sorted = [...existing].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setTasks(sorted);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
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
    const alreadyInActive = active && isSameTask(active);
    const alreadyInInactive = inactiveTasks.some(isSameTask);
    if (alreadyInActive || alreadyInInactive) {
      Alert.alert("Already in active tasks", undefined, [{ text: "OK" }]);
      return;
    }
    const totalCount = (active ? 1 : 0) + inactiveTasks.length;
    if (totalCount >= MAX_TASKS) {
      Alert.alert(
        "Too many tasks",
        "Please complete your current tasks before adding a new one.",
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

  const handleMoveToToDo = useCallback(async (item: TaskItem) => {
    const task: TaskItem = {
      id: `${Date.now()}`,
      name: item.name,
      durationMinutes: item.durationMinutes,
      createdAt: new Date().toISOString(),
    };
    await addToDoListTask(task);
    setExpandedTaskId(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          tasks.length === 0 && styles.contentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {tasks.length === 0 ? (
          <EmptyStateTemplate
            emoji={["📜", "✅"]}
            title="No history yet"
            subtitle="Completed tasks will show up here. Finish something from Now and it'll appear in history. You can add it back to your list anytime."
            ctaContent={
              <Pressable
                style={({ pressed }) => [
                  styles.ctaPressable,
                  pressed && styles.ctaPressablePressed,
                ]}
                onPress={() => router.navigate("/(tabs)/home")}
              >
                <View style={styles.ctaIconWrap}>
                  <IconSymbol
                    name="bolt.fill"
                    size={38}
                    color={colors.brand}
                  />
                </View>
                <Text style={styles.ctaHeadline}>Start a task</Text>
              </Pressable>
            }
          />
        ) : (
          <View style={styles.list}>
            {tasks.map((item) => (
              <PastCard
                key={item.id}
                label="Past Task"
                task={item.name}
                durationMinutes={item.durationMinutes}
                createdAt={item.createdAt}
                onDelete={() => handleDelete(item.id)}
                onReactivate={() => handleAddFromHistory(item)}
                onMoveToToDo={() => handleMoveToToDo(item)}
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

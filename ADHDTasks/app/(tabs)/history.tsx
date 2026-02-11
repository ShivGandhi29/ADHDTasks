import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyStateTemplate from "../components/empty-state-template";
import PastCard from "../components/past-card";
import IconSymbol from "../components/ui/icon-symbol";
import {
  addTask,
  addToDoListTask,
  getActiveTask,
  getTasks,
  setActiveTask,
  TaskItem,
} from "../data/tasks";
import {
  getHistoryTasksByGroup,
  removeHistoryTask,
  migrateHistoryToBuckets,
} from "../data/history-storage";
import { useTheme } from "../context/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getDateGroup, DATE_GROUP_HEADERS, type DateGroup } from "../utils/formatDate";

const MAX_TASKS = 3;
const SECTION_PAGE_SIZE = 5;
const TAB_BAR_HEIGHT = 56;

export default function History() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const contentBottomPadding = insets.bottom + TAB_BAR_HEIGHT + 24;
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: {
          padding: 24,
          paddingBottom: contentBottomPadding,
          gap: 16,
        },
        contentEmpty: {
          flexGrow: 1,
          justifyContent: "center",
          paddingVertical: 48,
        },
        list: { gap: 12 },
        sectionHeaderRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
          marginBottom: 8,
        },
        sectionHeaderRowFirst: { marginTop: 0 },
        sectionHeader: {
          fontSize: 13,
          fontWeight: "600",
          color: colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        },
        sectionBlock: { gap: 12 },
        showMoreRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          paddingVertical: 12,
        },
        showMoreText: {
          fontSize: 15,
          fontWeight: "600",
          color: colors.brand,
        },
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
    [colors, contentBottomPadding]
  );
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [weekVisibleCount, setWeekVisibleCount] = useState(SECTION_PAGE_SIZE);
  const [yearVisibleCount, setYearVisibleCount] = useState(SECTION_PAGE_SIZE);
  const [olderVisibleCount, setOlderVisibleCount] = useState(SECTION_PAGE_SIZE);
  const [collapsedSections, setCollapsedSections] = useState<{
    today: boolean;
    week: boolean;
    year: boolean;
    older: boolean;
  }>({ today: false, week: true, year: true, older: true });
  const [groupedTasks, setGroupedTasks] = useState<{
    today: TaskItem[];
    week: TaskItem[];
    year: TaskItem[];
    older: TaskItem[];
  }>({ today: [], week: [], year: [], older: [] });

  // Migrate old history on mount
  useFocusEffect(
    useCallback(() => {
      migrateHistoryToBuckets();
    }, []),
  );

  const loadTasks = useCallback(async () => {
    // Load each group separately for performance
    const [today, week, year, older] = await Promise.all([
      getHistoryTasksByGroup("today"),
      getHistoryTasksByGroup("week"),
      getHistoryTasksByGroup("year"),
      getHistoryTasksByGroup("older"),
    ]);

    // Sort each group (newest first)
    const sortByDate = (a: TaskItem, b: TaskItem) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    setGroupedTasks({
      today: today.sort(sortByDate),
      week: week.sort(sortByDate),
      year: year.sort(sortByDate),
      older: older.sort(sortByDate),
    });

    // Set all tasks for empty state check
    setTasks([...today, ...week, ...year, ...older]);
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

  const sections: { key: DateGroup; items: TaskItem[] }[] = [
    { key: "today", items: groupedTasks.today },
    { key: "week", items: groupedTasks.week },
    { key: "year", items: groupedTasks.year },
    { key: "older", items: groupedTasks.older },
  ];

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
            {sections.map(({ key, items }, sectionIndex) => {
              if (items.length === 0) return null;
              const isToday = key === "today";
              const visibleCount =
                key === "week"
                  ? weekVisibleCount
                  : key === "year"
                    ? yearVisibleCount
                    : key === "older"
                      ? olderVisibleCount
                      : items.length;
              const visibleItems = items.slice(0, visibleCount);
              const hasMore = items.length > visibleCount;
              const isCollapsed = collapsedSections[key];
              return (
                <View key={key} style={styles.sectionBlock}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.sectionHeaderRow,
                      sectionIndex === 0 && styles.sectionHeaderRowFirst,
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() =>
                      setCollapsedSections((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                  >
                    <Text style={styles.sectionHeader}>
                      {DATE_GROUP_HEADERS[key]}
                    </Text>
                    <MaterialIcons
                      name={isCollapsed ? "expand-more" : "expand-less"}
                      size={20}
                      color={colors.textMuted}
                    />
                  </Pressable>
                  {!isCollapsed && (
                    <>
                      {visibleItems.map((item) => (
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
                  {!isToday && hasMore && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.showMoreRow,
                        pressed && { opacity: 0.7 },
                      ]}
                      onPress={() => {
                        if (key === "week") {
                          setWeekVisibleCount((c) => c + SECTION_PAGE_SIZE);
                        } else if (key === "year") {
                          setYearVisibleCount((c) => c + SECTION_PAGE_SIZE);
                        } else if (key === "older") {
                          setOlderVisibleCount((c) => c + SECTION_PAGE_SIZE);
                        }
                      }}
                    >
                      <Text style={styles.showMoreText}>Show more</Text>
                      <MaterialIcons
                        name="expand-more"
                        size={24}
                        color={colors.brand}
                      />
                    </Pressable>
                  )}
                    </>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

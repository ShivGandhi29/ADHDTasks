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
import {
  addTask,
  getActiveTask,
  getTasks,
  getToDoListTasks,
  removeToDoListTask,
  setActiveTask,
  TaskItem,
} from "../data/tasks";
import { useTheme } from "../context/ThemeContext";
import IconSymbol from "../components/ui/icon-symbol";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getDateGroup, DATE_GROUP_HEADERS, type DateGroup } from "../utils/formatDate";

const MAX_TASKS = 3;
const SECTION_PAGE_SIZE = 5;
const TAB_BAR_HEIGHT = 56;

export default function ToDoList() {
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
        ctaPressable: { alignItems: "center", paddingVertical: 4 },
        ctaPressablePressed: { opacity: 0.85 },
        ctaIconWrap: { marginBottom: 8 },
        ctaHeadline: {
          fontSize: 17,
          fontWeight: "700",
          color: colors.brand,
          marginBottom: 6,
        },
        ctaText: { fontSize: 15, textAlign: "center" },
        ctaHighlight: { fontWeight: "700" },
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

  const loadTasks = useCallback(async () => {
    const existing = await getToDoListTasks();
    const sorted = [...existing].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setTasks(sorted);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const handleDelete = (taskId: string) => {
    Alert.alert("Delete task?", "This will remove it from Tasks.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeToDoListTask(taskId);
          loadTasks();
        },
      },
    ]);
  };

  const handleAddToCurrent = useCallback(async (item: TaskItem) => {
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
    await removeToDoListTask(item.id);
    setExpandedTaskId(null);
    loadTasks();
  }, [loadTasks]);

  const handleCardPress = useCallback((itemId: string) => {
    setExpandedTaskId((current) => (current === itemId ? null : itemId));
  }, []);

  const grouped = useMemo(() => {
    const today: TaskItem[] = [];
    const week: TaskItem[] = [];
    const year: TaskItem[] = [];
    const older: TaskItem[] = [];
    for (const item of tasks) {
      const g = getDateGroup(item.createdAt);
      if (g === "today") today.push(item);
      else if (g === "week") week.push(item);
      else if (g === "year") year.push(item);
      else older.push(item);
    }
    return { today, week, year, older };
  }, [tasks]);

  const sections: { key: DateGroup; items: TaskItem[] }[] = [
    { key: "today", items: grouped.today },
    { key: "week", items: grouped.week },
    { key: "year", items: grouped.year },
    { key: "older", items: grouped.older },
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
            emoji={["📋", "✨"]}
            title="Your back-burner is clear"
            subtitle="When you add a task and you already have 3 on your plate, it'll land here. No pressure. Add a new task from the + tab whenever you think of something."
            ctaContent={
              <Pressable
                style={({ pressed }) => [
                  styles.ctaPressable,
                  pressed && styles.ctaPressablePressed,
                ]}
                onPress={() => router.navigate("/(tabs)/newTask")}
              >
                <View style={styles.ctaIconWrap}>
                  <IconSymbol
                    name="plus"
                    size={48}
                    color={colors.brand}
                  />
                </View>
                <Text style={styles.ctaHeadline}>Add a task</Text>
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
                      label="To Do"
                      task={item.name}
                      durationMinutes={item.durationMinutes}
                      createdAt={item.createdAt}
                      onDelete={() => handleDelete(item.id)}
                      onReactivate={() => handleAddToCurrent(item)}
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


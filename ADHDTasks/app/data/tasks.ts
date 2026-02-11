import AsyncStorage from "@react-native-async-storage/async-storage";
import { syncWidgetWithTask, clearWidget } from "../utils/widget";

export type TaskItem = {
  id: string;
  name: string;
  durationMinutes: number;
  createdAt: string;
};

const TASKS_STORAGE_KEY = "tasks";
const HISTORY_STORAGE_KEY = "taskHistory";
const ACTIVE_TASK_STORAGE_KEY = "activeTask";
const TODO_LIST_STORAGE_KEY = "toDoList";

export async function getTasks(): Promise<TaskItem[]> {
  const existing = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
  if (!existing) return [];
  try {
    return JSON.parse(existing) as TaskItem[];
  } catch {
    return [];
  }
}

export async function addTask(task: TaskItem): Promise<void> {
  const tasks = await getTasks();
  tasks.push(task);
  await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

export async function removeTask(taskId: string): Promise<void> {
  const tasks = await getTasks();
  const filtered = tasks.filter((task) => task.id !== taskId);
  await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filtered));
}

// Deprecated: Use getHistoryTasksByGroup from history-storage.ts instead
// Kept for backward compatibility - delegates to new date-bucketed storage
export async function getHistoryTasks(): Promise<TaskItem[]> {
  const { getAllHistoryTasks } = await import("./history-storage");
  return getAllHistoryTasks();
}

// Deprecated: Use addHistoryTask from history-storage.ts instead
// Kept for backward compatibility - delegates to new date-bucketed storage
export async function addHistoryTask(task: TaskItem): Promise<void> {
  const { addHistoryTask: addHistoryTaskNew } = await import("./history-storage");
  await addHistoryTaskNew(task);
}

// Deprecated: Use removeHistoryTask from history-storage.ts instead
// Kept for backward compatibility - delegates to new date-bucketed storage
export async function removeHistoryTask(taskId: string): Promise<void> {
  const { removeHistoryTask: removeHistoryTaskNew } = await import("./history-storage");
  await removeHistoryTaskNew(taskId);
}

export async function getActiveTask(): Promise<TaskItem | null> {
  const existing = await AsyncStorage.getItem(ACTIVE_TASK_STORAGE_KEY);
  if (!existing) return null;
  try {
    return JSON.parse(existing) as TaskItem;
  } catch {
    return null;
  }
}

export async function setActiveTask(task: TaskItem): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_TASK_STORAGE_KEY, JSON.stringify(task));
  syncWidgetWithTask(task);
}

export async function clearActiveTask(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_TASK_STORAGE_KEY);
  clearWidget();
}

export async function getToDoListTasks(): Promise<TaskItem[]> {
  const existing = await AsyncStorage.getItem(TODO_LIST_STORAGE_KEY);
  if (!existing) return [];
  try {
    return JSON.parse(existing) as TaskItem[];
  } catch {
    return [];
  }
}

export async function addToDoListTask(task: TaskItem): Promise<void> {
  const tasks = await getToDoListTasks();
  tasks.push(task);
  await AsyncStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(tasks));
}

export async function removeToDoListTask(taskId: string): Promise<void> {
  const tasks = await getToDoListTasks();
  const filtered = tasks.filter((task) => task.id !== taskId);
  await AsyncStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(filtered));
}

export default function TasksScreen() {
  return null;
}

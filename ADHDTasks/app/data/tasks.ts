import AsyncStorage from "@react-native-async-storage/async-storage";

export type TaskItem = {
  id: string;
  name: string;
  durationMinutes: number;
  createdAt: string;
};

const TASKS_STORAGE_KEY = "tasks";
const HISTORY_STORAGE_KEY = "taskHistory";
const ACTIVE_TASK_STORAGE_KEY = "activeTask";

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

export async function getHistoryTasks(): Promise<TaskItem[]> {
  const existing = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
  if (!existing) return [];
  try {
    return JSON.parse(existing) as TaskItem[];
  } catch {
    return [];
  }
}

export async function addHistoryTask(task: TaskItem): Promise<void> {
  const tasks = await getHistoryTasks();
  tasks.push(task);
  await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(tasks));
}

export async function removeHistoryTask(taskId: string): Promise<void> {
  const tasks = await getHistoryTasks();
  const filtered = tasks.filter((task) => task.id !== taskId);
  await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
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
}

export async function clearActiveTask(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_TASK_STORAGE_KEY);
}

export default function TasksScreen() {
  return null;
}

import AsyncStorage from "@react-native-async-storage/async-storage";

export type TaskItem = {
  id: string;
  name: string;
  durationMinutes: number;
  createdAt: string;
};

const TASKS_STORAGE_KEY = "tasks";

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

export default function TasksScreen() {
  return null;
}

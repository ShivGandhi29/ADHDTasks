import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskItem } from "./tasks";

const HISTORY_KEY_PREFIX = "history_";

/**
 * Get the date bucket key for a given date string (ISO format).
 * Format: history_YYYY-MM-DD (daily buckets)
 */
function getDateBucketKey(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    // Fallback to today if invalid
    const today = new Date();
    return `${HISTORY_KEY_PREFIX}${today.toISOString().split("T")[0]}`;
  }
  return `${HISTORY_KEY_PREFIX}${date.toISOString().split("T")[0]}`;
}

/**
 * Get all date bucket keys for "Today" (just today's date).
 */
function getTodayBucketKeys(): string[] {
  const today = new Date();
  return [getDateBucketKey(today.toISOString())];
}

/**
 * Get all date bucket keys for "This Week" (last 7 days including today).
 */
function getWeekBucketKeys(): string[] {
  const keys: string[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    keys.push(getDateBucketKey(date.toISOString()));
  }
  return keys;
}

/**
 * Get date bucket keys for a given month (YYYY-MM format).
 */
function getMonthBucketKey(year: number, month: number): string {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  return `${HISTORY_KEY_PREFIX}${dateStr}`;
}

/**
 * Get all date bucket keys for "This Year" (this year but older than a week).
 */
async function getYearBucketKeys(): Promise<string[]> {
  const allKeys = await AsyncStorage.getAllKeys();
  const historyKeys = allKeys.filter((key) => key.startsWith(HISTORY_KEY_PREFIX));
  
  const yearKeys: string[] = [];
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const yearStart = new Date(today.getFullYear(), 0, 1); // January 1st of this year
  
  for (const key of historyKeys) {
    const dateStr = key.replace(HISTORY_KEY_PREFIX, "");
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      if (
        !Number.isNaN(date.getTime()) &&
        date < weekStart &&
        date >= yearStart
      ) {
        yearKeys.push(key);
      }
    }
  }
  
  return yearKeys.sort((a, b) => {
    const dateA = a.replace(HISTORY_KEY_PREFIX, "");
    const dateB = b.replace(HISTORY_KEY_PREFIX, "");
    return dateB.localeCompare(dateA);
  });
}

/**
 * Get all date bucket keys for "Older" (previous years).
 * Returns all daily keys from years before this year.
 */
async function getOlderBucketKeys(): Promise<string[]> {
  const allKeys = await AsyncStorage.getAllKeys();
  const historyKeys = allKeys.filter((key) => key.startsWith(HISTORY_KEY_PREFIX));
  
  const olderKeys: string[] = [];
  const today = new Date();
  const yearStart = new Date(today.getFullYear(), 0, 1); // January 1st of this year
  
  for (const key of historyKeys) {
    const dateStr = key.replace(HISTORY_KEY_PREFIX, "");
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      if (!Number.isNaN(date.getTime()) && date < yearStart) {
        olderKeys.push(key);
      }
    }
  }
  
  return olderKeys.sort((a, b) => {
    const dateA = a.replace(HISTORY_KEY_PREFIX, "");
    const dateB = b.replace(HISTORY_KEY_PREFIX, "");
    return dateB.localeCompare(dateA);
  });
}

/**
 * Load tasks from specific date bucket keys.
 */
async function loadTasksFromBuckets(bucketKeys: string[]): Promise<TaskItem[]> {
  const allTasks: TaskItem[] = [];
  
  for (const key of bucketKeys) {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const tasks = JSON.parse(data) as TaskItem[];
        allTasks.push(...tasks);
      }
    } catch {
      // Skip invalid buckets
    }
  }
  
  return allTasks;
}

/**
 * Get history tasks filtered by date group: "today", "week", "year", or "older".
 */
export async function getHistoryTasksByGroup(
  group: "today" | "week" | "year" | "older"
): Promise<TaskItem[]> {
  let bucketKeys: string[];
  
  if (group === "today") {
    bucketKeys = getTodayBucketKeys();
  } else if (group === "week") {
    bucketKeys = getWeekBucketKeys();
  } else if (group === "year") {
    bucketKeys = await getYearBucketKeys();
  } else {
    // For "older", we load all daily buckets from previous years
    bucketKeys = await getOlderBucketKeys();
  }
  
  return loadTasksFromBuckets(bucketKeys);
}

/**
 * Get all history tasks (for migration or full export).
 * Loads all date buckets.
 */
export async function getAllHistoryTasks(): Promise<TaskItem[]> {
  const allKeys = await AsyncStorage.getAllKeys();
  const historyKeys = allKeys.filter((key) => key.startsWith(HISTORY_KEY_PREFIX));
  return loadTasksFromBuckets(historyKeys);
}

/**
 * Add a task to history. Stores it in the appropriate date bucket based on createdAt.
 */
export async function addHistoryTask(task: TaskItem): Promise<void> {
  const bucketKey = getDateBucketKey(task.createdAt);
  const existing = await AsyncStorage.getItem(bucketKey);
  let tasks: TaskItem[] = [];
  
  if (existing) {
    try {
      tasks = JSON.parse(existing) as TaskItem[];
    } catch {
      // Start fresh if corrupted
      tasks = [];
    }
  }
  
  tasks.push(task);
  await AsyncStorage.setItem(bucketKey, JSON.stringify(tasks));
}

/**
 * Remove a task from history. Searches all buckets to find and remove it.
 */
export async function removeHistoryTask(taskId: string): Promise<void> {
  const allKeys = await AsyncStorage.getAllKeys();
  const historyKeys = allKeys.filter((key) => key.startsWith(HISTORY_KEY_PREFIX));
  
  for (const key of historyKeys) {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const tasks = JSON.parse(data) as TaskItem[];
        const filtered = tasks.filter((task) => task.id !== taskId);
        
        if (filtered.length !== tasks.length) {
          // Task was found and removed
          if (filtered.length === 0) {
            // Remove empty bucket
            await AsyncStorage.removeItem(key);
          } else {
            await AsyncStorage.setItem(key, JSON.stringify(filtered));
          }
          return; // Task found and removed, exit
        }
      }
    } catch {
      // Skip corrupted buckets
    }
  }
}

/**
 * Migrate old single-array history to date-bucketed storage.
 * Call this once on app startup if needed.
 */
export async function migrateHistoryToBuckets(): Promise<void> {
  const OLD_HISTORY_KEY = "taskHistory";
  const oldData = await AsyncStorage.getItem(OLD_HISTORY_KEY);
  
  if (!oldData) {
    // No old data to migrate
    return;
  }
  
  try {
    const oldTasks = JSON.parse(oldData) as TaskItem[];
    
    // Add each task to its date bucket
    for (const task of oldTasks) {
      await addHistoryTask(task);
    }
    
    // Remove old key after successful migration
    await AsyncStorage.removeItem(OLD_HISTORY_KEY);
  } catch {
    // Migration failed, keep old data
  }
}

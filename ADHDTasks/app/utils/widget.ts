import { NativeModules, Platform } from "react-native";
import type { TaskItem } from "../data/tasks";

// Required default export for Expo Router (file is in app/ directory)
export default function WidgetScreen() {
  return null;
}

const { WidgetBridge, TaskWidget } = NativeModules;

/**
 * Sync the active task to the native home screen widget.
 * Call this whenever the active task changes (set, update, complete, cancel).
 */
export function syncWidgetWithTask(
  task: TaskItem | null,
  options?: { isRunning?: boolean; remainingSeconds?: number }
): void {
  if (!task) {
    clearWidget();
    return;
  }

  const isRunning = options?.isRunning ?? false;
  const remaining = options?.remainingSeconds ?? task.durationMinutes * 60;

  const payload = JSON.stringify({
    name: task.name,
    durationMinutes: task.durationMinutes,
    isRunning,
    remainingSeconds: remaining,
    startedAt: isRunning ? Date.now() : null,
    endTime: isRunning ? Date.now() + remaining * 1000 : null,
  });

  if (Platform.OS === "ios") {
    if (!WidgetBridge) {
      console.warn("[Widget] WidgetBridge native module not found on iOS");
      return;
    }
    try {
      WidgetBridge.sendTextToWidget(payload);
    } catch (err) {
      console.warn("[Widget] iOS update error:", err);
    }
  } else if (Platform.OS === "android") {
    if (!TaskWidget) {
      console.warn("[Widget] TaskWidget native module not found on Android");
      return;
    }
    try {
      TaskWidget.updateWidget(payload);
    } catch (err) {
      console.warn("[Widget] Android update error:", err);
    }
  }
}

/**
 * Clear the widget (show empty/no-task state).
 */
export function clearWidget(): void {
  if (Platform.OS === "ios") {
    if (!WidgetBridge) return;
    try {
      WidgetBridge.clearWidget();
    } catch (err) {
      console.warn("[Widget] iOS clear error:", err);
    }
  } else if (Platform.OS === "android") {
    if (!TaskWidget) return;
    try {
      TaskWidget.clearWidget();
    } catch (err) {
      console.warn("[Widget] Android clear error:", err);
    }
  }
}

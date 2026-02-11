/**
 * Format an ISO date string for display (e.g. "Today at 2:30 PM", "Yesterday at 9:00 AM", "Jan 15, 2025 at 2:30 PM").
 */
export function formatCreatedAt(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const inputDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (inputDay.getTime() === today.getTime()) {
    return `Today at ${timeStr}`;
  }
  if (inputDay.getTime() === yesterday.getTime()) {
    return `Yesterday at ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
  return `${dateStr} at ${timeStr}`;
}

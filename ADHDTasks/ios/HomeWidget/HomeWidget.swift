import WidgetKit
import SwiftUI

// MARK: - Data Model

struct TaskData {
    let name: String
    let durationMinutes: Int
    let isRunning: Bool
    let remainingSeconds: Int
    let startedAt: Date?
}

// MARK: - Timeline Entry

struct TaskEntry: TimelineEntry {
    let date: Date
    let task: TaskData?
}

// MARK: - Timeline Provider

struct TaskProvider: TimelineProvider {
    let appGroup = "group.com.adhdtasks.app"

    func placeholder(in context: Context) -> TaskEntry {
        TaskEntry(
            date: Date(),
            task: TaskData(
                name: "Focus on work",
                durationMinutes: 25,
                isRunning: true,
                remainingSeconds: 1500,
                startedAt: nil
            )
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (TaskEntry) -> Void) {
        let entry = TaskEntry(date: Date(), task: loadTask())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<TaskEntry>) -> Void) {
        let task = loadTask()
        let entry = TaskEntry(date: Date(), task: task)
        // Refresh every 15 minutes, or rely on app-triggered reloads
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func loadTask() -> TaskData? {
        guard let defaults = UserDefaults(suiteName: appGroup),
              let jsonString = defaults.string(forKey: "widgetTaskData"),
              let data = jsonString.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let name = json["name"] as? String,
              let durationMinutes = json["durationMinutes"] as? Int
        else {
            return nil
        }

        let isRunning = json["isRunning"] as? Bool ?? false
        let remainingSeconds = json["remainingSeconds"] as? Int ?? (durationMinutes * 60)
        var startedAt: Date? = nil
        if let startedAtMs = json["startedAt"] as? Double {
            startedAt = Date(timeIntervalSince1970: startedAtMs / 1000.0)
        }

        return TaskData(
            name: name,
            durationMinutes: durationMinutes,
            isRunning: isRunning,
            remainingSeconds: remainingSeconds,
            startedAt: startedAt
        )
    }
}

// MARK: - Widget Views

struct TaskWidgetEntryView: View {
    var entry: TaskProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        if let task = entry.task {
            activeTaskView(task: task)
        } else {
            emptyStateView
        }
    }

    // MARK: Active Task View

    private func activeTaskView(task: TaskData) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Circle()
                    .fill(task.isRunning ? Color.green : Color.orange)
                    .frame(width: 8, height: 8)
                Text(task.isRunning ? "RUNNING" : "READY")
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(task.isRunning ? .green : .orange)
                    .tracking(0.5)
            }

            Text(task.name)
                .font(.system(size: family == .systemSmall ? 16 : 18, weight: .bold))
                .foregroundColor(.primary)
                .lineLimit(family == .systemSmall ? 2 : 3)

            Spacer()

            HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(formatDuration(task.durationMinutes))
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(.secondary)
                }
                Spacer()
                Image(systemName: task.isRunning ? "timer" : "play.circle.fill")
                    .font(.system(size: 22))
                    .foregroundColor(task.isRunning ? .green : Color(red: 0.07, green: 0.07, blue: 0.07))
            }
        }
        .padding(14)
        .containerBackground(for: .widget) {
            Color(.systemBackground)
        }
    }

    // MARK: Empty State

    private var emptyStateView: some View {
        VStack(spacing: 8) {
            Image(systemName: "checkmark.circle")
                .font(.system(size: 28))
                .foregroundColor(.secondary)

            Text("No active task")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.primary)

            Text("Tap to add one")
                .font(.system(size: 12))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(14)
        .containerBackground(for: .widget) {
            Color(.systemBackground)
        }
    }

    // MARK: Helpers

    private func formatDuration(_ minutes: Int) -> String {
        if minutes >= 60 {
            let hrs = minutes / 60
            let mins = minutes % 60
            return mins > 0 ? "\(hrs)h \(mins)m" : "\(hrs)h"
        }
        return "\(minutes) min"
    }
}

// MARK: - Widget Definition

struct ADHDTasksWidget: Widget {
    let kind: String = "ADHDTasksWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: TaskProvider()) { entry in
            TaskWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Active Task")
        .description("Shows your current focus task.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - Previews

#Preview(as: .systemSmall) {
    ADHDTasksWidget()
} timeline: {
    TaskEntry(
        date: .now,
        task: TaskData(
            name: "Write project proposal",
            durationMinutes: 25,
            isRunning: true,
            remainingSeconds: 1200,
            startedAt: nil
        )
    )
    TaskEntry(date: .now, task: nil)
}

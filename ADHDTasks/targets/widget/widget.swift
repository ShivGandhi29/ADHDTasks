import WidgetKit
import SwiftUI

// Placeholder widget target — the main widget is in HomeWidgetExtension.
// This target exists to satisfy the Xcode project configuration.

struct PlaceholderEntry: TimelineEntry {
    let date: Date
}

struct PlaceholderProvider: TimelineProvider {
    func placeholder(in context: Context) -> PlaceholderEntry {
        PlaceholderEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (PlaceholderEntry) -> Void) {
        completion(PlaceholderEntry(date: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PlaceholderEntry>) -> Void) {
        let entry = PlaceholderEntry(date: Date())
        completion(Timeline(entries: [entry], policy: .never))
    }
}

struct PlaceholderWidgetView: View {
    var entry: PlaceholderProvider.Entry

    var body: some View {
        Text("Use ADHDTasks widget")
            .font(.caption)
            .foregroundColor(.secondary)
            .containerBackground(for: .widget) {
                Color(.systemBackground)
            }
    }
}

@main
struct PlaceholderWidget: Widget {
    let kind = "widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PlaceholderProvider()) { entry in
            PlaceholderWidgetView(entry: entry)
        }
        .configurationDisplayName("ADHDTasks")
        .description("Use the Active Task widget instead.")
        .supportedFamilies([.systemSmall])
    }
}

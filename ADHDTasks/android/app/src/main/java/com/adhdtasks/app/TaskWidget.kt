package com.adhdtasks.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.SystemClock
import android.view.View
import android.widget.RemoteViews
import org.json.JSONObject

class TaskWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val prefs = context.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE)
        val jsonString = prefs.getString("widgetTaskData", null)

        appWidgetIds.forEach { widgetId ->
            val views = RemoteViews(context.packageName, R.layout.task_widget)

            if (jsonString != null) {
                try {
                    val json = JSONObject(jsonString)
                    val name = json.optString("name", "No task")
                    val durationMinutes = json.optInt("durationMinutes", 0)
                    val isRunning = json.optBoolean("isRunning", false)
                    val endTimeMs = json.optLong("endTime", 0L)

                    views.setTextViewText(R.id.tvTaskName, name)
                    views.setTextViewText(
                        R.id.tvStatus,
                        if (isRunning) "\u25CF RUNNING" else "\u25CB READY"
                    )
                    views.setTextColor(
                        R.id.tvStatus,
                        if (isRunning) 0xFF4CAF50.toInt() else 0xFFFF9800.toInt()
                    )

                    if (isRunning && endTimeMs > System.currentTimeMillis()) {
                        // Live countdown using Chronometer
                        val remainingMs = endTimeMs - System.currentTimeMillis()
                        val base = SystemClock.elapsedRealtime() + remainingMs
                        views.setChronometer(R.id.chronometer, base, null, true)
                        views.setChronometerCountDown(R.id.chronometer, true)
                        views.setViewVisibility(R.id.chronometer, View.VISIBLE)
                        views.setViewVisibility(R.id.tvDuration, View.GONE)
                    } else {
                        // Static duration
                        views.setViewVisibility(R.id.chronometer, View.GONE)
                        views.setViewVisibility(R.id.tvDuration, View.VISIBLE)
                        views.setTextViewText(R.id.tvDuration, formatDuration(durationMinutes))
                    }
                } catch (e: Exception) {
                    setEmptyState(views)
                }
            } else {
                setEmptyState(views)
            }

            // Tap anywhere to open app
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            if (launchIntent != null) {
                val pendingIntent = PendingIntent.getActivity(
                    context, 0, launchIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                views.setOnClickPendingIntent(R.id.widgetRoot, pendingIntent)
            }

            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }

    private fun setEmptyState(views: RemoteViews) {
        views.setTextViewText(R.id.tvTaskName, "No active task")
        views.setTextViewText(R.id.tvStatus, "")
        views.setViewVisibility(R.id.chronometer, View.GONE)
        views.setViewVisibility(R.id.tvDuration, View.VISIBLE)
        views.setTextViewText(R.id.tvDuration, "Tap to open app")
    }

    private fun formatDuration(minutes: Int): String {
        if (minutes <= 0) return ""
        if (minutes >= 60) {
            val hrs = minutes / 60
            val mins = minutes % 60
            return if (mins > 0) "${hrs}h ${mins}m" else "${hrs}h"
        }
        return "$minutes min"
    }
}

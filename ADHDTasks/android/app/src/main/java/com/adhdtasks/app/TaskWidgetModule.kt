package com.adhdtasks.app

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TaskWidgetModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "TaskWidget"

    @ReactMethod
    fun updateWidget(jsonString: String) {
        val prefs = reactContext.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE)
        prefs.edit().putString("widgetTaskData", jsonString).apply()
        refreshWidget()
    }

    @ReactMethod
    fun clearWidget() {
        val prefs = reactContext.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE)
        prefs.edit().remove("widgetTaskData").apply()
        refreshWidget()
    }

    private fun refreshWidget() {
        val intent = Intent(reactContext, TaskWidget::class.java).apply {
            action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        }
        val widgetManager = AppWidgetManager.getInstance(reactContext)
        val widgetComponent = ComponentName(reactContext, TaskWidget::class.java)
        val widgetIds = widgetManager.getAppWidgetIds(widgetComponent)
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, widgetIds)
        reactContext.sendBroadcast(intent)
    }
}

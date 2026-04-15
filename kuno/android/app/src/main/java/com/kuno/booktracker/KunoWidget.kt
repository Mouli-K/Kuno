package com.kuno.booktracker

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.widget.RemoteViews

class KunoWidget : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            // Preferences storage name for Capacitor
            val prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE)
            
            val title = prefs.getString("widget_title", "No book currently reading")
            val author = prefs.getString("widget_author", "Add a book to start")
            val spineColor = prefs.getString("widget_spine_color", "#6B8F71") // Default to Sage Green
            val progress = prefs.getString("widget_progress", "0")?.toIntOrNull() ?: 0

            val views = RemoteViews(context.packageName, R.layout.kuno_widget)
            
            views.setTextViewText(R.id.widget_book_title, title)
            views.setTextViewText(R.id.widget_book_author, author)
            views.setTextViewText(R.id.widget_progress_text, "$progress% complete")
            views.setProgressBar(R.id.widget_progress_bar, 100, progress, false)
            
            try {
                views.setInt(R.id.widget_spine_strip, "setBackgroundColor", Color.parseColor(spineColor))
            } catch (e: Exception) {
                views.setInt(R.id.widget_spine_strip, "setBackgroundColor", Color.parseColor("#6B8F71"))
            }

            // Open app on click
            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context, 0, intent, 
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_spine_strip, pendingIntent)
            views.setOnClickPendingIntent(R.id.widget_app_name, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}

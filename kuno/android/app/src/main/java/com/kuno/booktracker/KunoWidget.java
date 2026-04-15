package com.kuno.booktracker;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.widget.RemoteViews;

public class KunoWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Preferences storage name for Capacitor
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        
        String title = prefs.getString("widget_title", "No book currently reading");
        String author = prefs.getString("widget_author", "Add a book to start");
        String spineColor = prefs.getString("widget_spine_color", "#6B8F71");
        
        String progressStr = prefs.getString("widget_progress", "0");
        int progress = 0;
        try {
            progress = Integer.parseInt(progressStr);
        } catch (NumberFormatException e) {
            // keep 0
        }

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.kuno_widget);
        
        views.setTextViewText(R.id.widget_book_title, title);
        views.setTextViewText(R.id.widget_book_author, author);
        views.setTextViewText(R.id.widget_progress_text, progress + "% complete");
        
        // Ensure progress is within 0-100
        int finalProgress = Math.max(0, Math.min(100, progress));
        views.setProgressBar(R.id.widget_progress_bar, 100, finalProgress, false);
        
        // Robust color parsing
        int color;
        try {
            if (spineColor == null || !spineColor.startsWith("#")) {
                color = Color.parseColor("#6B8F71");
            } else {
                color = Color.parseColor(spineColor);
            }
        } catch (Exception e) {
            color = Color.parseColor("#6B8F71");
        }
        views.setInt(R.id.widget_spine_strip, "setBackgroundColor", color);

        // Open app on click - apply to root layout if possible, or multiple views
        Intent intent = new Intent(context, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context, 0, intent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);
        views.setOnClickPendingIntent(R.id.widget_spine_strip, pendingIntent);
        views.setOnClickPendingIntent(R.id.widget_app_name, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}

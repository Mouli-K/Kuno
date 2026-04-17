package com.kuno.booktracker;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

public class KunoWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.kuno_widget);

        try {
            String jsonStr = prefs.getString("widget_books_json", null);
            if (jsonStr != null && !jsonStr.isEmpty()) {
                JSONArray books = new JSONArray(jsonStr);
                
                if (books.length() > 0) {
                    // Book 1 (Main)
                    JSONObject book1 = books.getJSONObject(0);
                    updateMainBookView(views, book1);
                    
                    // Toggle divider if there are more books
                    views.setViewVisibility(R.id.widget_divider, books.length() > 1 ? View.VISIBLE : View.GONE);

                    // Book 2
                    if (books.length() > 1) {
                        updateSecondaryBookView(views, books.getJSONObject(1), R.id.widget_book_2, R.id.widget_book_title_2, R.id.widget_progress_text_2, R.id.widget_spine_2);
                    } else {
                        views.setViewVisibility(R.id.widget_book_2, View.GONE);
                    }

                    // Book 3
                    if (books.length() > 2) {
                        updateSecondaryBookView(views, books.getJSONObject(2), R.id.widget_book_3, R.id.widget_book_title_3, R.id.widget_progress_text_3, R.id.widget_spine_3);
                    } else {
                        views.setViewVisibility(R.id.widget_book_3, View.GONE);
                    }

                    // Book 4
                    if (books.length() > 3) {
                        updateSecondaryBookView(views, books.getJSONObject(3), R.id.widget_book_4, R.id.widget_book_title_4, R.id.widget_progress_text_4, R.id.widget_spine_4);
                    } else {
                        views.setViewVisibility(R.id.widget_book_4, View.GONE);
                    }
                } else {
                    showEmptyState(views);
                }
            } else {
                showEmptyState(views);
            }
        } catch (Exception e) {
            showEmptyState(views);
        }

        // Click Intent
        Intent intent = new Intent(context, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context, 0, intent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static void showEmptyState(RemoteViews views) {
        views.setTextViewText(R.id.widget_book_title, "No active journeys");
        views.setTextViewText(R.id.widget_book_author, "Pick a book to start");
        views.setProgressBar(R.id.widget_progress_bar, 100, 0, false);
        views.setTextViewText(R.id.widget_progress_text, "0% complete");
        views.setViewVisibility(R.id.widget_divider, View.GONE);
        views.setViewVisibility(R.id.widget_book_2, View.GONE);
        views.setViewVisibility(R.id.widget_book_3, View.GONE);
        views.setViewVisibility(R.id.widget_book_4, View.GONE);
    }

    private static void updateMainBookView(RemoteViews views, JSONObject book) {
        views.setTextViewText(R.id.widget_book_title, book.optString("title", "Untitled"));
        views.setTextViewText(R.id.widget_book_author, book.optString("author", "Unknown"));
        int progress = book.optInt("progress", 0);
        views.setProgressBar(R.id.widget_progress_bar, 100, progress, false);
        views.setTextViewText(R.id.widget_progress_text, progress + "% complete");
        
        String colorHex = book.optString("spineColor", "#6B8F71");
        try {
            views.setInt(R.id.widget_spine_strip, "setBackgroundColor", Color.parseColor(colorHex));
        } catch (Exception e) {
            views.setInt(R.id.widget_spine_strip, "setBackgroundColor", Color.parseColor("#6B8F71"));
        }
    }

    private static void updateSecondaryBookView(RemoteViews views, JSONObject book, int containerId, int titleId, int textId, int spineId) {
        views.setViewVisibility(containerId, View.VISIBLE);
        views.setTextViewText(titleId, book.optString("title", "Untitled"));
        int progress = book.optInt("progress", 0);
        views.setTextViewText(textId, progress + "%");
        
        String colorHex = book.optString("spineColor", "#6B8F71");
        try {
            views.setInt(spineId, "setBackgroundColor", Color.parseColor(colorHex));
        } catch (Exception e) {
            views.setInt(spineId, "setBackgroundColor", Color.parseColor("#6B8F71"));
        }
    }
}

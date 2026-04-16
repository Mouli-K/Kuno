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
                    JSONObject book1 = books.getJSONObject(0);
                    updateBookView(views, book1, R.id.widget_book_title, R.id.widget_book_author, 
                                 R.id.widget_progress_bar, R.id.widget_progress_text, R.id.widget_spine_strip);
                    
                    if (books.length() > 1) {
                        JSONObject book2 = books.getJSONObject(1);
                        views.setViewVisibility(R.id.widget_book_2, View.VISIBLE);
                        views.setTextViewText(R.id.widget_book_title_2, book2.optString("title", "Untitled"));
                        views.setTextViewText(R.id.widget_progress_text_2, book2.optInt("progress", 0) + "%");
                        
                        String spineColor2 = book2.optString("spineColor", "#C17F4A");
                        try {
                            views.setInt(R.id.widget_spine_2, "setBackgroundColor", Color.parseColor(spineColor2));
                        } catch (Exception e) {
                            views.setInt(R.id.widget_spine_2, "setBackgroundColor", Color.parseColor("#C17F4A"));
                        }
                    } else {
                        views.setViewVisibility(R.id.widget_book_2, View.GONE);
                    }
                } else {
                    showEmptyState(views);
                }
            } else {
                // Legacy fallback or empty
                String title = prefs.getString("widget_title", "No book reading");
                if (title.equals("No book currently reading")) title = "No book reading"; // shorten
                
                String author = prefs.getString("widget_author", "Add a book");
                String spineColor = prefs.getString("widget_spine_color", "#6B8F71");
                String progressStr = prefs.getString("widget_progress", "0");
                int progress = 0;
                try { progress = Integer.parseInt(progressStr); } catch (Exception e) {}

                views.setTextViewText(R.id.widget_book_title, title);
                views.setTextViewText(R.id.widget_book_author, author);
                views.setTextViewText(R.id.widget_progress_text, progress + "% complete");
                views.setProgressBar(R.id.widget_progress_bar, 100, progress, false);
                try {
                    views.setInt(R.id.widget_spine_strip, "setBackgroundColor", Color.parseColor(spineColor));
                } catch (Exception e) {
                    views.setInt(R.id.widget_spine_strip, "setBackgroundColor", Color.parseColor("#6B8F71"));
                }
                views.setViewVisibility(R.id.widget_book_2, View.GONE);
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
        views.setTextViewText(R.id.widget_book_title, "No book reading");
        views.setTextViewText(R.id.widget_book_author, "Add a book");
        views.setProgressBar(R.id.widget_progress_bar, 100, 0, false);
        views.setTextViewText(R.id.widget_progress_text, "0% complete");
        views.setViewVisibility(R.id.widget_book_2, View.GONE);
    }

    private static void updateBookView(RemoteViews views, JSONObject book, int titleId, int authorId, 
                                     int barId, int textId, int spineId) {
        views.setTextViewText(titleId, book.optString("title", "Untitled"));
        views.setTextViewText(authorId, book.optString("author", "Unknown"));
        int progress = book.optInt("progress", 0);
        views.setProgressBar(barId, 100, progress, false);
        views.setTextViewText(textId, progress + "% complete");
        
        String colorHex = book.optString("spineColor", "#6B8F71");
        try {
            views.setInt(spineId, "setBackgroundColor", Color.parseColor(colorHex));
        } catch (Exception e) {
            views.setInt(spineId, "setBackgroundColor", Color.parseColor("#6B8F71"));
        }
    }
}

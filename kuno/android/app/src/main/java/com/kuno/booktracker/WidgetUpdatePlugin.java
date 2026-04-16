package com.kuno.booktracker;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetUpdate")
public class WidgetUpdatePlugin extends Plugin {

    @PluginMethod
    public void forceUpdate(PluginCall call) {
        Context context = getContext();
        Intent intent = new Intent(context, KunoWidget.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        
        int[] ids = AppWidgetManager.getInstance(context).getAppWidgetIds(new ComponentName(context, KunoWidget.class));
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);
        
        call.resolve();
    }
}
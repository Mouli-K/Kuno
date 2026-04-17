import { useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { registerPlugin } from '@capacitor/core';

const WidgetUpdate = registerPlugin('WidgetUpdate');
const REMINDER_INTERVAL_HOURS = 4;

export const useReminder = () => {
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    if (!currentUser || !userData?.preferences) return;

    const setupNotifications = async () => {
      try {
        const perm = await LocalNotifications.checkPermissions();
        if (perm.display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }

        await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

        if (userData.preferences?.notificationsEnabled) {
          const intervalHours = userData.preferences.readingReminderIntervalHours || 4;
          
          await LocalNotifications.schedule({
            notifications: [
              {
                title: `Time to read, ${userData.displayName?.split(' ')[0]} 📖`,
                body: "Your shelf is waiting. Pick up where you left off.",
                id: 1,
                schedule: { 
                  allowPause: true,
                  repeats: true,
                  every: intervalHours === 24 ? 'day' : 'hour',
                  on: intervalHours !== 24 ? { hour: intervalHours } : undefined
                },
                sound: null,
                actionTypeId: "",
                extra: null
              }
            ]
          });
          console.log(`Scheduled reminder every ${intervalHours} hours`);
        }
      } catch (err) {
        console.error("Notification setup error:", err);
      }
    };

    setupNotifications();
  }, [currentUser, userData?.preferences?.notificationsEnabled, userData?.preferences?.readingReminderIntervalHours]);

  const recordSession = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        lastReadSessionAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error recording session: ", err);
    }
  };

  const updateWidget = async (activeBooks) => {
    if (!activeBooks) return;
    
    // If we only get one book, wrap it in an array
    const booksToUpdate = Array.isArray(activeBooks) ? activeBooks : [activeBooks];
    
    if (booksToUpdate.length === 0) return;

    try {
      // Prepare data for multiple books
      const widgetData = booksToUpdate.slice(0, 5).map(book => ({
        title: book.title || "Untitled",
        author: book.author || "Unknown",
        spineColor: book.spineColor || "#6B8F71",
        progress: Math.round(((book.progress?.pagesRead || 0) / (book.progress?.totalPages || 1)) * 100) || 0
      }));

      await Preferences.set({ 
        key: 'widget_books_json', 
        value: JSON.stringify(widgetData) 
      });

      // Maintain legacy keys for backward compatibility with single-book widget versions
      const mainBook = widgetData[0];
      await Preferences.set({ key: 'widget_title', value: mainBook.title });
      await Preferences.set({ key: 'widget_author', value: mainBook.author });
      await Preferences.set({ key: 'widget_spine_color', value: mainBook.spineColor });
      await Preferences.set({ key: 'widget_progress', value: mainBook.progress.toString() });
      
      // Force native widget to refresh
      await WidgetUpdate.forceUpdate();
    } catch (err) {
      console.warn("Widget update failed:", err);
    }
  };

  return { recordSession, updateWidget };
};
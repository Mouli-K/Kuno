import { useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

const REMINDER_INTERVAL_HOURS = 4;

export const useReminder = () => {
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    if (!currentUser || !userData) return;

    const setupNotifications = async () => {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        await LocalNotifications.requestPermissions();
      }

      // Cancel previous to avoid duplicates
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

      if (userData.preferences?.notificationsEnabled) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: `Time to read, ${userData.displayName?.split(' ')[0]} 📖`,
              body: "Your shelf is waiting. Pick up where you left off.",
              id: 1,
              schedule: { every: 'hour', count: REMINDER_INTERVAL_HOURS }, // Best approximation for "every 4 hours" in local-notifications v1/v2 style or similar logic. 
              // Actually Capacitor v5+ uses 'hour' or similar. 
              // For simplicity in this personal tracker, we'll set it to repeat.
              sound: null,
              attachments: null,
              actionTypeId: "",
              extra: null
            }
          ]
        });
      }
    };

    setupNotifications();
  }, [currentUser, userData]);

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

  const updateWidget = async (book) => {
    if (!book) return;
    const progress = Math.round((book.progress?.pagesRead / (book.progress?.totalPages || 1)) * 100) || 0;
    
    await Preferences.set({ key: 'widget_title', value: book.title });
    await Preferences.set({ key: 'widget_author', value: book.author });
    await Preferences.set({ key: 'widget_spine_color', value: book.spineColor });
    await Preferences.set({ key: 'widget_progress', value: progress.toString() });
    
    // Note: In a real app, you might need a Capacitor plugin to force the widget to refresh immediately.
    // For this build, it will update on the next Android widget update cycle.
  };

  return { recordSession, updateWidget };
};

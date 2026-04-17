import { useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useStreak = () => {
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    if (!currentUser || !userData) return;

    const checkStreak = async () => {
      const lastRead = userData.lastReadSessionAt?.toDate ? userData.lastReadSessionAt.toDate() : null;
      if (!lastRead) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastReadDate = new Date(lastRead);
      lastReadDate.setHours(0, 0, 0, 0);

      // If we already read today (or more recently), no need to check/reset
      if (lastReadDate.getTime() >= today.getTime()) return;

      const diffTime = today.getTime() - lastReadDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const userRef = doc(db, 'users', currentUser.uid);

      if (diffDays === 1) {
        // We haven't read today yet, but we read yesterday. 
        // We don't increment here; we only increment in BookDetailModal when they actually read.
        // This hook is mainly for RESETTING if they missed a day.
      } else if (diffDays > 1) {
        // Reset streak if last read was more than a day ago
        await updateDoc(userRef, {
          'stats.dayStreak': 0
        });
      }
    };

    checkStreak();
  }, [currentUser, userData?.uid]); // Only run once on login/load

  return null;
};

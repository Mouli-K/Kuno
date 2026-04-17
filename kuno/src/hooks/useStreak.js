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

      const diffTime = Math.abs(today - lastReadDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const userRef = doc(db, 'users', currentUser.uid);

      if (diffDays === 1) {
        // Increment streak if last read was yesterday
        await updateDoc(userRef, {
          'stats.dayStreak': increment(1),
          lastReadSessionAt: serverTimestamp() // Update to today
        });
      } else if (diffDays > 1) {
        // Reset streak if last read was more than a day ago
        await updateDoc(userRef, {
          'stats.dayStreak': 1,
          lastReadSessionAt: serverTimestamp()
        });
      }
    };

    checkStreak();
  }, [currentUser, userData?.uid]); // Only run once on login/load

  return null;
};

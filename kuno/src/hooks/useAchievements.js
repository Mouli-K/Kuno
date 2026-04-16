import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useAchievements = () => {
  const { currentUser, userData } = useAuth();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (!currentUser || !userData) return;

    // Derived achievements based on userData
    const list = [
      {
        id: 'pages_100',
        title: 'Centurion',
        description: 'Read 100 pages in a single book',
        isUnlocked: (userData.stats?.maxPagesInOneBook || 0) >= 100,
        progress: Math.min(100, (userData.stats?.maxPagesInOneBook || 0)),
        target: 100
      },
      {
        id: 'streak_3',
        title: 'Consistent Reader',
        description: 'Maintain a 3-day reading streak',
        isUnlocked: (userData.stats?.dayStreak || 0) >= 3,
        progress: Math.min(100, Math.round(((userData.stats?.dayStreak || 0) / 3) * 100)),
        target: 3
      },
      {
        id: 'finished_5',
        title: 'High Five',
        description: 'Finish 5 books',
        isUnlocked: (userData.stats?.totalRead || 0) >= 5,
        progress: Math.min(100, Math.round(((userData.stats?.totalRead || 0) / 5) * 100)),
        target: 5
      }
    ];

    setAchievements(list);
  }, [userData]);

  return { achievements };
};

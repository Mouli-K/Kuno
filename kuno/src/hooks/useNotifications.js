import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const notifsRef = collection(db, 'users', currentUser.uid, 'notifications');
    const q = query(notifsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notifications: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  return { notifications, loading };
};

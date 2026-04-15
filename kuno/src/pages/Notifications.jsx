import React from 'react';
import { motion } from 'framer-motion';
import { Bell, BookOpen, Star, Trophy, CircleNotch } from '@phosphor-icons/react';
import { useNotifications } from '../hooks/useNotifications';
import { db } from '../config/firebase';
import { doc, updateDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { notifications, loading } = useNotifications();
  const { currentUser } = useAuth();

  const markAllRead = async () => {
    if (!currentUser) return;
    const batch = writeBatch(db);
    notifications.forEach(notif => {
      if (!notif.isRead) {
        const notifRef = doc(db, 'users', currentUser.uid, 'notifications', notif.id);
        batch.update(notifRef, { isRead: true });
      }
    });
    await batch.commit();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'reading_reminder': return <BookOpen size={24} className="text-warm-accent" />;
      case 'milestone': return <Trophy size={24} className="text-warm-green" />;
      case 'custom': return <Star size={24} className="text-warm-blue" />;
      default: return <Bell size={24} className="text-warm-muted" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-warm-muted">
        <CircleNotch size={48} className="animate-spin mb-4" />
        <p className="font-serif italic text-lg">Listening for whispers...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 space-y-6 pb-32"
    >
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-warm-muted">Recent</h3>
        {notifications.some(n => !n.isRead) && (
          <button onClick={markAllRead} className="text-[10px] font-bold uppercase text-warm-accent">Mark all read</button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            className={`p-5 rounded-3xl border transition-all flex gap-4 ${
              notif.isRead 
                ? 'bg-white/40 dark:bg-dark-surface/40 border-warm-border/5' 
                : 'bg-white dark:bg-dark-surface border-warm-border/10 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-warm-surface dark:bg-dark-bg flex items-center justify-center flex-shrink-0">
              {getIcon(notif.type)}
            </div>
            <div className="flex-grow space-y-1">
              <div className="flex justify-between items-start">
                <p className={`text-sm leading-snug ${notif.isRead ? 'text-warm-muted dark:text-dark-muted' : 'text-warm-text dark:text-dark-text font-medium'}`}>
                  {notif.message}
                </p>
                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-warm-accent flex-shrink-0 mt-1"></div>}
              </div>
              <p className="text-[10px] font-bold uppercase text-warm-muted/50">
                {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleDateString() : 'Just now'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center opacity-40">
          <Bell size={64} className="mb-4 text-warm-muted" />
          <p className="font-serif italic text-xl">All caught up!</p>
          <p className="text-sm mt-2">You have no new notifications.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SignOut, Bell, CaretRight, User as UserIcon, Check, X, PencilSimple, Books, CircleNotch, Star } from '@phosphor-icons/react';
import * as PhosphorIcons from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../hooks/useBooks';
import AvatarSelector from '../components/ui/AvatarSelector';
import BookDetailModal from '../components/modals/BookDetailModal';
import FallbackIcon from '../components/ui/FallbackIcon';

const BooksOfMe = ({ isOpen, onClose, books }) => {
  const finishedBooks = books.filter(b => b.status === 'read');
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[110] flex flex-col bg-warm-bg dark:bg-dark-bg"
        >
          <header className="p-6 flex justify-between items-center border-b border-warm-border/10">
            <button onClick={onClose} className="p-3 bg-warm-muted/10 rounded-full">
              <X size={20} weight="bold" />
            </button>
            <h2 className="text-xl font-serif font-black italic text-warm-text dark:text-dark-text">Books of Me</h2>
            <div className="w-10" />
          </header>

          <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
            {finishedBooks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                <Books size={64} weight="duotone" />
                <p className="font-serif italic text-xl">Your legacy is just beginning...</p>
                <p className="text-sm">Finish your first book to see it here.</p>
              </div>
            ) : (
              finishedBooks.map((book) => (
                <button 
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="w-full p-5 bg-white dark:bg-dark-surface rounded-[2rem] flex items-center gap-5 border border-warm-border/5 shadow-sm text-left active:scale-[0.98] transition-transform"
                >
                  <div className="w-14 h-20 bg-warm-surface rounded-xl flex items-center justify-center shrink-0 shadow-md" style={{ backgroundColor: book.spineColor + '33' }}>
                    <FallbackIcon seed={book.title} size={32} color={book.spineColor} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-serif font-black text-lg text-warm-text dark:text-dark-text truncate leading-tight uppercase tracking-tight">{book.title}</h4>
                    <p className="text-[10px] font-black uppercase text-warm-muted tracking-widest mt-1 opacity-60">{book.author}</p>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={12} weight={s <= (book.rating || 0) ? 'fill' : 'regular'} className="text-warm-accent" />
                      ))}
                    </div>
                  </div>
                  <CaretRight size={20} className="text-warm-muted/20" />
                </button>
              ))
            )}
          </div>

          <AnimatePresence>
            {selectedBook && (
              <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NotificationModal = ({ isOpen, onClose, notificationsEnabled, toggleNotifications }) => {
  const [selectedFreq, setSelectedFreq] = useState('4h');
  const frequencies = [
    { id: '4h', label: 'Every 4 Hours', sub: 'Gentle nudges to keep you reading' },
    { id: '8h', label: 'Every 8 Hours', sub: 'Perfect for morning and evening readers' },
    { id: 'daily', label: 'Once Per Day', sub: 'A daily reminder of your journey' },
    { id: 'off', label: 'Notifications Off', sub: 'Manual tracking only' }
  ];

  const handleFreqSelect = (id) => {
    setSelectedFreq(id);
    if (id === 'off' && notificationsEnabled) {
      toggleNotifications();
    } else if (id !== 'off' && !notificationsEnabled) {
      toggleNotifications();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-warm-bg dark:bg-dark-bg rounded-[3rem] p-8 shadow-2xl z-10 space-y-8"
          >
            <div className="flex justify-between items-center">
               <h4 className="text-xl font-serif font-black text-warm-text dark:text-dark-text tracking-tight">Notification Rhythm</h4>
               <button onClick={onClose} className="p-2 bg-warm-muted/10 rounded-full hover:scale-110 transition-transform"><X size={18} weight="bold" /></button>
            </div>
            
            <div className="space-y-3">
              {frequencies.map((freq) => (
                <button 
                  key={freq.id}
                  onClick={() => handleFreqSelect(freq.id)}
                  className={`w-full p-5 rounded-[1.5rem] flex items-center justify-between border transition-all duration-300 ${
                    (freq.id === 'off' ? !notificationsEnabled : (selectedFreq === freq.id && notificationsEnabled))
                    ? 'bg-warm-accent border-warm-accent shadow-lg shadow-warm-accent/20' 
                    : 'bg-white/40 dark:bg-dark-surface/40 border-warm-border/10 dark:border-white/5'
                  }`}
                >
                  <div className="text-left">
                    <p className={`text-xs font-black uppercase tracking-widest ${(freq.id === 'off' ? !notificationsEnabled : (selectedFreq === freq.id && notificationsEnabled)) ? 'text-white' : 'text-warm-text dark:text-dark-text'}`}>{freq.label}</p>
                    <p className={`text-[9px] mt-1 font-medium ${(freq.id === 'off' ? !notificationsEnabled : (selectedFreq === freq.id && notificationsEnabled)) ? 'text-white/80' : 'text-warm-muted opacity-60'}`}>{freq.sub}</p>
                  </div>
                  {(freq.id === 'off' ? !notificationsEnabled : (selectedFreq === freq.id && notificationsEnabled)) && <Check size={20} weight="bold" className="text-white" />}
                </button>
              ))}
            </div>
            
            <button 
              onClick={onClose}
              className="w-full py-5 bg-warm-text dark:bg-dark-surface text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl hover:translate-y-[-2px] transition-all"
            >
              Update Preferences
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Profile = ({ notificationsEnabled, toggleNotifications }) => {
  const { userData, logout, loading: authLoading } = useAuth();
  const { books, loading: booksLoading } = useBooks();
  const navigate = useNavigate();
  
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showBooksOfMe, setShowBooksOfMe] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(userData?.avatarIcon || 'User');

  const AvatarIcon = PhosphorIcons[currentIcon] || PhosphorIcons.User;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Failed to logout: ", err);
    }
  };

  if (authLoading || booksLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-warm-muted">
        <CircleNotch size={48} className="animate-spin mb-4" />
        <p className="font-serif italic text-lg">Polishing the mirror...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 space-y-8 pb-32"
    >
      <NotificationModal 
        isOpen={showNotifModal} 
        onClose={() => setShowNotifModal(false)} 
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={toggleNotifications}
      />

      <BooksOfMe isOpen={showBooksOfMe} onClose={() => setShowBooksOfMe(false)} books={books} />

      {/* User Header */}
      <div className="flex flex-col items-center pt-8 space-y-6">
        <div className="relative group">
          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-warm-accent to-warm-green flex items-center justify-center border-[6px] border-white dark:border-dark-surface shadow-2xl overflow-hidden transform group-hover:rotate-6 transition-transform duration-500">
            <AvatarIcon size={48} weight="fill" className="text-white" />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <button 
            onClick={() => setShowAvatarSelector(!showAvatarSelector)}
            className="absolute -bottom-2 -right-2 bg-warm-accent text-white p-2.5 rounded-2xl shadow-lg border-4 border-white dark:border-dark-surface hover:scale-110 active:scale-90 transition-all"
          >
            <PencilSimple size={16} weight="bold" />
          </button>
        </div>
        
        <AnimatePresence>
          {showAvatarSelector && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <AvatarSelector 
                selectedIcon={currentIcon} 
                onSelect={(icon) => {
                  setCurrentIcon(icon);
                  // In a real app, update userData in Firestore here
                  setShowAvatarSelector(false);
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-warm-text dark:text-dark-text tracking-tight">{userData?.displayName}</h2>
          <p className="text-sm font-medium text-warm-muted dark:text-dark-muted opacity-80 uppercase tracking-[0.15em] mt-1">{userData?.email}</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-white/5 shadow-xl grid grid-cols-3 gap-8 text-center">
        <div className="space-y-1">
          <p className="text-2xl font-black text-warm-accent font-serif">{userData?.stats?.totalRead || 0}</p>
          <p className="text-[10px] uppercase font-black tracking-widest text-warm-muted/60">Finished</p>
        </div>
        <div className="space-y-1 border-x border-warm-border/20 dark:border-white/10">
          <p className="text-2xl font-black text-warm-accent font-serif">{userData?.stats?.currentlyReading || 0}</p>
          <p className="text-[10px] uppercase font-black tracking-widest text-warm-muted/60">Reading</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-black text-warm-accent font-serif">
            {books.filter(b => b.rating).length > 0 
              ? (books.reduce((acc, b) => acc + (b.rating || 0), 0) / books.filter(b => b.rating).length).toFixed(1)
              : '0.0'}
          </p>
          <p className="text-[10px] uppercase font-black tracking-widest text-warm-muted/60">Rating</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60 ml-4">Account Sanctuary</h3>
        
        <div className="space-y-3">
          {[
            { icon: <Books size={22} />, label: 'Books of Me', color: 'bg-warm-accent/10 text-warm-accent', action: () => setShowBooksOfMe(true) },
            { icon: <UserIcon size={22} />, label: 'Personal Details', color: 'bg-warm-accent/10 text-warm-accent' },
            { icon: <Bell size={22} />, label: 'Notification Settings', color: 'bg-warm-rose/10 text-warm-rose', action: () => setShowNotifModal(true) },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={item.action}
              className="w-full p-5 bg-white dark:bg-dark-surface rounded-[2rem] flex items-center justify-between border border-warm-border/5 shadow-sm hover:translate-x-2 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="font-bold text-warm-text dark:text-dark-text">{item.label}</span>
              </div>
              <CaretRight size={20} className="text-warm-muted/30" />
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="w-full p-6 bg-warm-rose/10 hover:bg-warm-rose/20 rounded-[2.5rem] flex items-center justify-center gap-3 text-warm-rose font-black uppercase tracking-widest transition-all duration-300 shadow-sm mt-8 active:scale-95"
        >
          <SignOut size={22} weight="bold" />
          Sign Out
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;

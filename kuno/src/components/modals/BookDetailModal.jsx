import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, PencilSimple, Trash, ShoppingCart, Plus, Minus, BookOpen, Quotes, ArrowRight, AmazonLogo, Bag, CheckCircle, CircleNotch } from '@phosphor-icons/react';
import { db } from '../../config/firebase';
import { doc, updateDoc, increment, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useReminder } from '../../hooks/useReminder';
import { useNotifications } from '../../hooks/useNotifications';
import ProgressBar from '../ui/ProgressBar';
import FallbackIcon from '../ui/FallbackIcon';
import { Dialog } from '@capacitor/dialog';

const GenreChip = ({ label }) => (
  <span className="px-3 py-1 bg-warm-surface dark:bg-dark-surface border border-warm-border/10 rounded-lg text-[10px] font-sans font-bold uppercase tracking-widest text-warm-muted dark:text-dark-muted shadow-sm">
    {label}
  </span>
);

const StatusBadge = ({ status }) => {
  const configs = {
    'reading': { label: 'Reading Now', color: 'bg-warm-green text-white' },
    'read': { label: 'Finished', color: 'bg-warm-blue text-white' },
    'bought_not_started': { label: 'Unread', color: 'bg-warm-accent text-white' },
    'want_to_buy': { label: 'Wishlist', color: 'bg-warm-rose text-white' },
    'archive': { label: 'Not for Me', color: 'bg-warm-muted text-white opacity-60' }
  };
  const config = configs[status] || configs.reading;
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-sans font-black uppercase tracking-[0.2em] shadow-lg ${config.color}`}>
      {config.label}
    </span>
  );
};

const BookDetailModal = ({ book, onClose }) => {
  if (!book) return null;

  const { currentUser, userData } = useAuth();
  const { recordSession, updateWidget } = useReminder();
  const { createNotification } = useNotifications();
  
  const currentPagesRead = book?.progress?.pagesRead || 0;
  const totalPages = Math.max(1, book?.progress?.totalPages || 0);
  
  const [pagesRead, setPagesRead] = useState(currentPagesRead);
  const [updating, setUpdating] = useState(false);
  const progress = Math.min(100, Math.max(0, Math.round((pagesRead / totalPages) * 100) || 0));

  // Sync internal state with prop for live updates
  React.useEffect(() => {
    setPagesRead(book?.progress?.pagesRead || 0);
  }, [book?.progress?.pagesRead]);

  React.useEffect(() => {
    if (book && book.id) {
      recordSession();
      updateWidget(book);
    }
  }, [book?.id]);

  const updatePagesInFirestore = async (newPages) => {
    if (!currentUser || !book?.id) return;
    try {
      setUpdating(true);
      const bookRef = doc(db, 'users', currentUser.uid, 'books', book.id);
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Check for milestones
      if (newPages >= 100 && currentPagesRead < 100) {
        await createNotification(`Milestone! You've read 100 pages of "${book.title}". Keep it up!`, 'milestone');
      } else if (newPages >= 50 && currentPagesRead < 50) {
        await createNotification(`Halfway to a hundred! 50 pages read in "${book.title}".`, 'milestone');
      }

      await updateDoc(bookRef, {
        'progress.pagesRead': newPages,
        'progress.percentComplete': Math.round((newPages / totalPages) * 100),
        'lastUpdated': serverTimestamp()
      });

      // Update user stats for achievements
      if (newPages > (userData?.stats?.maxPagesInOneBook || 0)) {
        await updateDoc(userRef, {
          'stats.maxPagesInOneBook': newPages
        });
      }

      setPagesRead(newPages);
      updateWidget({ ...book, progress: { ...book.progress, pagesRead: newPages } });
    } catch (err) {
      console.error("Error updating pages: ", err);
    } finally {
      setUpdating(false);
    }
  };

  const changeStatus = async (newStatus) => {
    if (!currentUser) return;
    try {
      setUpdating(true);
      const bookRef = doc(db, 'users', currentUser.uid, 'books', book.id);
      const userRef = doc(db, 'users', currentUser.uid);

      const oldStatusStat = {
        'reading': 'currentlyReading',
        'read': 'totalRead',
        'bought_not_started': 'boughtNotStarted',
        'want_to_buy': 'wantToBuy',
        'archive': null
      }[book.status];

      const newStatusStat = {
        'reading': 'currentlyReading',
        'read': 'totalRead',
        'bought_not_started': 'boughtNotStarted',
        'want_to_buy': 'wantToBuy',
        'archive': null
      }[newStatus];

      const updateData = {
        status: newStatus,
        lastUpdated: serverTimestamp()
      };

      if (newStatus === 'read') {
        updateData.dateFinished = serverTimestamp();
        updateData['progress.pagesRead'] = book.progress?.totalPages || 0;
        updateData['progress.percentComplete'] = 100;
      }

      if (newStatus === 'reading' && !book.dateStarted) {
        updateData.dateStarted = serverTimestamp();
      }

      await updateDoc(bookRef, updateData);

      const statsUpdate = {};
      if (oldStatusStat) statsUpdate[`stats.${oldStatusStat}`] = increment(-1);
      if (newStatusStat) statsUpdate[`stats.${newStatusStat}`] = increment(1);
      
      if (Object.keys(statsUpdate).length > 0) {
        await updateDoc(userRef, statsUpdate);
      }

      onClose();
    } catch (err) {
      console.error("Error changing status: ", err);
    } finally {
      setUpdating(false);
    }
  };

  const removeBook = async () => {
    if (!currentUser) return;
    
    const { value } = await Dialog.confirm({
      title: 'Remove Book',
      message: 'Are you sure you want to remove this book from your sanctuary?',
      okButtonTitle: 'Remove',
      cancelButtonTitle: 'Keep it'
    });

    if (!value) return;

    try {
      setUpdating(true);
      const bookRef = doc(db, 'users', currentUser.uid, 'books', book.id);
      const userRef = doc(db, 'users', currentUser.uid);

      const statusStat = {
        'reading': 'currentlyReading',
        'read': 'totalRead',
        'bought_not_started': 'boughtNotStarted',
        'want_to_buy': 'wantToBuy',
        'archive': null
      }[book.status];

      await deleteDoc(bookRef);

      if (statusStat) {
        await updateDoc(userRef, {
          [`stats.${statusStat}`]: increment(-1)
        });
      }

      onClose();
    } catch (err) {
      console.error("Error removing book: ", err);
    } finally {
      setUpdating(false);
    }
  };

  const isAmazonLink = book.purchaseLink?.includes('amazon');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-warm-bg dark:bg-dark-bg rounded-[2.5rem] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
      >
        <div className="absolute top-6 right-6 z-20">
          <button onClick={onClose} className="p-2 bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-full hover:scale-110 transition-transform shadow-lg">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="flex h-full overflow-y-auto no-scrollbar">
          <div className="w-4 flex-shrink-0 h-full opacity-40" style={{ backgroundColor: book.spineColor || '#6B8F71' }}></div>
          
          <div className="flex-grow p-8 space-y-8">
            <div className="flex flex-col gap-6 items-center text-center">
              <div 
                className="w-28 h-40 rounded-xl shadow-2xl flex-shrink-0 overflow-hidden relative group transform hover:rotate-1 transition-transform duration-500 bg-warm-surface flex items-center justify-center p-4"
                style={{ backgroundColor: book.spineColor || '#6B8F71' }}
              >
                <FallbackIcon seed={book.title || 'Book'} size={48} color="white" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
              </div>
              
              <div className="space-y-3">
                <StatusBadge status={book.status} />
                <div>
                  <h2 className="text-2xl font-serif font-black text-warm-text dark:text-dark-text leading-tight tracking-tight">
                    {book.title || 'Untitled'}
                  </h2>
                  <p className="text-xs font-black text-warm-muted dark:text-dark-muted mt-1 uppercase tracking-[0.15em] opacity-70">
                    {book.author || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {updating && (
              <div className="flex items-center justify-center py-2 text-warm-accent gap-2">
                <CircleNotch className="animate-spin" size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest">Syncing library...</span>
              </div>
            )}

            {book.status === 'reading' && (
              <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm p-6 rounded-[2rem] border border-white dark:border-white/5 shadow-sm space-y-6">
                <ProgressBar progress={progress} />
                
                <div className="flex items-center justify-between gap-4">
                  <button 
                    onClick={() => updatePagesInFirestore(Math.max(0, pagesRead - 10))}
                    disabled={updating}
                    className="p-2.5 bg-warm-accent/10 text-warm-accent rounded-xl active:scale-90 transition-all disabled:opacity-50"
                  >
                    <Minus size={16} weight="bold" />
                  </button>
                  
                  <div className="text-center flex-grow">
                    <span className="text-xl font-black text-warm-text dark:text-dark-text font-serif">{pagesRead}</span>
                    <span className="text-xs text-warm-muted font-bold mx-1.5 opacity-40">/</span>
                    <span className="text-xs text-warm-muted font-black uppercase tracking-widest">{book.progress?.totalPages}</span>
                  </div>

                  <button 
                    onClick={() => updatePagesInFirestore(Math.min(book.progress?.totalPages || 0, pagesRead + 10))}
                    disabled={updating}
                    className="p-2.5 bg-warm-accent/10 text-warm-accent rounded-xl active:scale-90 transition-all disabled:opacity-50"
                  >
                    <Plus size={16} weight="bold" />
                  </button>
                </div>

                <div className="pt-4 border-t border-warm-border/5 grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => changeStatus('read')}
                     className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                       progress >= 90 
                       ? 'bg-warm-green text-white shadow-lg shadow-warm-green/20' 
                       : 'bg-warm-muted/10 text-warm-muted opacity-50'
                     }`}
                     disabled={updating || progress < 90}
                   >
                     <CheckCircle size={16} />
                     Finish
                   </button>

                   <button 
                     onClick={() => changeStatus('archive')}
                     disabled={updating}
                     className="py-3 bg-warm-rose/10 text-warm-rose rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-warm-rose/20 transition-all disabled:opacity-50"
                   >
                     <Trash size={16} />
                     Archive
                   </button>
                </div>
              </div>
            )}

            {book.status === 'bought_not_started' && (
              <div className="bg-white/40 dark:bg-dark-surface/40 p-6 rounded-[2rem] border border-white dark:border-white/5 shadow-sm">
                 <button 
                  className="w-full py-4 bg-warm-green text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-lg shadow-warm-green/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  onClick={() => changeStatus('reading')}
                  disabled={updating}
                >
                  <BookOpen size={20} weight="fill" />
                  Start Reading
                </button>
              </div>
            )}

            {book.status === 'want_to_buy' && (
              <div className="space-y-4 bg-warm-rose/5 p-6 rounded-[2rem] border border-warm-rose/10">
                <div className="flex justify-between items-center">
                   <div>
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] text-warm-rose opacity-60">Price</p>
                     <p className="text-2xl font-serif font-black text-warm-text dark:text-dark-text">₹{book.price || '599'}</p>
                   </div>
                   {book.purchaseLink && (
                     <a 
                       href={book.purchaseLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className={`p-3 rounded-xl flex items-center gap-2 font-black uppercase tracking-widest text-[9px] transition-all hover:scale-105 active:scale-95 shadow-md ${
                         isAmazonLink ? 'bg-black text-white' : 'bg-[#F3AE02] text-black'
                       }`}
                     >
                       {isAmazonLink ? <AmazonLogo size={16} /> : <Bag size={16} weight="fill" />}
                       Buy
                     </a>
                   )}
                </div>
                
                <button 
                  className="w-full py-4 bg-warm-accent text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 shadow-lg shadow-warm-accent/20 hover:translate-y-[-1px] transition-all disabled:opacity-50"
                  onClick={() => changeStatus('bought_not_started')}
                  disabled={updating}
                >
                  <ShoppingCart size={16} weight="bold" />
                  Mark as Bought
                </button>
              </div>
            )}

            {book.status === 'archive' && (
              <div className="bg-black/5 dark:bg-white/5 p-6 rounded-[2rem] border border-black/10 dark:border-white/10 shadow-sm space-y-4">
                <p className="text-center text-[10px] font-medium text-warm-muted italic opacity-80 px-4">"Sometimes the right book just needs the right time."</p>
                 <button 
                  className="w-full py-4 bg-warm-text dark:bg-dark-surface text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 shadow-lg hover:translate-y-[-1px] active:translate-y-0 transition-all disabled:opacity-50"
                  onClick={() => changeStatus('reading')}
                  disabled={updating}
                >
                  <ArrowRight size={16} weight="bold" />
                  Give it another chance
                </button>
              </div>
            )}

            {book.status === 'read' && (
              <div className="space-y-4 bg-warm-accent/5 p-6 rounded-[2rem] border border-warm-accent/10">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Star size={16} weight="fill" className="text-warm-accent" />
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-warm-accent">Literary Review</h4>
                </div>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={20} 
                      weight={star <= (book.rating || 0) ? 'fill' : 'regular'} 
                      className={star <= (book.rating || 0) ? 'text-warm-accent' : 'text-warm-muted/20'}
                    />
                  ))}
                </div>
                {book.notes && (
                  <div className="relative mt-2">
                    <p className="text-[11px] italic text-warm-text/70 dark:text-dark-text/70 leading-relaxed text-center px-2">
                      "{book.notes}"
                    </p>
                  </div>
                )}
                <button 
                  className="w-full py-3 mt-2 bg-warm-accent/10 text-warm-accent rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2 hover:bg-warm-accent/20 transition-all"
                  onClick={() => changeStatus('reading')}
                  disabled={updating}
                >
                  <ArrowRight size={14} weight="bold" />
                  Read again
                </button>
              </div>
            )}

            <div className="pt-2">
              <button 
                onClick={removeBook}
                disabled={updating}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/50 dark:bg-dark-surface/50 rounded-xl font-black uppercase tracking-widest text-[9px] text-warm-muted hover:text-warm-rose transition-all disabled:opacity-50"
              >
                <Trash size={16} weight="bold" />
                Remove from Sanctuary
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDetailModal;
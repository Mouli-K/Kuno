import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, PencilSimple, Trash, ShoppingCart, Plus, Minus, BookOpen, Quotes, ArrowRight, AmazonLogo, Bag, CheckCircle, CircleNotch } from '@phosphor-icons/react';
import { db } from '../../config/firebase';
import { doc, updateDoc, increment, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useReminder } from '../../hooks/useReminder';
import ProgressBar from '../ui/ProgressBar';
import FallbackIcon from '../ui/FallbackIcon';

// ... (GenreChip and StatusBadge stay the same)

const BookDetailModal = ({ book, onClose }) => {
  const { currentUser } = useAuth();
  const { recordSession, updateWidget } = useReminder();
  const [pagesRead, setPagesRead] = useState(book.progress?.pagesRead || 0);
  const [updating, setUpdating] = useState(false);
  const progress = Math.round((pagesRead / (book.progress?.totalPages || 1)) * 100);

  React.useEffect(() => {
    recordSession();
    updateWidget(book);
  }, []);

  const updatePagesInFirestore = async (newPages) => {
    if (!currentUser) return;
    try {
      setUpdating(true);
      const bookRef = doc(db, 'users', currentUser.uid, 'books', book.id);
      await updateDoc(bookRef, {
        'progress.pagesRead': newPages,
        'progress.percentComplete': Math.round((newPages / (book.progress?.totalPages || 1)) * 100),
        'lastUpdated': serverTimestamp()
      });
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

      // Update user stats
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
    if (!window.confirm("Are you sure you want to remove this book from your sanctuary?")) return;

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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div
        layoutId={`book-${book.id}`}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative w-full max-w-lg bg-warm-bg dark:bg-dark-bg rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]"
      >
        <div className="absolute top-8 right-8 z-20">
          <button onClick={onClose} className="p-3 bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-full hover:scale-110 transition-transform shadow-lg">
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="flex h-full overflow-y-auto no-scrollbar">
          {/* Decorative Side Strip */}
          <div className="w-6 flex-shrink-0 h-full opacity-40" style={{ backgroundColor: book.spineColor }}></div>
          
          <div className="flex-grow p-10 space-y-10">
            {/* Header: Cover & Info */}
            <div className="flex flex-col sm:flex-row gap-10 items-start">
              <div 
                className="w-36 h-52 rounded-2xl shadow-2xl flex-shrink-0 overflow-hidden relative group transform hover:rotate-2 transition-transform duration-500 bg-warm-surface flex items-center justify-center p-6"
                style={{ backgroundColor: book.spineColor }}
              >
                <FallbackIcon seed={book.title} size={64} color="white" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
              </div>
              
              <div className="space-y-5">
                <StatusBadge status={book.status} />
                <div>
                  <h2 className="text-3xl font-serif font-black text-warm-text dark:text-dark-text leading-[1.1] tracking-tight">
                    {book.title}
                  </h2>
                  <p className="text-lg font-medium text-warm-muted dark:text-dark-muted mt-2 uppercase tracking-[0.1em] text-xs opacity-70">
                    {book.author}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(book.genre) ? (
                    book.genre.map(g => <GenreChip key={g} label={g} />)
                  ) : (
                    <GenreChip label={book.genre} />
                  )}
                  <GenreChip label={book.category} />
                </div>
              </div>
            </div>

            {updating && (
              <div className="flex items-center justify-center py-4 text-warm-accent gap-2">
                <CircleNotch className="animate-spin" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Syncing with library...</span>
              </div>
            )}

            {/* Progress Interactive Section */}
            {book.status === 'reading' && (
              <div className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white dark:border-white/5 shadow-xl space-y-8">
                <ProgressBar progress={progress} />
                
                <div className="flex items-center justify-between gap-6">
                  <button 
                    onClick={() => updatePagesInFirestore(Math.max(0, pagesRead - 10))}
                    disabled={updating}
                    className="p-3 bg-warm-accent/10 text-warm-accent rounded-2xl active:scale-90 transition-all disabled:opacity-50"
                  >
                    <Minus size={20} weight="bold" />
                  </button>
                  
                  <div className="text-center flex-grow">
                    <span className="text-2xl font-black text-warm-text dark:text-dark-text font-serif">{pagesRead}</span>
                    <span className="text-sm text-warm-muted font-bold mx-2 opacity-40">/</span>
                    <span className="text-sm text-warm-muted font-black uppercase tracking-widest">{book.progress?.totalPages}</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-muted/50 mt-1">Pages Read</p>
                  </div>

                  <button 
                    onClick={() => updatePagesInFirestore(Math.min(book.progress?.totalPages || 0, pagesRead + 10))}
                    disabled={updating}
                    className="p-3 bg-warm-accent/10 text-warm-accent rounded-2xl active:scale-90 transition-all disabled:opacity-50"
                  >
                    <Plus size={20} weight="bold" />
                  </button>
                </div>

                <div className="pt-6 border-t border-warm-border/10 grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => changeStatus('read')}
                     className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                       progress >= 90 
                       ? 'bg-warm-green text-white shadow-lg shadow-warm-green/20' 
                       : 'bg-warm-muted/10 text-warm-muted opacity-50'
                     }`}
                     disabled={updating || progress < 90}
                   >
                     <CheckCircle size={18} />
                     Finish
                   </button>

                   <button 
                     onClick={() => changeStatus('archive')}
                     disabled={updating}
                     className="py-4 bg-warm-rose/10 text-warm-rose rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-warm-rose/20 transition-all disabled:opacity-50"
                   >
                     <Trash size={18} />
                     Not for me
                   </button>
                </div>
              </div>
            )}

            {/* Unread Section Logic */}
            {book.status === 'bought_not_started' && (
              <div className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white dark:border-white/5 shadow-xl space-y-6">
                 <button 
                  className="w-full py-6 bg-warm-green text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-xl shadow-warm-green/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  onClick={() => changeStatus('reading')}
                  disabled={updating}
                >
                  <BookOpen size={24} weight="fill" />
                  Start Reading
                </button>
              </div>
            )}

            {/* Wishlist Special View */}
            {book.status === 'want_to_buy' && (
              <div className="space-y-6 bg-warm-rose/5 p-8 rounded-[2.5rem] border border-warm-rose/10 shadow-sm">
                <div className="flex justify-between items-center">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-rose opacity-60">Estimated Price</p>
                     <p className="text-3xl font-serif font-black text-warm-text dark:text-dark-text mt-1">₹{book.price || '599'}</p>
                   </div>
                   {book.purchaseLink && (
                     <a 
                       href={book.purchaseLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className={`p-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 shadow-lg ${
                         isAmazonLink 
                         ? 'bg-black text-white' 
                         : 'bg-[#F3AE02] text-black'
                       }`}
                     >
                       {isAmazonLink ? <AmazonLogo size={20} /> : <Bag size={20} weight="fill" />}
                       Buy Now
                     </a>
                   )}
                </div>
                
                <button 
                  className="w-full py-5 bg-warm-accent text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-warm-accent/20 hover:translate-y-[-2px] transition-all disabled:opacity-50"
                  onClick={() => changeStatus('bought_not_started')}
                  disabled={updating}
                >
                  <ShoppingCart size={18} weight="bold" />
                  I bought this book
                </button>
              </div>
            )}

            {/* Archive Section Logic */}
            {book.status === 'archive' && (
              <div className="bg-black/5 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/10 dark:border-white/10 shadow-sm space-y-6">
                <p className="text-center text-xs font-medium text-warm-muted italic">"Sometimes the right book just needs the right time."</p>
                 <button 
                  className="w-full py-5 bg-warm-text dark:bg-dark-surface text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-50"
                  onClick={() => changeStatus('reading')}
                  disabled={updating}
                >
                  <ArrowRight size={18} weight="bold" />
                  Give it another chance
                </button>
              </div>
            )}

            {/* Review Section */}
            {(book.status === 'read' || book.status === 'archive') && (
              <div className="space-y-4 bg-warm-accent/5 p-8 rounded-[2.5rem] border border-warm-accent/10">
                <div className="flex items-center gap-3">
                  <Star size={20} weight="fill" className="text-warm-accent" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-accent">Literary Review</h4>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={24} 
                      weight={star <= (book.rating || 0) ? 'fill' : 'regular'} 
                      className={star <= (book.rating || 0) ? 'text-warm-accent' : 'text-warm-muted/20'}
                    />
                  ))}
                </div>
                <div className="relative mt-4">
                   <Quotes size={20} className="absolute -left-2 -top-2 opacity-20" />
                   <p className="text-sm italic text-warm-text/80 dark:text-dark-text/80 leading-relaxed pl-4">
                     {book.notes || "This book left an indelible mark on my sanctuary of thought."}
                   </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <button 
                disabled={updating}
                className="flex-1 flex items-center justify-center gap-3 py-5 bg-white dark:bg-dark-surface rounded-[2rem] font-black uppercase tracking-widest text-[10px] text-warm-muted shadow-sm hover:text-warm-accent hover:border-warm-accent/20 border border-transparent transition-all disabled:opacity-50"
              >
                <PencilSimple size={20} weight="bold" />
                Edit Details
              </button>
              <button 
                onClick={removeBook}
                disabled={updating}
                className="flex-1 flex items-center justify-center gap-3 py-5 bg-white dark:bg-dark-surface rounded-[2rem] font-black uppercase tracking-widest text-[10px] text-warm-muted shadow-sm hover:text-warm-rose hover:border-warm-rose/20 border border-transparent transition-all disabled:opacity-50"
              >
                <Trash size={20} weight="bold" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDetailModal;

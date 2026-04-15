import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MagnifyingGlass, BookmarkSimple, Star, Link as LinkIcon, BookOpen, Tag, CircleNotch } from '@phosphor-icons/react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import FallbackIcon from '../ui/FallbackIcon';

const AddBookDrawer = ({ isOpen, onClose }) => {
  const { currentUser, userData } = useAuth();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const username = userData?.displayName?.split(' ')[0] || 'Reader';

  // Custom Form State
  const [status, setStatus] = useState('reading');
  const [category, setCategory] = useState('Fiction');
  const [genres, setGenres] = useState(''); 
  const [rating, setRating] = useState(0);
  const [pagesRead, setPagesRead] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [notes, setNotes] = useState('');
  const [buyLink, setBuyLink] = useState('');

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSearch('');
        setResults([]);
        setSelectedBook(null);
        setStatus('reading');
        setCategory('Fiction');
        setGenres('');
        setRating(0);
        setPagesRead('');
        setTotalPages('');
        setNotes('');
        setBuyLink('');
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (search.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        setLoading(true);
        try {
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=5`);
          const data = await res.json();
          setResults(data.items || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 400);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [search]);

  const handleSelect = (book) => {
    const info = book.volumeInfo;
    setSelectedBook({
      title: info.title,
      author: info.authors ? info.authors[0] : 'Unknown Author',
      totalPages: info.pageCount || 0,
      description: info.description || '',
      spineColor: '#6B8F71', // Default, should extract from cover in future
      googleBooksId: book.id,
      coverUrl: info.imageLinks?.thumbnail || ''
    });
    if (info.pageCount) setTotalPages(info.pageCount);
    if (info.categories) setGenres(info.categories.join(', '));
    setSearch('');
    setResults([]);
  };

  const handleAddBook = async () => {
    if (!selectedBook || !currentUser) return;

    try {
      setAdding(true);
      
      const bookData = {
        title: selectedBook.title,
        author: selectedBook.author,
        description: selectedBook.description,
        genre: genres.split(',').map(g => g.trim()),
        category: category,
        coverUrl: selectedBook.coverUrl,
        spineColor: selectedBook.spineColor,
        status: status,
        rating: rating,
        progress: {
          pagesRead: status === 'read' ? totalPages : (parseInt(pagesRead) || 0),
          totalPages: parseInt(totalPages) || 0,
          percentComplete: status === 'read' ? 100 : Math.round(((parseInt(pagesRead) || 0) / (parseInt(totalPages) || 1)) * 100)
        },
        purchaseLink: buyLink || null,
        purchasePlatform: buyLink ? (buyLink.includes('amazon') ? 'amazon' : 'flipkart') : null,
        notes: notes,
        dateAdded: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        googleBooksId: selectedBook.googleBooksId,
        dateStarted: (status === 'reading' || status === 'read') ? serverTimestamp() : null,
        dateFinished: status === 'read' ? serverTimestamp() : null
      };

      await addDoc(collection(db, 'users', currentUser.uid, 'books'), bookData);

      // Update user stats
      const userRef = doc(db, 'users', currentUser.uid);
      const statToIncrement = {
        'reading': 'currentlyReading',
        'read': 'totalRead',
        'bought_not_started': 'boughtNotStarted',
        'want_to_buy': 'wantToBuy',
        'archive': null
      }[status];

      if (statToIncrement) {
        await updateDoc(userRef, {
          [`stats.${statToIncrement}`]: increment(1)
        });
      }

      onClose();
    } catch (err) {
      console.error("Error adding book: ", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-warm-bg dark:bg-dark-bg rounded-t-[3.5rem] shadow-2xl z-10 flex flex-col max-h-[95vh] overflow-hidden"
          >
            <div className="w-16 h-1.5 bg-warm-border/30 rounded-full mx-auto mt-6 flex-shrink-0"></div>

            <div className="p-10 space-y-8 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif font-black text-warm-text dark:text-dark-text tracking-tight">Add to {username}'s Shelf</h2>
                <button onClick={onClose} className="p-3 bg-white/80 dark:bg-black/20 rounded-full shadow-sm">
                  <X size={20} weight="bold" />
                </button>
              </div>

              {!selectedBook && (
                <div className="relative">
                  <MagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-warm-muted" size={22} />
                  <input 
                    type="text" 
                    placeholder="Search for a masterpiece..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white dark:bg-dark-surface border border-warm-border/20 dark:border-white/5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-warm-accent/10 transition-all shadow-inner text-sm"
                  />
                  
                  <AnimatePresence>
                    {(results.length > 0 || loading) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl rounded-[2.5rem] border border-warm-border/10 shadow-2xl overflow-hidden z-20"
                      >
                        {loading ? (
                          <div className="p-8 text-center text-warm-muted font-bold animate-pulse tracking-widest text-[10px] uppercase">Searching library...</div>
                        ) : (
                          results.map((item) => (
                            <button 
                              key={item.id}
                              onClick={() => handleSelect(item)}
                              className="w-full p-5 flex gap-5 hover:bg-warm-accent/5 transition-colors border-b border-warm-border/5 last:border-0 text-left"
                            >
                              <div className="w-12 h-16 bg-warm-surface flex-shrink-0 rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                                <FallbackIcon seed={item.volumeInfo.title} size={24} color="#6B8F71" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-warm-text dark:text-dark-text line-clamp-1">{item.volumeInfo.title}</p>
                                <p className="text-[10px] font-bold uppercase text-warm-muted mt-1 tracking-widest">{item.volumeInfo.authors?.[0]}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {selectedBook && (
                <div className="flex gap-6 p-6 bg-warm-accent/5 rounded-[2.5rem] border border-warm-accent/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                    <BookOpen size={80} weight="fill" />
                  </div>
                  <div className="w-20 h-28 rounded-xl overflow-hidden shadow-xl bg-warm-surface z-10 flex items-center justify-center">
                    <FallbackIcon seed={selectedBook.title} size={40} color="#6B8F71" />
                  </div>
                  <div className="flex-grow z-10 flex flex-col justify-center">
                    <h4 className="font-serif font-black text-lg text-warm-text tracking-tight">{selectedBook.title}</h4>
                    <p className="text-[10px] font-black uppercase text-warm-muted tracking-widest mt-1">{selectedBook.author}</p>
                    <button 
                      onClick={() => setSelectedBook(null)}
                      className="text-[10px] font-black text-warm-accent mt-3 uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                    >
                      Change selection
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60 ml-3">Shelf State</label>
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-4 bg-white dark:bg-dark-surface border border-warm-border/10 dark:border-white/5 rounded-[1.5rem] text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-warm-accent/10 transition-all"
                    >
                      <option value="reading">Reading Now</option>
                      <option value="read">Finished</option>
                      <option value="bought_not_started">Unread</option>
                      <option value="want_to_buy">Wishlist</option>
                      <option value="archive">Not for Me</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60 ml-3">Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-4 bg-white dark:bg-dark-surface border border-warm-border/10 dark:border-white/5 rounded-[1.5rem] text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-warm-accent/10 transition-all"
                    >
                      <option>Fiction</option>
                      <option>Non-Fiction</option>
                      <option>Self-Help</option>
                      <option>Philosophy</option>
                      <option>Sci-Fi</option>
                      <option>History</option>
                      <option>Science</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60 ml-3">Genres (Comma separated)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. Mystery, Thriller, Noir" 
                      value={genres}
                      onChange={(e) => setGenres(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-surface border border-warm-border/10 dark:border-white/5 rounded-[1.5rem] text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-warm-accent/10 transition-all"
                    />
                  </div>
                </div>

                {(status === 'read' || status === 'archive') && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                     <label className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-accent ml-3">Literary Rating</label>
                     <div className="flex gap-4 px-3">
                        {[1, 2, 3, 4, 5].map(s => (
                           <button key={s} onClick={() => setRating(s)} className="transform active:scale-75 transition-transform">
                             <Star size={32} weight={s <= rating ? "fill" : "regular"} className={s <= rating ? "text-warm-accent" : "text-warm-muted/20"} />
                           </button>
                        ))}
                     </div>
                  </div>
                )}

                {status === 'reading' && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60 ml-3">Current Page</label>
                      <input type="number" value={pagesRead} onChange={(e) => setPagesRead(e.target.value)} placeholder="0" className="w-full p-4 bg-white dark:bg-dark-surface border border-warm-border/10 dark:border-white/5 rounded-[1.5rem] text-sm font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60 ml-3">Total Pages</label>
                      <input type="number" value={totalPages} onChange={(e) => setTotalPages(e.target.value)} className="w-full p-4 bg-white dark:bg-dark-surface border border-warm-border/10 dark:border-white/5 rounded-[1.5rem] text-sm font-bold outline-none" />
                    </div>
                  </div>
                )}

                {status === 'want_to_buy' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60 ml-3 flex items-center gap-2">
                        <LinkIcon size={14} /> Buy Link (Amazon/Flipkart)
                      </label>
                      <input 
                        type="url" 
                        value={buyLink} 
                        onChange={(e) => setBuyLink(e.target.value)} 
                        placeholder="https://amazon.in/..." 
                        className="w-full p-4 bg-white dark:bg-dark-surface border border-warm-border/10 dark:border-white/5 rounded-[1.5rem] text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-warm-accent/10 transition-all" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60 ml-3">My Impressions</label>
                  <textarea 
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={status === 'read' ? "What impact did this leave on you?" : "Initial thoughts..."}
                    className="w-full p-5 bg-white dark:bg-dark-surface border border-warm-border/10 dark:border-white/5 rounded-[2rem] text-sm font-medium outline-none resize-none shadow-sm focus:ring-4 focus:ring-warm-accent/10 transition-all"
                  ></textarea>
                </div>
              </div>

              <button 
                onClick={handleAddBook}
                disabled={adding || !selectedBook}
                className="w-full py-6 bg-warm-accent text-white rounded-[2.5rem] font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-4 mt-6 shadow-2xl shadow-warm-accent/30 active:scale-95 transition-all disabled:opacity-50"
              >
                {adding ? <CircleNotch className="animate-spin" size={24} /> : (
                  <>
                    <BookmarkSimple size={24} weight="fill" />
                    Add to Shelf
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddBookDrawer;

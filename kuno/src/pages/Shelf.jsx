import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Books, CircleNotch } from '@phosphor-icons/react';
import { useBooks } from '../hooks/useBooks';
import ShelfSection from '../components/bookshelf/ShelfSection';
import BookDetailModal from '../components/modals/BookDetailModal';

const Shelf = () => {
  const { books, loading } = useBooks();
  const [filter, setFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);

  const statuses = ['All', 'Currently Reading', 'Finished', 'Unread', 'Wishlist', 'Not for Me'];
  const statusMap = {
    'Currently Reading': 'reading',
    'Finished': 'read',
    'Unread': 'bought_not_started',
    'Wishlist': 'want_to_buy',
    'Not for Me': 'archive'
  };

  const genres = ['All', ...new Set(books.map(b => Array.isArray(b.genre) ? b.genre[0] : b.genre))];

  const filteredBooks = books.filter(book => {
    const statusMatch = filter === 'All' || book.status === statusMap[filter];
    const firstGenre = Array.isArray(book.genre) ? book.genre[0] : book.genre;
    const genreMatch = genreFilter === 'All' || firstGenre === genreFilter;
    return statusMatch && genreMatch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-warm-muted">
        <CircleNotch size={48} className="animate-spin mb-4" />
        <p className="font-serif italic text-lg">Arranging the shelves...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen">
      {/* Filter Chips */}
      <div className="px-6 py-4 space-y-4 overflow-hidden sticky top-0 z-30 bg-warm-bg/90 dark:bg-dark-bg/90 backdrop-blur-md">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-sans font-bold whitespace-nowrap transition-all ${
                filter === s 
                  ? 'bg-warm-accent text-white shadow-md' 
                  : 'bg-warm-surface dark:bg-dark-surface text-warm-muted dark:text-dark-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setGenreFilter(g)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${
                genreFilter === g 
                  ? 'bg-warm-text dark:bg-dark-text text-white dark:text-dark-bg shadow-sm' 
                  : 'border border-warm-border/30 dark:border-dark-border/30 text-warm-muted/70 dark:text-dark-muted/70'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* The Bookshelf */}
      <div className="py-8">
        {filter === 'All' ? (
          <>
            <ShelfSection 
              title="📖 Currently Reading" 
              books={filteredBooks.filter(b => b.status === 'reading')} 
              onBookClick={setSelectedBook}
            />
            <ShelfSection 
              title="✅ Finished" 
              books={filteredBooks.filter(b => b.status === 'read')} 
              onBookClick={setSelectedBook}
            />
            <ShelfSection 
              title="📦 Unread" 
              books={filteredBooks.filter(b => b.status === 'bought_not_started')} 
              onBookClick={setSelectedBook}
            />
            <ShelfSection 
              title="🛒 Wishlist" 
              books={filteredBooks.filter(b => b.status === 'want_to_buy')} 
              onBookClick={setSelectedBook}
            />
            <div className="mt-12 pt-12 border-t border-warm-border/10">
              <ShelfSection 
                title="🌑 Not for Me (Archive)" 
                books={filteredBooks.filter(b => b.status === 'archive')} 
                onBookClick={setSelectedBook}
              />
            </div>
          </>
        ) : (
          <ShelfSection 
            title={filter} 
            books={filteredBooks} 
            onBookClick={setSelectedBook}
          />
        )}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center opacity-50">
          <Books size={64} className="mb-4 text-warm-muted" />
          <p className="font-serif italic text-xl">Your shelf feels a bit lonely...</p>
          <p className="text-sm mt-2">Try changing your filters or add a new book!</p>
        </div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <BookDetailModal 
            book={selectedBook} 
            onClose={() => setSelectedBook(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shelf;

import React from 'react';
import ShelfRow from './ShelfRow';

const ShelfSection = ({ title, books, onBookClick }) => {
  if (books.length === 0) return null;

  // Split books into rows of 7 to simulate a real shelf
  const rows = [];
  for (let i = 0; i < books.length; i += 7) {
    rows.push(books.slice(i, i + 7));
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-4 px-6 mb-2">
        <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-warm-muted dark:text-dark-muted">
          {title}
        </h3>
        <div className="flex-grow h-[1px] bg-warm-border/20"></div>
        <span className="text-[10px] font-sans font-bold text-warm-muted/50">{books.length}</span>
      </div>
      
      {rows.map((rowBooks, idx) => (
        <ShelfRow key={idx} books={rowBooks} onBookClick={onBookClick} />
      ))}
    </section>
  );
};

export default ShelfSection;

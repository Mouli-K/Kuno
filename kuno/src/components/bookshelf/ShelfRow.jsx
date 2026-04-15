import React from 'react';
import BookSpine from './BookSpine';

const ShelfRow = ({ books, onBookClick }) => {
  return (
    <div className="relative pt-8 pb-4">
      {/* The Books sitting on the plank */}
      <div className="flex items-end px-4 h-[180px] gap-1 relative z-10 overflow-x-auto no-scrollbar">
        {books.map(book => (
          <BookSpine key={book.id} book={book} onClick={onBookClick} />
        ))}
        
        {/* Decorative Items */}
        <div className="flex-shrink-0 w-8 h-12 bg-warm-muted/20 rounded-t-lg ml-4 mb-1"></div>
      </div>

      {/* The Plank */}
      <div 
        className="h-4 w-full bg-gradient-to-b from-[#8B7355] to-[#634E35] rounded-sm shadow-lg relative z-0"
        style={{ marginTop: '-4px' }}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
      </div>
    </div>
  );
};

export default ShelfRow;

import React from 'react';
import { motion } from 'framer-motion';
import { Book } from '@phosphor-icons/react';
import { getContrastColor, darkenColor } from '../../utils/colors';

const BookSpine = ({ book, onClick }) => {
  const textColor = getContrastColor(book.spineColor);
  const bindingColor = darkenColor(book.spineColor, 15);
  
  // Random tilt for natural look
  const tilt = React.useMemo(() => (Math.random() * 6 - 3), []);

  return (
    <motion.div
      onClick={() => onClick(book)}
      whileHover={{ 
        scale: 1.05, 
        y: -20,
        zIndex: 10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}
      className="relative flex-shrink-0 cursor-pointer transition-all duration-300 origin-bottom"
      style={{ 
        width: '64px', // Wider to support two-line titles
        height: '200px', // Slightly taller for better flow
        rotate: `${tilt}deg`
      }}
    >
      <div 
        className="w-full h-full rounded-sm flex flex-col items-center justify-between py-6 relative shadow-xl overflow-hidden"
        style={{ 
          backgroundColor: book.spineColor,
          borderLeft: `8px solid ${bindingColor}`,
          borderRadius: '2px 10px 10px 2px'
        }}
      >
        {/* Top Decorative Element */}
        <div className={`w-5 h-1.5 rounded-full opacity-30 flex-shrink-0 ${textColor === 'black' ? 'bg-black' : 'bg-white'}`}></div>
        
        {/* Vertical Title - Support for Multi-line wrapping */}
        <div className="flex-grow flex items-center justify-center w-full px-3 py-2 overflow-hidden">
          <p 
            className="font-serif text-[14px] sm:text-[15px] font-black uppercase tracking-tighter leading-[1.1] text-center"
            style={{ 
              color: textColor,
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              maxHeight: '140px',
              textShadow: textColor === 'white' 
                ? '1px 1px 2px rgba(0,0,0,0.3)' 
                : '0.5px 0.5px 0px rgba(255,255,255,0.2)'
            }}
          >
            {book.title}
          </p>
        </div>

        {/* Bottom Decorative Element */}
        <div className="w-full flex flex-col items-center gap-3 mt-auto pb-2 flex-shrink-0">
           <div className={`h-[2px] w-1/2 opacity-20 ${textColor === 'black' ? 'bg-black' : 'bg-white'}`}></div>
           <Book size={22} weight="fill" style={{ color: textColor, opacity: 0.5 }} />
        </div>
      </div>
    </motion.div>
  );
};

export default BookSpine;

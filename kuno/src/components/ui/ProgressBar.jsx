import React from 'react';
import { BookOpen } from '@phosphor-icons/react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-warm-muted dark:text-dark-muted">
          Progress
        </span>
        <span className="text-[10px] font-sans font-bold text-warm-accent">
          {progress}%
        </span>
      </div>
      <div className="relative h-2 w-full bg-warm-border/30 dark:bg-dark-border/30 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-warm-accent rounded-full transition-all duration-500 ease-out flex items-center justify-end"
          style={{ width: `${progress}%` }}
        >
          {progress > 10 && (
            <div className="mr-0.5 transform scale-75 text-white/80">
              <BookOpen size={12} weight="fill" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

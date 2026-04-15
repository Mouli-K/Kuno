import React from 'react';
import * as Icons from '@phosphor-icons/react';

export const AVATAR_ICONS = [
  'User', 'Cat', 'Dog', 'Bird', 'Ghost', 'Moon', 'Sun', 'Flower', 
  'Leaf', 'Heart', 'Star', 'Crown', 'Coffee', 'Pizza', 'Anchor', 'Rocket'
];

const AvatarSelector = ({ selectedIcon, onSelect, onClose }) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-6 bg-white/50 dark:bg-dark-surface/50 rounded-[2.5rem] border border-warm-border/10">
      {AVATAR_ICONS.map((iconName) => {
        const Icon = Icons[iconName] || Icons.User;
        return (
          <button
            key={iconName}
            onClick={() => onSelect(iconName)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              selectedIcon === iconName 
              ? 'bg-warm-accent text-white shadow-lg' 
              : 'bg-white dark:bg-dark-surface text-warm-muted hover:bg-warm-accent/10 hover:text-warm-accent'
            }`}
          >
            <Icon size={24} weight={selectedIcon === iconName ? "fill" : "regular"} />
          </button>
        );
      })}
    </div>
  );
};

export default AvatarSelector;

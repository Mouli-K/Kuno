import React from 'react';
import { Book, BookOpen, Books, BookmarkSimple, Notebook, ReadCvLogo } from '@phosphor-icons/react';

const FallbackIcon = ({ seed, size = 32, color = 'currentColor' }) => {
  const icons = [
    <Book size={size} weight="duotone" color={color} />,
    <BookOpen size={size} weight="duotone" color={color} />,
    <Books size={size} weight="duotone" color={color} />,
    <BookmarkSimple size={size} weight="duotone" color={color} />,
    <Notebook size={size} weight="duotone" color={color} />,
    <ReadCvLogo size={size} weight="duotone" color={color} />
  ];

  // Use seed (like book title or ID) to pick a consistent icon for each book
  const index = seed ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % icons.length : 0;
  
  return icons[index];
};

export default FallbackIcon;

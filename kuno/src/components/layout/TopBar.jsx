import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, BellSlash } from '@phosphor-icons/react';
import { mockUser } from '../../data/mockUser';

const TopBar = ({ theme, toggleTheme, notificationsEnabled, toggleNotifications }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/home': return `${getGreeting()}, ${mockUser.displayName.split(' ')[0]} ☀️`;
      case '/shelf': return 'My Library';
      case '/profile': return 'Profile';
      case '/notifications': return 'Notifications';
      default: return 'Kuno';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-warm-bg/80 dark:bg-dark-bg/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-warm-border/10 dark:border-dark-border/10">
      <h1 className="text-xl font-serif italic text-warm-text dark:text-dark-text">
        {getPageTitle()}
      </h1>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleNotifications}
          className={`p-2 rounded-xl transition-all duration-300 ${notificationsEnabled ? 'text-warm-accent bg-warm-accent/5' : 'text-warm-muted bg-warm-muted/5 opacity-50'}`}
          title={notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
        >
          {notificationsEnabled ? <Bell size={24} weight="fill" /> : <BellSlash size={24} />}
        </button>
        
        <button 
          onClick={toggleTheme}
          className="p-2 text-warm-muted dark:text-dark-muted hover:text-warm-accent transition-colors"
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>
    </header>
  );
};

export default TopBar;

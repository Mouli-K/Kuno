import React from 'react';
import { NavLink } from 'react-router-dom';
import { House, Books, Plus, UserCircle, Bell } from '@phosphor-icons/react';

const BottomNav = ({ onOpenAdd }) => {
  const tabs = [
    { to: '/home', label: 'Home', activeIcon: <House size={22} weight="fill" />, inactiveIcon: <House size={22} /> },
    { to: '/shelf', label: 'Shelf', activeIcon: <Books size={22} weight="fill" />, inactiveIcon: <Books size={22} /> },
    { to: '/add', label: 'Add', icon: Plus, isAction: true },
    { to: '/notifications', label: 'Alerts', activeIcon: <Bell size={22} weight="fill" />, inactiveIcon: <Bell size={22} /> },
    { to: '/profile', label: 'Profile', activeIcon: <UserCircle size={24} weight="fill" />, inactiveIcon: <UserCircle size={24} /> },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-[2.5rem] bg-white/90 dark:bg-dark-surface/90 p-2 shadow-[0_32px_64px_rgba(0,0,0,0.2)] backdrop-blur-2xl border border-white/20 dark:border-white/5">
      <div className="grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          if (tab.isAction) {
            return (
              <button
                key={tab.to}
                onClick={onOpenAdd}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-[2rem] bg-warm-accent text-white shadow-xl shadow-warm-accent/30 active:scale-90 transition-all duration-300"
              >
                <Plus size={22} weight="bold" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">{tab.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1.5 py-3 rounded-[2rem] transition-all duration-300 ${
                  isActive 
                    ? 'text-warm-accent' 
                    : 'text-warm-muted dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                    {isActive ? tab.activeIcon : tab.inactiveIcon}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.15em] leading-none transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, House, ReceiptText, UserRound, LogOut, Moon, Sun } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { APP_NAME } from '@/domain/constants';
import { cn } from '@/lib/utils';
import { useFinance } from '@/app/finance-provider';

const tabs = [
  { to: '/accounts', label: 'Accounts', icon: House },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

const titles: Record<string, { title: string; subtitle: string }> = {
  '/accounts': { title: 'Accounts Hub', subtitle: 'Multi-account and multi-card clarity in one sanctuary.' },
  '/transactions': { title: 'Transactions', subtitle: 'Track cashflow with fast filters and category intelligence.' },
  '/reports': { title: 'Reports', subtitle: 'Local insights for spending, trends, and net worth.' },
  '/profile': { title: 'Profile', subtitle: 'Secure local profile settings and session controls.' },
};

export function MobileShell() {
  const { lock, theme, toggleTheme } = useFinance();
  const location = useLocation();
  const meta = titles[location.pathname] ?? titles['/accounts'];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-32 pt-safe-top sm:px-6">
        <header className="sticky top-safe-top z-40 mb-6 rounded-[2rem] bg-surface/80 px-4 py-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{APP_NAME}</p>
              <h1 className="font-headline text-2xl font-extrabold tracking-tight">{meta.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="rounded-2xl bg-surface-container px-4 py-3 text-on-surface-variant shadow-sm hover:bg-surface-container-high transition-colors"
                title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Lock session and logout?')) lock();
                }}
                className="rounded-2xl bg-surface-container px-4 py-3 text-on-surface-variant shadow-sm hover:bg-error-container hover:text-on-error transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-on-surface-variant">{meta.subtitle}</p>
        </header>

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 rounded-[2rem] bg-surface/90 p-3 shadow-[0_24px_60px_rgba(15,32,77,0.2)] backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 rounded-[1.4rem] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-300',
                    isActive ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low',
                  )
                }
              >
                <Icon size={16} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

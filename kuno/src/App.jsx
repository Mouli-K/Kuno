import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useReminder } from './hooks/useReminder';
import { useStreak } from './hooks/useStreak';

// Pages
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Shelf from './pages/Shelf';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

// Components
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import AddBookDrawer from './components/modals/AddBookDrawer';
import BookDetailModal from './components/modals/BookDetailModal';

import { App as CapApp } from '@capacitor/app';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedBook, setSelectedBook } = useAuth();
  useReminder();
  useStreak();
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const location = useLocation();
  const showNav = !['/splash', '/login', '/register'].includes(location.pathname);

  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showExitToast, setShowExitToast] = useState(false);

  useEffect(() => {
    let lastTimeBackPress = 0;
    const timePeriodToExit = 2000;

    const backListener = CapApp.addListener('backButton', () => {
      if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
        CapApp.exitApp();
      } else {
        lastTimeBackPress = new Date().getTime();
        setShowExitToast(true);
        setTimeout(() => setShowExitToast(false), 2000);
      }
    });

    return () => {
      backListener.then(l => l.remove());
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-warm-bg dark:bg-dark-bg transition-colors duration-300">
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[150] bg-warm-accent text-white py-2 px-4 text-center text-[10px] font-black uppercase tracking-widest shadow-lg"
          >
            Offline — changes will sync when connected
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExitToast && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] bg-dark-bg/80 text-white py-3 px-8 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/10"
          >
            Press back twice to exit
          </motion.div>
        )}
      </AnimatePresence>
      
      {showNav && (
        <TopBar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          notificationsEnabled={notificationsEnabled}
          toggleNotifications={toggleNotifications}
        />
      )}
      
      <main className={`flex-grow ${showNav ? 'pb-24 pt-4' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/splash" replace />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/shelf" element={<ProtectedRoute><Shelf /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile notificationsEnabled={notificationsEnabled} toggleNotifications={toggleNotifications} /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>

      {showNav && <BottomNav onOpenAdd={() => setIsAddDrawerOpen(true)} />}
      
      <AddBookDrawer isOpen={isAddDrawerOpen} onClose={() => setIsAddDrawerOpen(false)} />

      {/* Global Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && selectedBook.id && (
          <BookDetailModal 
            key={selectedBook.id}
            book={selectedBook} 
            onClose={() => setSelectedBook(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Splash = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (currentUser) {
          navigate('/home');
        } else {
          navigate('/login');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigate, currentUser, loading]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col items-center justify-center bg-warm-bg dark:bg-dark-bg"
    >
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-6xl font-serif italic text-warm-accent tracking-tight"
      >
        Kuno
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-4 text-warm-muted dark:text-dark-muted font-sans tracking-wide"
      >
        Your shelf, your story.
      </motion.p>
    </motion.div>
  );
};

export default Splash;

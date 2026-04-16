import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowsClockwise } from '@phosphor-icons/react';

const PullToRefresh = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const threshold = 100;

  useEffect(() => {
    let startY = 0;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].pageY;
      }
    };

    const handleTouchMove = (e) => {
      if (window.scrollY === 0 && !isRefreshing) {
        const currentY = e.touches[0].pageY;
        const diff = currentY - startY;
        if (diff > 0) {
          setPullDistance(Math.min(diff, threshold + 20));
          if (diff > 5) {
             // Prevent default only when pulling down at the top
             if (e.cancelable) e.preventDefault();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        onRefresh();
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 1500);
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, onRefresh]);

  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none" style={{ height: 100, zIndex: 40 }}>
      <motion.div
        animate={{ 
          y: isRefreshing ? 20 : pullDistance > 0 ? pullDistance / 2 : -50,
          rotate: isRefreshing ? 360 : pullDistance * 2,
          opacity: pullDistance > 10 || isRefreshing ? 1 : 0
        }}
        transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: 'spring', damping: 20 }}
        className="w-10 h-10 bg-warm-accent text-white rounded-full shadow-lg flex items-center justify-center mt-4"
      >
        <ArrowsClockwise size={20} weight="bold" />
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
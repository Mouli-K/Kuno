import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowsClockwise, Books, BookmarkSimple, CheckCircle, ShoppingCart, Quotes as QuotesIcon, CircleNotch } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../hooks/useBooks';
import { useReminder } from '../hooks/useReminder';
import { useAchievements } from '../hooks/useAchievements';
import { quotes } from '../data/quotes';
import ProgressBar from '../components/ui/ProgressBar';
import FallbackIcon from '../components/ui/FallbackIcon';
import PullToRefresh from '../components/ui/PullToRefresh';
import { Trophy, Lightning, ChartLineUp } from '@phosphor-icons/react';

const Home = () => {
  const { userData, loading: authLoading, setSelectedBook } = useAuth();
  const { books, loading: booksLoading, refresh } = useBooks();
  const { achievements } = useAchievements();
  const [randomQuote, setRandomQuote] = useState(quotes[0]);
  
  const currentlyReading = books.filter(b => b.status === 'reading');
  const { updateWidget } = useReminder();

  useEffect(() => {
    if (currentlyReading.length > 0) {
      updateWidget(currentlyReading);
    }
  }, [books]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, []);

  if (authLoading || (booksLoading && books.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-warm-muted">
        <CircleNotch size={48} className="animate-spin mb-4" />
        <p className="font-serif italic text-lg">Waking up the library...</p>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Shelf', 
      value: (userData?.stats?.totalRead || 0) + (userData?.stats?.currentlyReading || 0) + (userData?.stats?.boughtNotStarted || 0), 
      icon: <Books size={24} />, 
      color: 'bg-warm-accent/10 text-warm-accent' 
    },
    { 
      label: 'Streak', 
      value: `${userData?.stats?.dayStreak || 0}d`, 
      icon: <Lightning size={24} />, 
      color: 'bg-warm-rose/10 text-warm-rose' 
    },
    { 
      label: 'Max Pages', 
      value: userData?.stats?.maxPagesInOneBook || 0, 
      icon: <ChartLineUp size={24} />, 
      color: 'bg-warm-blue/10 text-warm-blue' 
    },
    { 
      label: 'Finished', 
      value: userData?.stats?.totalRead || 0, 
      icon: <CheckCircle size={24} />, 
      color: 'bg-warm-green/10 text-warm-green' 
    },
  ];

  return (
    <div className="relative">
      <PullToRefresh onRefresh={refresh} />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="px-6 space-y-10 pb-32"
      >
        <div className="px-2 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-warm-text dark:text-dark-text tracking-tight">
            Welcome back, {userData?.displayName?.split(' ')[0] || 'Reader'}
          </h2>
          <button 
            onClick={refresh}
            className={`p-2 rounded-full bg-warm-surface dark:bg-dark-surface text-warm-muted transition-all active:rotate-180 duration-500 ${booksLoading ? 'animate-spin text-warm-accent' : ''}`}
          >
            <ArrowsClockwise size={20} />
          </button>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-5 bg-white dark:bg-dark-surface rounded-[2rem] border border-warm-border/5 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-black text-warm-text dark:text-dark-text leading-tight">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-warm-muted/50">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60">Milestones</h3>
           <Trophy size={18} className="text-warm-accent opacity-50" />
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           {achievements.map((ach) => (
             <div 
               key={ach.id}
               className={`flex-shrink-0 w-48 p-5 rounded-[2rem] border transition-all ${
                 ach.isUnlocked 
                   ? 'bg-warm-accent/10 border-warm-accent/20' 
                   : 'bg-white/50 dark:bg-dark-surface/50 border-warm-border/10 opacity-60'
               }`}
             >
               <div className="flex items-start justify-between mb-3">
                 <div className={`p-2 rounded-xl ${ach.isUnlocked ? 'bg-warm-accent text-white' : 'bg-warm-muted/20 text-warm-muted'}`}>
                   <Trophy size={16} weight={ach.isUnlocked ? "fill" : "regular"} />
                 </div>
                 {ach.isUnlocked && <CheckCircle size={16} weight="fill" className="text-warm-green" />}
               </div>
               <h4 className="text-xs font-black text-warm-text dark:text-dark-text truncate">{ach.title}</h4>
               <p className="text-[9px] text-warm-muted mt-1 leading-tight line-clamp-2">{ach.description}</p>
               
               <div className="mt-4 h-1.5 w-full bg-warm-muted/10 rounded-full overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-1000 ${ach.isUnlocked ? 'bg-warm-accent' : 'bg-warm-muted/40'}`} 
                   style={{ width: `${ach.progress}%` }}
                 />
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Cascading Overlapping "Currently Reading" List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-muted/60">Current Journeys</h3>
           <span className="text-[10px] font-black text-warm-accent uppercase tracking-widest">{currentlyReading.length} Books</span>
        </div>
        
        {currentlyReading.length > 0 ? (
          <div className="flex overflow-x-auto no-scrollbar pb-10 -mx-6 px-6 pt-4">
            <div className="flex -space-x-20">
              {currentlyReading.map((book, index) => (
                <motion.div 
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  initial={{ x: 50, opacity: 0, rotate: -5 }}
                  animate={{ x: 0, opacity: 1, rotate: index % 2 === 0 ? -2 : 2 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: 0, 
                    zIndex: 50,
                    x: index === 0 ? 0 : -10,
                    transition: { duration: 0.2 }
                  }}
                  className="relative flex-shrink-0 w-[280px] bg-white dark:bg-dark-surface rounded-[3rem] border border-warm-border/10 shadow-2xl p-8 group overflow-hidden cursor-pointer transform-gpu transition-all duration-300"
                  style={{ zIndex: index }}
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-3 opacity-80" 
                    style={{ backgroundColor: book.spineColor }}
                  ></div>
                  
                  <div className="flex flex-col space-y-6">
                    <div className="flex gap-5">
                      <div className="w-20 h-28 rounded-2xl shadow-xl flex-shrink-0 overflow-hidden bg-warm-surface relative flex items-center justify-center p-4">
                        <FallbackIcon seed={book.title} size={48} color={book.spineColor} />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent"></div>
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-center">
                        <h4 className="text-xl font-serif font-black text-warm-text dark:text-dark-text leading-tight tracking-tight line-clamp-2">
                          {book.title}
                        </h4>
                        <p className="text-[10px] font-black text-warm-muted dark:text-dark-muted mt-2 uppercase tracking-widest opacity-60 truncate">
                          {book.author}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-warm-bg/50 dark:bg-dark-bg/50 p-5 rounded-[2rem] border border-warm-border/5 shadow-inner">
                       <ProgressBar progress={Math.round((book.progress?.pagesRead / book.progress?.totalPages) * 100) || 0} />
                       <div className="flex justify-between items-center mt-4">
                         <p className="text-[10px] font-black text-warm-muted/60 uppercase tracking-widest">
                           {book.progress?.pagesRead || 0} / {book.progress?.totalPages || 0}
                         </p>
                         <p className="text-[10px] font-black text-warm-accent uppercase tracking-widest">
                           {Math.round((book.progress?.pagesRead / book.progress?.totalPages) * 100) || 0}%
                         </p>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/40 dark:bg-dark-surface/40 rounded-[2.5rem] p-10 text-center border border-dashed border-warm-border/20">
            <p className="font-serif italic text-warm-muted">No active journeys right now. Start a new book from your shelf!</p>
          </div>
        )}
      </section>

      {/* Literary Quotes Section */}
      <section className="relative px-2">
        <div className="bg-warm-accent/5 dark:bg-warm-accent/10 rounded-[3rem] p-10 border border-warm-accent/10 relative overflow-hidden group">
          <QuotesIcon size={80} weight="fill" className="absolute -right-4 -top-4 text-warm-accent opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-1 bg-warm-accent rounded-full"></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-accent">Whispers of Wisdom</h3>
            </div>
            
            <p className="text-xl font-serif italic text-warm-text dark:text-dark-text leading-relaxed">
              "{randomQuote.text}"
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <div className="w-10 h-10 rounded-full bg-warm-accent/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-warm-accent">{randomQuote.author[0]}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-warm-muted/60">
                — {randomQuote.author}
              </p>
            </div>
          </div>
        </div>
      </section>
      </motion.div>
    </div>
  );
};

export default Home;
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, Check, Heart, Headphones, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { haptic, playCompletionSound, simpleConfetti, shareResult } from '../utils';

const ActivityView = ({ store }: { store: any }) => {
  // Initialize duration from activity (fallback to 120)
  const [timeLeft, setTimeLeft] = useState(store.selectedActivity?.durationSeconds || 120);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer Effect
  useEffect(() => {
    if (isActive && endTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          setIsActive(false);
          setEndTime(null);
          setIsFinished(true);
          playCompletionSound();
          simpleConfetti();
          if (audioRef.current) audioRef.current.pause();
        }
      }, 100); 
      
      return () => clearInterval(interval);
    }
  }, [isActive, endTime]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleTimer = () => {
    haptic('medium');
    
    if (!isActive) {
      // Start or Resume
      setEndTime(Date.now() + timeLeft * 1000);
      
      // Handle Audio Playback directly on user interaction
      if (store.selectedActivity?.audioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed)", e));
      }
    } else {
      // Pause: endTime is cleared, timeLeft remains as current state
      setEndTime(null);
      
      // Pause Audio
      if (store.selectedActivity?.audioUrl && audioRef.current) {
        audioRef.current.pause();
      }
    }
    setIsActive(!isActive);
  };
  
  const handleDone = () => {
    haptic('medium');
    if (store.selectedActivity) {
      store.addToHistory(
        store.selectedActivity.id, 
        store.selectedActivity.isSOS ? 'SOS' : 'SAD', 
        store.selectedActivity.isSOS ? 'SOS' : store.selectedLocation
      );
    }
    store.setCurrentView('HOME');
  };

  const handleShare = () => {
    haptic('light');
    shareResult(store.selectedActivity.title, store.streak);
  };

  const isFavorite = store.favorites.includes(store.selectedActivity?.id || '');

  if (!store.selectedActivity) return null;

  const duration = store.selectedActivity.durationSeconds;
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <motion.div 
      className="h-full flex flex-col pb-6 relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 no-scrollbar">
        
        {/* Audio Element - Hidden but functional */}
        {store.selectedActivity.audioUrl && (
          <audio 
            ref={audioRef} 
            src={store.selectedActivity.audioUrl} 
            loop 
            preload="auto"
            playsInline
          />
        )}

        {/* Title Section - Compact */}
        <div className="text-center mb-3">
          <div className="text-5xl mb-1 animate-bounce-slow">{store.selectedActivity.emoji}</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {store.selectedActivity.title}
          </h2>
          <div className="flex justify-center items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
             <Clock size={12} />
             <span>{Math.floor(duration / 60)} мин</span>
          </div>
        </div>
        
        {/* Headphone Tip */}
        {store.selectedActivity.category === 'AUDIO' && (
           <div className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-200 py-1.5 px-3 rounded-lg flex items-center gap-2 mb-3 text-xs font-medium border border-teal-100 dark:border-teal-800 justify-center w-fit mx-auto">
             <Headphones size={14} />
             <span>Наденьте наушники</span>
           </div>
        )}

        {/* Instructions */}
        <div className="bg-white dark:bg-carddark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-3">
          <ul className="space-y-2">
            {store.selectedActivity.steps.map((step: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Science Quote */}
        <div className="bg-accent/10 rounded-xl p-3 border border-accent/20 mb-4 text-center">
          <p className="text-accent text-xs italic leading-relaxed">
            "{store.selectedActivity.science}"
          </p>
        </div>

        {/* Compact Timer UI (Horizontal) */}
        <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
          <div className="flex items-center justify-between w-full px-2 mb-3">
             <button 
               onClick={toggleTimer}
               disabled={isFinished}
               className={`w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full text-white shadow-md transition-all active:scale-95 ${isActive ? 'bg-yellow-500' : isFinished ? 'bg-gray-400' : 'bg-primary'} focus:outline-none focus:ring-4 focus:ring-opacity-50`}
               aria-label={isActive ? "Пауза" : "Старт"}
             >
                {isActive ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" className="ml-1" size={28} />}
             </button>
             
             <div className="font-mono font-bold text-5xl text-gray-900 dark:text-white tracking-wider">
               {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
          </div>
          
          {/* Linear Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
             <div 
               className={`h-full ${isFinished ? 'bg-green-500' : 'bg-primary'} transition-all duration-300 ease-linear`}
               style={{ width: `${progress}%` }}
             />
          </div>

          {/* Action Buttons */}
          {isFinished && (
            <div className="flex gap-3 mt-5 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
               <button 
                 onClick={handleDone}
                 className="flex-1 h-11 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 focus:outline-none"
               >
                 <Check size={18} /> Готово
               </button>
               <button 
                 onClick={handleShare}
                 className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 transition-transform active:scale-95 flex items-center justify-center"
                 aria-label="Поделиться"
               >
                 <Share2 size={20} />
               </button>
            </div>
          )}
        </div>

      </div>
      
      {/* Floating Favorite Action */}
      <div className="absolute top-2 right-4 z-10">
        <button 
          onClick={() => {
             haptic('light');
             store.toggleFavorite(store.selectedActivity?.id);
          }}
          className={`p-2.5 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur shadow-sm transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'} focus:outline-none focus:ring-2 focus:ring-primary`}
          aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
    </motion.div>
  );
};

export default ActivityView;
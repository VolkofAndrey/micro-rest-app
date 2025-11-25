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

  // Effect to handle audio playback
  useEffect(() => {
    if (store.selectedActivity?.audioUrl && audioRef.current) {
      if (isActive) {
        audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed)", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isActive, store.selectedActivity]);
  
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

  const toggleTimer = () => {
    haptic('medium');
    if (!isActive) {
      // Start or Resume
      setEndTime(Date.now() + timeLeft * 1000);
    } else {
      // Pause: endTime is cleared, timeLeft remains as current state
      setEndTime(null);
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
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 no-scrollbar">
        
        {/* Audio Element */}
        {store.selectedActivity.audioUrl && (
          <audio ref={audioRef} src={store.selectedActivity.audioUrl} loop />
        )}

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-slow">{store.selectedActivity.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            {store.selectedActivity.title}
          </h2>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
             <Clock size={16} />
             <span>{Math.floor(duration / 60)} мин</span>
          </div>
        </div>
        
        {/* Headphone Tip for Audio Category */}
        {store.selectedActivity.category === 'AUDIO' && (
           <div className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-200 p-3 rounded-xl flex items-center gap-3 mb-6 text-sm font-medium border border-teal-100 dark:border-teal-800">
             <Headphones size={20} />
             <span>Для лучшего эффекта наденьте наушники</span>
           </div>
        )}

        {/* Instructions */}
        <div className="bg-white dark:bg-carddark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Инструкция:</h3>
          <ul className="space-y-4">
            {store.selectedActivity.steps.map((step: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Science Quote */}
        <div className="bg-accent/10 rounded-xl p-5 border border-accent/20 mb-8">
          <p className="text-accent text-sm italic leading-relaxed">
            "{store.selectedActivity.science}"
          </p>
        </div>

        {/* Timer UI */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
             {/* Progress Ring Background */}
             <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className={`text-primary transition-all duration-100 ease-linear ${isFinished ? 'text-green-500' : ''}`}
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                  strokeLinecap="round"
                  fill="none"
                />
             </svg>
             <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white z-10">
               {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
          </div>
          
          <div className="flex items-center gap-4 mt-6">
             <button 
               onClick={toggleTimer}
               disabled={isFinished}
               className={`w-16 h-16 flex items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95 ${isActive ? 'bg-yellow-500' : isFinished ? 'bg-gray-400' : 'bg-primary'} focus:outline-none focus:ring-4 focus:ring-opacity-50`}
               aria-label={isActive ? "Пауза" : "Старт"}
             >
                {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
             </button>
             
             {isFinished && (
               <div className="flex flex-col gap-2">
                 <button 
                   onClick={handleDone}
                   className="px-8 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-green-300"
                 >
                   <Check size={18} /> Готово
                 </button>
                 <button 
                   onClick={handleShare}
                   className="px-8 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-bold transition-transform active:scale-95 flex items-center justify-center gap-2"
                 >
                   <Share2 size={16} /> Поделиться
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
      
      {/* Floating Actions */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => {
             haptic('light');
             store.toggleFavorite(store.selectedActivity?.id);
          }}
          className={`p-3 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur shadow-sm transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'} focus:outline-none focus:ring-2 focus:ring-primary`}
          aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        >
          <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
    </motion.div>
  );
};

export default ActivityView;
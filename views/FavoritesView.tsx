import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getActivityById } from '../data';
import { haptic } from '../utils';

const FavoritesView = ({ store }: { store: any }) => {
  if (store.favorites.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 px-8 text-center pb-20">
        <Heart size={64} strokeWidth={1} className="mb-4 opacity-50" />
        <p>Сохраняйте любимые техники, чтобы не потерять их.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="pb-24 px-4 pt-4 space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {store.favorites.map((id: string) => {
        const activity = getActivityById(id);
        if (!activity) return null;

        return (
          <div 
            key={id} 
            className="bg-white dark:bg-carddark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between"
          >
            <div 
              className="flex items-center gap-4 flex-1 cursor-pointer"
              onClick={() => {
                haptic('light');
                store.setSelectedActivity(activity);
                store.setCurrentView('ACTIVITY');
              }}
              role="button"
              tabIndex={0}
            >
              <div className="text-3xl">{activity.emoji}</div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">{activity.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{activity.science}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                haptic('medium');
                store.toggleFavorite(id);
              }}
              className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Удалить из избранного"
            >
              <Trash2 size={20} />
            </button>
          </div>
        );
      })}
    </motion.div>
  );
};

export default FavoritesView;
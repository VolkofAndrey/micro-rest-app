import React, { useState } from 'react';
import { History as HistoryIcon, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { getActivityById, LOCATIONS_MAP } from '../data';
import { LocationType } from '../types';
import { haptic } from '../utils';

const HistoryView = ({ store }: { store: any }) => {
  const [search, setSearch] = useState('');

  const handleRepeat = (entry: any) => {
    haptic('light');
    const activity = getActivityById(entry.activityId);
    if (activity) {
      store.setSelectedActivity(activity);
      store.setCurrentView('ACTIVITY');
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    haptic('medium');
    store.removeFromHistory(id);
  };

  const filteredHistory = store.history.filter((entry: any) => {
    const activity = getActivityById(entry.activityId);
    if (!activity) return false;
    return activity.title.toLowerCase().includes(search.toLowerCase());
  });

  if (store.history.length === 0) {
    return (
      <div className="h-full flex flex-col pt-safe px-4 pb-24">
         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 mt-2 px-1">История</h2>
         <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center -mt-20">
            <HistoryIcon size={64} strokeWidth={1} className="mb-4 opacity-50" />
            <p>Здесь появится история ваших микро-отдыхов.</p>
         </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-full flex flex-col pb-24 px-4 pt-safe"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
       <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-2 px-1">История</h2>
       
       {/* Search Bar */}
       <div className="relative mb-4">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <Search size={18} className="text-gray-400" />
         </div>
         <input 
            type="text"
            placeholder="Поиск по истории..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-carddark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
         />
       </div>

       <div className="flex-1 overflow-y-auto space-y-4 pb-4 no-scrollbar">
         {filteredHistory.length === 0 ? (
           <div className="text-center text-gray-400 mt-10">Ничего не найдено</div>
         ) : (
           filteredHistory.map((entry: any) => {
             const activity = getActivityById(entry.activityId);
             if (!activity) return null;
             
             const date = new Date(entry.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

             return (
               <div 
                key={entry.id}
                onClick={() => handleRepeat(entry)}
                className="group relative bg-white dark:bg-carddark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer active:scale-[0.99] transition-transform focus-within:ring-2 focus-within:ring-primary"
                tabIndex={0}
                role="button"
               >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{activity.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{activity.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                         <span>{date}</span>
                         {entry.location !== 'SOS' && entry.location !== 'QUICK' && (
                           <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] uppercase">
                             {LOCATIONS_MAP[entry.location as LocationType]?.label}
                           </span>
                         )}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, entry.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors focus:outline-none focus:text-red-500"
                      aria-label="Удалить из истории"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
               </div>
             );
           })
         )}
       </div>
    </motion.div>
  );
};

export default HistoryView;
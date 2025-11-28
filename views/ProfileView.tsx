import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Award, Zap, Heart, Bell, ChevronRight } from 'lucide-react';
import { ACHIEVEMENTS, checkAchievements } from '../data';
import { haptic } from '../utils';
import { APP_VERSION } from '../constants';
import { requestNotificationPermission } from '../permissions';

const ProfileView = ({ store }: { store: any }) => {
  const unlocked = checkAchievements(store.history, store.streak);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const handleNotificationToggle = async () => {
    haptic('light');
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        new Notification('Микро-отдых', { body: 'Уведомления включены! Мы напомним вам отдохнуть.' });
      } else {
        alert('Не удалось включить уведомления. Проверьте настройки браузера.');
      }
    } else {
      setNotificationsEnabled(false);
      alert('Чтобы полностью отключить уведомления, измените настройки сайта в браузере.');
    }
  };
  
  return (
    <motion.div 
      className="pb-40 px-5 pt-safe space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-5 mt-2">
        <div className="w-20 h-20 rounded-full bg-surface dark:bg-surface-dark border border-gray-100 dark:border-gray-700 flex items-center justify-center text-4xl shadow-sm">
           👋
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Профиль</h2>
          <p className="text-gray-500 text-sm mt-1">Твой прогресс и настройки</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-carddark p-4 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center aspect-square">
           <Zap className="text-orange-400 mb-2" size={28} />
           <p className="text-2xl font-bold">{store.streak}</p>
           <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mt-1">Серия</p>
        </div>
        <div className="bg-white dark:bg-carddark p-4 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center aspect-square">
           <Award className="text-purple-400 mb-2" size={28} />
           <p className="text-2xl font-bold">{store.history.length}</p>
           <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mt-1">Практик</p>
        </div>
        <div className="bg-white dark:bg-carddark p-4 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center aspect-square">
           <Heart className="text-red-400 mb-2" size={28} />
           <p className="text-2xl font-bold">{store.favorites.length}</p>
           <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mt-1">Любимых</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2 px-1">
          Достижения
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return (
              <div 
                key={ach.id}
                className={`p-4 rounded-[1.5rem] border transition-all ${
                  isUnlocked 
                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30' 
                    : 'bg-gray-50 dark:bg-gray-800 border-transparent opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <div className="text-3xl filter drop-shadow-sm">{isUnlocked ? ach.emoji : '🔒'}</div>
                   {isUnlocked && <Award size={16} className="text-amber-500" />}
                </div>
                <h4 className={`font-bold text-sm leading-tight ${isUnlocked ? 'text-gray-900 dark:text-amber-100' : 'text-gray-500'}`}>
                  {ach.title}
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">{ach.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Section */}
      <div>
        <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white px-1">Настройки</h3>
        <div className="bg-white dark:bg-carddark rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          
          {/* Theme Toggle */}
          <div className="p-5 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-800 transition-colors cursor-pointer" onClick={() => store.setIsDarkMode(!store.isDarkMode)}>
            <div className="flex items-center gap-4">
               <div className="text-gray-500 dark:text-gray-400">
                  {store.isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
               </div>
               <div>
                  <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100">Тёмная тема</h4>
                  <p className="text-xs text-gray-500">Снижает нагрузку на глаза</p>
               </div>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors relative ${store.isDarkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${store.isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800 mx-5" />

          {/* Notification Toggle */}
          <div className="p-5 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-800 transition-colors cursor-pointer" onClick={handleNotificationToggle}>
            <div className="flex items-center gap-4">
               <div className="text-gray-500 dark:text-gray-400">
                  <Bell size={24} />
               </div>
               <div>
                  <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100">Напоминания</h4>
                  <p className="text-xs text-gray-500">Предлагать отдых</p>
               </div>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 py-6">
        MicroRest v{APP_VERSION} • Android Edition
      </div>
    </motion.div>
  );
};

export default ProfileView;
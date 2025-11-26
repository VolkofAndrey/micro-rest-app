
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Award, Zap, Heart, Bell } from 'lucide-react';
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
      // We cannot revoke permissions via JS, just update UI state
      setNotificationsEnabled(false);
      alert('Чтобы полностью отключить уведомления, измените настройки сайта в браузере.');
    }
  };
  
  return (
    <motion.div 
      className="pb-32 px-5 pt-6 space-y-8 overflow-y-auto h-full no-scrollbar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl shadow-lg">
           👋
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Мой Профиль</h2>
          <p className="text-gray-500 text-sm">Ваш путь к спокойствию</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-carddark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
           <Zap className="mx-auto text-orange-400 mb-2" size={24} />
           <p className="text-2xl font-bold">{store.streak}</p>
           <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Серия дней</p>
        </div>
        <div className="bg-white dark:bg-carddark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
           <Award className="mx-auto text-purple-400 mb-2" size={24} />
           <p className="text-2xl font-bold">{store.history.length}</p>
           <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Практик</p>
        </div>
        <div className="bg-white dark:bg-carddark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
           <Heart className="mx-auto text-red-400 mb-2" size={24} />
           <p className="text-2xl font-bold">{store.favorites.length}</p>
           <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Любимых</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Award size={20} className="text-primary" /> Достижения
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return (
              <div 
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200 dark:border-yellow-800' 
                    : 'bg-gray-50 dark:bg-gray-800 border-transparent opacity-60 grayscale'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <div className="text-3xl">{isUnlocked ? ach.emoji : '🔒'}</div>
                   {isUnlocked && <div className="bg-yellow-400 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>}
                </div>
                <h4 className={`font-bold text-sm ${isUnlocked ? 'text-gray-900 dark:text-yellow-100' : 'text-gray-500'}`}>
                  {ach.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{ach.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Section */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Настройки</h3>
        <div className="bg-white dark:bg-carddark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-full ${store.isDarkMode ? 'bg-indigo-900 text-yellow-300' : 'bg-orange-100 text-orange-500'}`}>
                  {store.isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">Тёмная тема</h4>
                  <p className="text-xs text-gray-500">Снижает нагрузку на глаза</p>
               </div>
            </div>
            <button
              onClick={() => {
                haptic('light');
                store.setIsDarkMode(!store.isDarkMode);
              }}
              className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary ${store.isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${store.isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-full ${notificationsEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Bell size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">Напоминания</h4>
                  <p className="text-xs text-gray-500">Предлагать отдых</p>
               </div>
            </div>
            <button
              onClick={handleNotificationToggle}
              className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 py-4">
        MicroRest v{APP_VERSION} • Made for Peace
      </div>
    </motion.div>
  );
};

export default ProfileView;

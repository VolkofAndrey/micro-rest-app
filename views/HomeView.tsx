import React from 'react';
import { Siren, Hand, Sparkles, Wand2, Zap, ChevronLeft, ArrowRight, Clock, Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EMOTIONS_MAP, LOCATIONS_MAP, CATEGORIES_MAP, getActivitiesForContext, getActivitiesByCategory, getDailyChallenge, getActivityById, getEmotionReaction } from '../data';
import { Emotion, LocationType, ActivityCategory } from '../types';
import { haptic } from '../utils';

const HomeView = ({ store }: { store: any }) => {
  const emotions = Object.keys(EMOTIONS_MAP) as Emotion[];
  const locations = Object.keys(LOCATIONS_MAP) as LocationType[];
  const categories = Object.keys(CATEGORIES_MAP) as ActivityCategory[];

  const challenge = getDailyChallenge();
  const completedToday = store.history.filter((e: any) => {
    const activity = getActivityById(e.activityId);
    return activity?.category === challenge.category && 
           new Date(e.timestamp).toDateString() === new Date().toDateString();
  }).length;

  const handleEmotionSelect = (emotion: Emotion) => {
    haptic('medium');
    const possibleActivities = getActivitiesForContext(emotion, store.selectedLocation);
    const recommended = store.getSmartRecommendation(possibleActivities);

    if (recommended) {
      store.setSelectedActivity(recommended);
      store.setCurrentView('ACTIVITY');
    } else {
      alert('Для этого сочетания пока нет активностей. Попробуйте другое место или эмоцию!');
    }
  };

  const handleCategorySelect = (category: ActivityCategory) => {
    haptic('light');
    store.setSelectedCategory(category);
    store.setHomeMode('CATEGORY_LIST');
  };

  const handleActivitySelect = (activity: any) => {
    haptic('medium');
    store.setSelectedActivity(activity);
    store.setCurrentView('ACTIVITY');
  };

  const renderInitialMode = () => (
    <motion.div
      key="initial"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 flex flex-col pb-safe-nav"
    >
      {/* Streak Counter */}
      {store.streak > 0 && (
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-[2rem] p-5 text-white shadow-lg shadow-orange-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 font-medium">Твоя серия</p>
              <p className="text-3xl font-bold">{store.streak} {store.streak === 1 ? 'день' : store.streak < 5 ? 'дня' : 'дней'} 🔥</p>
            </div>
            <div className="text-5xl animate-bounce-slow filter drop-shadow-md">
              {store.streak >= 30 ? '👑' : store.streak >= 14 ? '⭐' : store.streak >= 7 ? '💎' : '🌱'}
            </div>
          </div>
        </div>
      )}

      {/* Daily Challenge */}
      <button
        onClick={() => {
          haptic('light');
          store.setSelectedCategory(challenge.category);
          store.setHomeMode('CATEGORY_LIST');
        }}
        className="w-full text-left bg-white dark:bg-carddark rounded-[2rem] p-5 shadow-sm border border-blue-100 dark:border-blue-900/30 relative active:scale-[0.98] transition-transform"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">Челлендж дня</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 pr-6">{challenge.emoji} {challenge.text}</p>
          </div>
          <ChevronRight className="text-gray-300 dark:text-gray-600 absolute top-5 right-5" size={20} />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${Math.min(100, (completedToday / challenge.count) * 100)}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[30px] text-right">{completedToday}/{challenge.count}</span>
        </div>
        
        {completedToday >= challenge.count && (
          <div className="mt-3 text-center">
            <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              ✓ Выполнено!
            </span>
          </div>
        )}
      </button>

      <div className="text-center my-2">
         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Режим отдыха</h2>
         <p className="text-gray-500 text-sm">Как восстановимся?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
            onClick={() => { haptic('light'); store.setHomeMode('GUIDED'); }}
            className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-left shadow-lg shadow-indigo-500/20 transition-transform active:scale-[0.98]"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wand2 size={100} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <Sparkles className="text-white" size={28} />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-white mb-1">Подбор отдыха</h3>
                  <p className="text-indigo-100 text-xs opacity-90 leading-tight">"Подберите мне практику"</p>
              </div>
            </div>
        </button>

        <button
            onClick={() => { haptic('light'); store.setHomeMode('QUICK'); }}
            className="group relative overflow-hidden bg-gradient-to-br from-teal-400 to-emerald-500 rounded-[2rem] p-6 text-left shadow-lg shadow-teal-500/20 transition-transform active:scale-[0.98]"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap size={100} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <Zap className="text-white" size={28} />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-white mb-1">Быстрый режим</h3>
                  <p className="text-teal-50 text-xs opacity-90 leading-tight">"Я сам выберу категорию"</p>
              </div>
            </div>
        </button>
      </div>

      {/* SOS Button */}
      <div className="pt-4">
        <button 
          onClick={() => { haptic('heavy'); store.startSOS(); }}
          className="w-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 rounded-[1.5rem] p-5 transition-all transform active:scale-95 flex items-center justify-center gap-3 focus:outline-none border border-red-100 dark:border-red-900/50"
        >
          <Siren size={24} />
          <span className="text-base font-bold">SOS: Экстренная помощь</span>
        </button>
      </div>
    </motion.div>
  );

  const renderGuidedMode = () => (
    <motion.div
      key="guided"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="space-y-6 pb-36"
    >
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => store.setHomeMode('INITIAL')}
          className="p-3 -ml-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <h2 className="font-bold text-2xl text-gray-800 dark:text-white">Подбор отдыха</h2>
      </div>

      {/* Step 1: Location */}
      <div className="space-y-3 bg-white dark:bg-carddark p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">1</span>
          <label className="text-base font-bold text-gray-700 dark:text-gray-200">
            Где вы сейчас?
          </label>
        </div>
        
        <div className="relative">
          <select 
            value={store.selectedLocation}
            onChange={(e) => {
              haptic('light');
              store.setSelectedLocation(e.target.value as LocationType);
            }}
            className="w-full appearance-none bg-surface dark:bg-darkbg border-none text-gray-900 dark:text-white rounded-2xl py-4 px-5 text-lg font-medium outline-none transition-all cursor-pointer"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {LOCATIONS_MAP[loc].icon} {LOCATIONS_MAP[loc].label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Step 2: Emotion Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold text-sm">2</span>
          <label className="text-base font-bold text-gray-700 dark:text-gray-200">
            Что вы чувствуете?
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {emotions.map((emotion) => {
            const data = EMOTIONS_MAP[emotion];
            return (
              <button
                key={emotion}
                onClick={() => handleEmotionSelect(emotion)}
                className={`relative overflow-hidden group flex flex-col items-center justify-center p-5 rounded-[1.8rem] transition-all duration-300 transform active:scale-95 shadow-sm min-h-[140px] ${data.color} ${data.ring} hover:ring-2 border border-transparent`}
              >
                <span className="text-5xl mb-3 filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                    {data.icon}
                </span>
                <span className="font-bold text-base">
                    {data.label}
                </span>
                <span className="text-[11px] mt-1 opacity-70 font-medium text-center leading-tight">
                    {getEmotionReaction(emotion)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  const renderQuickMode = () => (
    <motion.div
      key="quick"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="space-y-6 pb-36"
    >
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => store.setHomeMode('INITIAL')}
          className="p-3 -ml-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <h2 className="font-bold text-2xl text-gray-800 dark:text-white">Быстрый режим</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {categories.map((cat) => {
           const data = CATEGORIES_MAP[cat];
           return (
             <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`flex items-center gap-5 p-5 rounded-[2rem] transition-transform active:scale-[0.98] shadow-sm ${data.color} bg-opacity-20 dark:bg-opacity-20 border border-transparent`}
             >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-white/60 dark:bg-black/20 shadow-sm`}>
                  {data.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-lg">{data.label}</h4>
                  <p className="text-xs opacity-80 font-medium uppercase tracking-wider">{data.desc}</p>
                </div>
                <div className="bg-white/40 dark:bg-black/10 p-3 rounded-full">
                  <ArrowRight size={20} />
                </div>
             </button>
           );
        })}
      </div>
    </motion.div>
  );

  const renderCategoryList = () => {
    const category = store.selectedCategory;
    if (!category) return null;

    const activities = getActivitiesByCategory(category);
    const categoryData = CATEGORIES_MAP[category];

    return (
      <motion.div
        key="categoryList"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="space-y-4 pb-36"
      >
        <div className="flex items-center gap-2 mb-2">
          <button 
            onClick={() => store.setHomeMode('QUICK')}
            className="p-3 -ml-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="flex items-center gap-2">
             <span className="text-2xl">{categoryData.icon}</span>
             <h2 className="font-bold text-2xl text-gray-800 dark:text-white">{categoryData.label}</h2>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 px-1">
          Выберите практику, которая вам сейчас по душе:
        </p>

        <div className="space-y-3">
          {activities.map(activity => (
            <button
              key={activity.id}
              onClick={() => handleActivitySelect(activity)}
              className="w-full bg-white dark:bg-carddark p-5 rounded-[1.8rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-transform active:scale-[0.98]"
            >
              <div className="w-12 h-12 flex items-center justify-center text-3xl bg-surface dark:bg-surface-dark rounded-2xl">
                {activity.emoji}
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-gray-900 dark:text-white">{activity.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock size={12} />
                    <span>{Math.floor(activity.durationSeconds / 60)} мин</span>
                  </div>
                </div>
              </div>
              {store.favorites.includes(activity.id) && (
                <Heart size={16} className="text-red-500 fill-current" />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="pt-safe px-5">
       {/* Branding - Always Visible */}
       {store.homeMode === 'INITIAL' && (
        <div className="flex flex-col items-center justify-center space-y-2 mb-6 mt-2">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-primary mb-1 animate-float shadow-sm">
            <Hand size={36} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center tracking-tight">
            Привет, друг
            </h1>
        </div>
       )}

       <AnimatePresence mode="wait">
          {store.homeMode === 'INITIAL' && renderInitialMode()}
          {store.homeMode === 'GUIDED' && renderGuidedMode()}
          {store.homeMode === 'QUICK' && renderQuickMode()}
          {store.homeMode === 'CATEGORY_LIST' && renderCategoryList()}
       </AnimatePresence>
    </div>
  );
};

export default HomeView;
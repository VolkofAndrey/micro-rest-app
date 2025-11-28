import React, { useState } from 'react';
import { Home, History as HistoryIcon, Heart, ArrowLeft, Sun, Moon, Leaf, User, X, Sparkles, Zap, Siren } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { haptic } from './utils';

export const NavigationBar = ({ currentView, onChange, onHomeClick }: { currentView: string, onChange: (v: any) => void, onHomeClick?: () => void }) => {
  const navItems = [
    { id: 'HOME', icon: Home, label: 'Главная', action: onHomeClick ? onHomeClick : () => onChange('HOME') },
    { id: 'HISTORY', icon: HistoryIcon, label: 'История', action: () => onChange('HISTORY') },
    { id: 'FAVORITES', icon: Heart, label: 'Избранное', action: () => onChange('FAVORITES') },
    { id: 'PROFILE', icon: User, label: 'Профиль', action: () => onChange('PROFILE') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface/95 dark:bg-carddark/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800 pb-safe pt-2 z-50">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => { 
                haptic('light'); 
                item.action();
              }}
              className="flex flex-col items-center justify-center w-full gap-1 group"
              aria-label={item.label}
            >
              <div className={`relative px-5 py-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-transparent'}`}>
                <item.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} 
                />
              </div>
              <span className={`text-[11px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const Header = ({ title, showBack, onBack, isDarkMode, toggleTheme, onChangeView }: any) => (
  <header className="sticky top-0 bg-surface/90 dark:bg-darkbg/90 backdrop-blur-md z-40 px-5 pt-safe pb-4 flex items-center justify-between border-b border-transparent transition-all">
    <div className="flex items-center gap-4 w-full">
      {showBack ? (
        <button 
          onClick={() => { haptic('light'); onBack(); }}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
      ) : (
        <div className="w-2"></div> // Spacer for alignment if no back button
      )}
      
      <h1 className={`text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex-1 ${showBack ? 'text-left' : 'text-left -ml-2'}`}>
        {title}
      </h1>
    </div>
  </header>
);

export const OnboardingModal = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: <Sparkles size={48} className="text-indigo-500" />,
      title: "Добро пожаловать в Микро-отдых",
      desc: "2-минутные практики для эмоциональной разгрузки"
    },
    {
      icon: <Sparkles size={48} className="text-purple-500" />,
      title: "Подбор отдыха",
      desc: "Скажи, как себя чувствуешь — мы подберём технику"
    },
    {
      icon: <Zap size={48} className="text-teal-500" />,
      title: "Быстрый режим",
      desc: "Знаешь, какой тип отдыха нужен? Выбирай сразу"
    },
    {
      icon: <Siren size={48} className="text-red-500" />,
      title: "SOS-кнопка",
      desc: "Паника? Нажми красную кнопку — мгновенная помощь"
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div 
        className="bg-surface dark:bg-carddark rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <button 
          onClick={onComplete}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="text-center min-h-[200px] flex flex-col justify-center"
          >
            <div className="flex justify-center mb-6">
              {slides[step].icon}
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{slides[step].title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{slides[step].desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i === step ? 'bg-primary w-6' : 'bg-gray-300 dark:bg-gray-700'} transition-all`}
              />
            ))}
          </div>

          {step < slides.length - 1 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/30"
            >
              Далее
            </button>
          ) : (
            <button 
              onClick={onComplete}
              className="px-6 py-2 bg-green-500 text-white rounded-full font-medium shadow-lg shadow-green-500/30"
            >
              Понятно!
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
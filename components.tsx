import React, { useState } from 'react';
import { Home, History as HistoryIcon, Heart, ArrowLeft, Sun, Moon, Leaf, User, X, Sparkles, Zap, Siren } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { haptic } from './utils';

export const NavigationBar = ({ currentView, onChange }: { currentView: string, onChange: (v: any) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-carddark/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 pb-safe-area pt-2 px-6 flex justify-between items-center z-50 h-20 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] rounded-t-3xl">
    <button 
      onClick={() => { haptic('light'); onChange('HOME'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${currentView === 'HOME' ? 'text-primary' : 'text-gray-300 dark:text-gray-600'}`}
      aria-label="Главная"
    >
      <Home size={26} strokeWidth={currentView === 'HOME' ? 2.5 : 2} />
      {currentView === 'HOME' && <span className="w-1 h-1 rounded-full bg-primary"></span>}
    </button>
    <button 
      onClick={() => { haptic('light'); onChange('HISTORY'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${currentView === 'HISTORY' ? 'text-primary' : 'text-gray-300 dark:text-gray-600'}`}
      aria-label="История"
    >
      <HistoryIcon size={26} strokeWidth={currentView === 'HISTORY' ? 2.5 : 2} />
      {currentView === 'HISTORY' && <span className="w-1 h-1 rounded-full bg-primary"></span>}
    </button>
    <button 
      onClick={() => { haptic('light'); onChange('FAVORITES'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${currentView === 'FAVORITES' ? 'text-primary' : 'text-gray-300 dark:text-gray-600'}`}
      aria-label="Избранное"
    >
      <Heart size={26} strokeWidth={currentView === 'FAVORITES' ? 2.5 : 2} />
      {currentView === 'FAVORITES' && <span className="w-1 h-1 rounded-full bg-primary"></span>}
    </button>
     <button 
      onClick={() => { haptic('light'); onChange('PROFILE'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${currentView === 'PROFILE' ? 'text-primary' : 'text-gray-300 dark:text-gray-600'}`}
      aria-label="Профиль"
    >
      <User size={26} strokeWidth={currentView === 'PROFILE' ? 2.5 : 2} />
      {currentView === 'PROFILE' && <span className="w-1 h-1 rounded-full bg-primary"></span>}
    </button>
  </div>
);

export const Header = ({ title, showBack, onBack, isDarkMode, toggleTheme, onChangeView }: any) => (
  <header className="sticky top-0 bg-gray-50/80 dark:bg-darkbg/80 backdrop-blur-md z-40 px-5 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {showBack ? (
        <button 
          onClick={() => { haptic('light'); onBack(); }}
          className="p-2 -ml-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
          aria-label="Назад"
        >
          <ArrowLeft size={22} className="text-gray-700 dark:text-gray-200" />
        </button>
      ) : (
        <div className="p-1.5 bg-primary rounded-lg text-white shadow-lg shadow-primary/30">
           <Leaf size={18} fill="currentColor" />
        </div>
      )}
      <h1 className="text-xl font-bold text-gray-800 dark:text-white truncate max-w-[200px] tracking-tight">{title}</h1>
    </div>
    
    <div className="flex items-center gap-2">
      <button 
        onClick={() => { haptic('light'); onChangeView('PROFILE'); }}
        className="p-2.5 rounded-full bg-white dark:bg-carddark text-gray-400 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700 hover:text-primary transition-colors"
        aria-label="Профиль"
      >
        <User size={20} />
      </button>
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
        className="bg-white dark:bg-carddark rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
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
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store';
import { Header, NavigationBar, OnboardingModal } from './components';

// Lazy load views for better performance
const HomeView = lazy(() => import('./views/HomeView'));
const ActivityView = lazy(() => import('./views/ActivityView'));
const HistoryView = lazy(() => import('./views/HistoryView'));
const FavoritesView = lazy(() => import('./views/FavoritesView'));
const ProfileView = lazy(() => import('./views/ProfileView'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center h-full text-primary">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const store = useAppStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('microrest_onboarding_done');
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const getTitle = () => {
    switch(store.currentView) {
      case 'HOME': return 'MicroRest';
      case 'HISTORY': return 'История';
      case 'FAVORITES': return 'Избранное';
      case 'ACTIVITY': return 'Практика';
      case 'PROFILE': return 'Профиль';
      default: return 'App';
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300 font-sans ${store.isDarkMode ? 'dark' : ''}`}>
      
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal 
            onComplete={() => {
              localStorage.setItem('microrest_onboarding_done', 'true');
              setShowOnboarding(false);
            }} 
          />
        )}
      </AnimatePresence>

      <Header 
        title={getTitle()} 
        showBack={store.currentView === 'ACTIVITY'}
        onBack={() => store.setCurrentView('HOME')}
        isDarkMode={store.isDarkMode}
        toggleTheme={() => store.setIsDarkMode(!store.isDarkMode)}
        onChangeView={store.setCurrentView}
      />
      
      <main className="flex-1 relative max-w-md mx-auto w-full bg-gray-50 dark:bg-darkbg min-h-screen overflow-hidden">
        <Suspense fallback={<Loading />}>
          <AnimatePresence mode="wait">
            {store.currentView === 'HOME' && <HomeView key="home" store={store} />}
            {store.currentView === 'ACTIVITY' && <ActivityView key="activity" store={store} />}
            {store.currentView === 'HISTORY' && <HistoryView key="history" store={store} />}
            {store.currentView === 'FAVORITES' && <FavoritesView key="favorites" store={store} />}
            {store.currentView === 'PROFILE' && <ProfileView key="profile" store={store} />}
          </AnimatePresence>
        </Suspense>
      </main>

      {store.currentView !== 'ACTIVITY' && (
        <div className="max-w-md mx-auto w-full relative">
           <NavigationBar currentView={store.currentView} onChange={store.setCurrentView} />
        </div>
      )}
    </div>
  );
}
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store';
import { Header, NavigationBar, OnboardingModal } from './components';
import { getActivityById } from './data';

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
    // Onboarding Check
    const hasOnboarded = localStorage.getItem('microrest_onboarding_done');
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }

    // Deep Link Handling (Web equivalent)
    const handleDeepLink = () => {
      const params = new URLSearchParams(window.location.search);
      const activityId = params.get('activity');
      if (activityId) {
        const activity = getActivityById(activityId);
        if (activity) {
          store.setSelectedActivity(activity);
          store.setCurrentView('ACTIVITY');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleDeepLink();
  }, []);

  const handleHomeClick = () => {
    store.setHomeMode('INITIAL');
    store.setCurrentView('HOME');
  };

  return (
    <div className={`h-full w-full bg-surface dark:bg-darkbg text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300 font-sans ${store.isDarkMode ? 'dark' : ''}`}>
      
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

      {/* Header is only shown for Activity View now */}
      {store.currentView === 'ACTIVITY' && (
        <Header 
          title="Практика" 
          showBack={true}
          onBack={() => store.setCurrentView('HOME')}
          isDarkMode={store.isDarkMode}
          toggleTheme={() => store.setIsDarkMode(!store.isDarkMode)}
          onChangeView={store.setCurrentView}
        />
      )}
      
      <main className="flex-1 w-full max-w-lg mx-auto overflow-hidden relative">
        <div className="h-full overflow-y-auto no-scrollbar scroll-smooth">
            <Suspense fallback={<Loading />}>
            <AnimatePresence mode="wait">
                {store.currentView === 'HOME' && <HomeView key="home" store={store} />}
                {store.currentView === 'ACTIVITY' && <ActivityView key="activity" store={store} />}
                {store.currentView === 'HISTORY' && <HistoryView key="history" store={store} />}
                {store.currentView === 'FAVORITES' && <FavoritesView key="favorites" store={store} />}
                {store.currentView === 'PROFILE' && <ProfileView key="profile" store={store} />}
            </AnimatePresence>
            </Suspense>
        </div>
      </main>

      {store.currentView !== 'ACTIVITY' && (
        <div className="w-full max-w-lg mx-auto">
           <NavigationBar 
             currentView={store.currentView} 
             onChange={store.setCurrentView} 
             onHomeClick={handleHomeClick}
           />
        </div>
      )}
    </div>
  );
}
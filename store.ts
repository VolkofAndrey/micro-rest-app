import { useState, useEffect } from 'react';
import { HistoryEntry, LocationType, ViewState, Activity, Emotion, HomeMode } from './types';
import { ACTIVITIES } from './data';

const STORAGE_KEYS = {
  HISTORY: 'microrest_history',
  FAVORITES: 'microrest_favorites',
  THEME: 'microrest_theme',
  LAST_USED: 'microrest_last_used',
  STREAK: 'microrest_streak',
  LAST_ACTIVITY_DATE: 'microrest_last_activity_date',
};

export const useAppStore = () => {
  // State
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [homeMode, setHomeMode] = useState<HomeMode>('INITIAL');
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('HOME');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [lastUsedIds, setLastUsedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_USED);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STREAK);
      return stored ? parseInt(stored) : 0;
    } catch { return 0; }
  });

  const [lastActivityDate, setLastActivityDate] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY_DATE) || '';
    } catch { return ''; }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
     try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      return stored === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch { return false; }
  });

  // Effects for persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAST_USED, JSON.stringify(lastUsedIds));
  }, [lastUsedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STREAK, String(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY_DATE, lastActivityDate);
  }, [lastActivityDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Reset Home Mode when leaving home
  useEffect(() => {
    if (currentView !== 'HOME') {
       // Optional reset logic
    }
  }, [currentView]);

  // Actions
  const addToHistory = (activityId: string, emotion: Emotion | 'SOS' | 'QUICK', location: LocationType | 'SOS' | 'QUICK') => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      activityId,
      timestamp: Date.now(),
      emotion,
      location,
    };
    setHistory(prev => [newEntry, ...prev]);

    // Update Last Used (Smart Memory) - Keep last 5
    setLastUsedIds(prev => {
      const newQueue = [activityId, ...prev.filter(id => id !== activityId)];
      return newQueue.slice(0, 5);
    });

    // Update Streak
    const today = new Date().toDateString();
    if (lastActivityDate === today) {
      // Already active today, do nothing for streak
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastActivityDate === yesterday) {
        // Continue streak
        setStreak(prev => prev + 1);
      } else {
        // Reset streak (or start new)
        setStreak(1);
      }
      setLastActivityDate(today);
    }
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const toggleFavorite = (activityId: string) => {
    setFavorites(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      }
      return [...prev, activityId];
    });
  };

  const startSOS = () => {
    const sosActivities = ACTIVITIES.filter(a => a.isSOS);
    // For SOS we pick purely random to be fast
    const randomSOS = sosActivities[Math.floor(Math.random() * sosActivities.length)];
    if (randomSOS) {
      setSelectedActivity(randomSOS);
      setCurrentView('ACTIVITY');
    }
  };

  // Smart Recommendation Algorithm
  const getSmartRecommendation = (candidates: Activity[]): Activity | null => {
    if (candidates.length === 0) return null;
    
    // 1. Filter out activities that were used recently (in lastUsedIds)
    const freshCandidates = candidates.filter(a => !lastUsedIds.includes(a.id));

    // 2. If we have fresh candidates, pick one of them randomly
    if (freshCandidates.length > 0) {
      return freshCandidates[Math.floor(Math.random() * freshCandidates.length)];
    }

    // 3. If all candidates are "stale" (user exhausted the pool), pick any random one
    // This ensures we always return something
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  return {
    currentView,
    setCurrentView,
    homeMode,
    setHomeMode,
    selectedLocation,
    setSelectedLocation,
    selectedActivity,
    setSelectedActivity,
    history,
    addToHistory,
    removeFromHistory,
    favorites,
    toggleFavorite,
    isDarkMode,
    setIsDarkMode,
    startSOS,
    getSmartRecommendation,
    streak,
    lastActivityDate
  };
};
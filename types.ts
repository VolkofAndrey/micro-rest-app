export type Emotion = 'SAD' | 'ANGRY' | 'ANXIOUS' | 'BORED' | 'TIRED' | 'GOOD';
export type LocationType = 'HOME' | 'WORK' | 'TRANSPORT' | 'PUBLIC' | 'NATURE';
export type ActivityCategory = 'BREATHING' | 'VISUAL' | 'MOVEMENT' | 'FOCUS' | 'MEDITATION' | 'AUDIO';

export interface Activity {
  id: string;
  title: string;
  emoji: string;
  steps: string[];
  durationSeconds: number;
  science: string; // Scientific explanation
  category: ActivityCategory; // New field for Quick Mode
  tags: {
    emotions: Emotion[];
    locations: LocationType[];
  };
  isSOS?: boolean;
  audioUrl?: string;
}

export interface HistoryEntry {
  id: string;
  activityId: string;
  timestamp: number;
  emotion: Emotion | 'SOS' | 'QUICK';
  location: LocationType | 'SOS' | 'QUICK';
}

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  requirement: number;
}

export interface DailyChallenge {
  emoji: string;
  text: string;
  count: number;
  category: ActivityCategory;
}

export type ViewState = 'HOME' | 'ACTIVITY' | 'HISTORY' | 'FAVORITES' | 'PROFILE';
export type HomeMode = 'INITIAL' | 'GUIDED' | 'QUICK' | 'CATEGORY_LIST';

export interface AppState {
  currentView: ViewState;
  homeMode: HomeMode;
  selectedLocation: LocationType;
  selectedCategory: ActivityCategory | null;
  selectedActivity: Activity | null;
  history: HistoryEntry[];
  favorites: string[]; // List of activity IDs
  isDarkMode: boolean;
  lastUsedIds: string[]; // Memory for smart recommendation
  streak: number;
  lastActivityDate: string;
}
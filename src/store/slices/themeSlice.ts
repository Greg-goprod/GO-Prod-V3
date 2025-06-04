import { StateCreator } from 'zustand';
import { StoreState } from '../types';

export interface ThemeSlice {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// SSR-safe dark mode initialization
const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false; // Default for SSR
  
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) {
    return savedMode === 'true';
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
};

// Apply dark mode class in a SSR-safe way
export const applyDarkMode = (isDark: boolean): void => {
  if (typeof document === 'undefined') return; // SSR guard
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Get initial value safely
export const initialDarkMode = getInitialDarkMode();

// Apply initial theme
if (typeof window !== 'undefined') {
  applyDarkMode(initialDarkMode);
}

export const createThemeSlice: StateCreator<
  StoreState,
  [],
  [],
  ThemeSlice
> = (set) => ({
  isDarkMode: initialDarkMode,
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      applyDarkMode(newDarkMode);
      return { isDarkMode: newDarkMode };
    });
  },
}); 
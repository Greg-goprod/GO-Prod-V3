import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createThemeSlice, ThemeSlice } from './slices/themeSlice';
import { createLanguageSlice, LanguageSlice } from './slices/languageSlice';
import { createEventSlice, EventSlice } from './slices/eventSlice';
import { createViewSlice, ViewSlice } from './slices/viewSlice';
import { createDataSlice, DataSlice } from './slices/dataSlice';
import { StoreState } from './types';

/**
 * Store global de l'application
 * Utilise une architecture modulaire avec des slices
 */
export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createThemeSlice(...a),
      ...createLanguageSlice(...a),
      ...createEventSlice(...a),
      ...createViewSlice(...a),
      ...createDataSlice(...a),
    }),
    {
      name: 'go-prod-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        language: state.language,
        currentEvent: state.currentEvent,
      }),
    }
  )
);
import { StateCreator } from 'zustand';
import { StoreState } from '../types';

export interface LanguageSlice {
  language: string;
  setLanguage: (language: string) => void;
}

export const createLanguageSlice: StateCreator<
  StoreState,
  [],
  [],
  LanguageSlice
> = (set) => ({
  language: 'fr',
  setLanguage: (language) => set({ language }),
}); 
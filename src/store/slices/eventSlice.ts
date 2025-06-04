import { StateCreator } from 'zustand';
import { StoreState } from '../types';

export interface Event {
  id: string;
  name: string;
  days: {
    id: string;
    date: string;
    open_time?: string;
    close_time?: string;
  }[];
}

export interface EventSlice {
  currentEvent: Event | null;
  setCurrentEvent: (event: Event | null) => void;
}

export const createEventSlice: StateCreator<
  StoreState,
  [],
  [],
  EventSlice
> = (set) => ({
  currentEvent: null,
  setCurrentEvent: (event) => set({ currentEvent: event }),
}); 
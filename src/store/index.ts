import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { artists, contacts, drivers, vehicles, shifts } from '../data/mockData';
import { Artist, Contact, Driver, Vehicle, Shift, ViewMode } from '../types';

interface Event {
  id: string;
  name: string;
  days: {
    id: string;
    date: string;
    open_time?: string;
    close_time?: string;
  }[];
}

// Type definitions for store slices
interface ThemeSlice {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface LanguageSlice {
  language: string;
  setLanguage: (language: string) => void;
}

interface EventSlice {
  currentEvent: Event | null;
  setCurrentEvent: (event: Event | null) => void;
}

interface DataSlice {
  artists: Artist[];
  contacts: Contact[];
  drivers: Driver[];
  vehicles: Vehicle[];
  shifts: Shift[];
  
  addArtist: (artist: Omit<Artist, 'id'>) => void;
  updateArtist: (id: string, artist: Partial<Artist>) => void;
  deleteArtist: (id: string) => void;
  
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  assignDriverToShift: (shiftId: string, driverId: string | undefined) => void;
}

interface ViewSlice {
  artistsViewMode: ViewMode;
  contactsViewMode: ViewMode;
  driversViewMode: ViewMode;
  setArtistsViewMode: (mode: ViewMode) => void;
  setContactsViewMode: (mode: ViewMode) => void;
  setDriversViewMode: (mode: ViewMode) => void;
}

// Combined store type
type Store = ThemeSlice & LanguageSlice & EventSlice & DataSlice & ViewSlice;

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

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
const applyDarkMode = (isDark: boolean): void => {
  if (typeof document === 'undefined') return; // SSR guard
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Get initial value safely
const initialDarkMode = getInitialDarkMode();

// Apply initial theme
if (typeof window !== 'undefined') {
  applyDarkMode(initialDarkMode);
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Theme slice
      isDarkMode: initialDarkMode,
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          applyDarkMode(newDarkMode);
          return { isDarkMode: newDarkMode };
        });
      },

      // Language slice
      language: 'fr',
      setLanguage: (language) => set({ language }),

      // Event slice
      currentEvent: null,
      setCurrentEvent: (event) => set({ currentEvent: event }),

      // Data slice (with initial data)
      artists,
      contacts,
      drivers,
      vehicles,
      shifts,

      // View state slice
      artistsViewMode: 'grid',
      contactsViewMode: 'list',
      driversViewMode: 'list',
      setArtistsViewMode: (mode) => set({ artistsViewMode: mode }),
      setContactsViewMode: (mode) => set({ contactsViewMode: mode }),
      setDriversViewMode: (mode) => set({ driversViewMode: mode }),
      
      // Artist actions
      addArtist: (artist) => set((state) => ({
        artists: [...state.artists, { id: generateId(), ...artist }]
      })),
      updateArtist: (id, artist) => set((state) => ({
        artists: state.artists.map((a) => a.id === id ? { ...a, ...artist } : a)
      })),
      deleteArtist: (id) => set((state) => ({
        artists: state.artists.filter((a) => a.id !== id)
      })),

      // Contact actions
      addContact: (contact) => set((state) => ({
        contacts: [...state.contacts, { id: generateId(), ...contact }]
      })),
      updateContact: (id, contact) => set((state) => ({
        contacts: state.contacts.map((c) => c.id === id ? { ...c, ...contact } : c)
      })),
      deleteContact: (id) => set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id)
      })),

      // Driver actions
      addDriver: (driver) => set((state) => ({
        drivers: [...state.drivers, { id: generateId(), ...driver }]
      })),
      updateDriver: (id, driver) => set((state) => ({
        drivers: state.drivers.map((d) => d.id === id ? { ...d, ...driver } : d)
      })),
      deleteDriver: (id) => set((state) => ({
        drivers: state.drivers.filter((d) => d.id !== id)
      })),

      // Vehicle actions
      addVehicle: (vehicle) => set((state) => ({
        vehicles: [...state.vehicles, { id: generateId(), ...vehicle }]
      })),
      updateVehicle: (id, vehicle) => set((state) => ({
        vehicles: state.vehicles.map((v) => v.id === id ? { ...v, ...vehicle } : v)
      })),
      deleteVehicle: (id) => set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id)
      })),

      // Shift actions
      addShift: (shift) => set((state) => ({
        shifts: [...state.shifts, { id: generateId(), ...shift }]
      })),
      updateShift: (id, shift) => set((state) => ({
        shifts: state.shifts.map((s) => s.id === id ? { ...s, ...shift } : s)
      })),
      deleteShift: (id) => set((state) => ({
        shifts: state.shifts.filter((s) => s.id !== id)
      })),
      assignDriverToShift: (shiftId, driverId) => set((state) => ({
        shifts: state.shifts.map((s) => 
          s.id === shiftId ? { ...s, driverId } : s
        )
      })),
    }),
    {
      name: 'go-ground-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        language: state.language,
        currentEvent: state.currentEvent
      })
    }
  )
);
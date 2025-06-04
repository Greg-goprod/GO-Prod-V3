import { StateCreator } from 'zustand';
import { StoreState } from '../types';
import { artists as initialArtists, contacts as initialContacts, drivers as initialDrivers, vehicles as initialVehicles, shifts as initialShifts } from '../../data/mockData';
import { Artist, Contact, Driver, Vehicle, Shift } from '../../types';

export interface DataSlice {
  // Données
  artists: Artist[];
  contacts: Contact[];
  drivers: Driver[];
  vehicles: Vehicle[];
  shifts: Shift[];
  
  // Actions pour les artistes
  addArtist: (artist: Omit<Artist, 'id'>) => void;
  updateArtist: (id: string, artist: Partial<Artist>) => void;
  deleteArtist: (id: string) => void;
  
  // Actions pour les contacts
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  // Actions pour les chauffeurs
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  
  // Actions pour les véhicules
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  // Actions pour les shifts
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  assignDriverToShift: (shiftId: string, driverId: string | undefined) => void;
}

// Helper function to generate unique IDs
const generateId = (): string => Math.random().toString(36).substring(2, 9);

export const createDataSlice: StateCreator<
  StoreState,
  [],
  [],
  DataSlice
> = (set) => ({
  // Données initiales
  artists: initialArtists,
  contacts: initialContacts,
  drivers: initialDrivers,
  vehicles: initialVehicles,
  shifts: initialShifts,
  
  // Actions pour les artistes
  addArtist: (artist) => set((state) => ({
    artists: [...state.artists, { id: generateId(), ...artist }]
  })),
  updateArtist: (id, artist) => set((state) => ({
    artists: state.artists.map((a) => a.id === id ? { ...a, ...artist } : a)
  })),
  deleteArtist: (id) => set((state) => ({
    artists: state.artists.filter((a) => a.id !== id)
  })),
  
  // Actions pour les contacts
  addContact: (contact) => set((state) => ({
    contacts: [...state.contacts, { id: generateId(), ...contact }]
  })),
  updateContact: (id, contact) => set((state) => ({
    contacts: state.contacts.map((c) => c.id === id ? { ...c, ...contact } : c)
  })),
  deleteContact: (id) => set((state) => ({
    contacts: state.contacts.filter((c) => c.id !== id)
  })),
  
  // Actions pour les chauffeurs
  addDriver: (driver) => set((state) => ({
    drivers: [...state.drivers, { id: generateId(), ...driver }]
  })),
  updateDriver: (id, driver) => set((state) => ({
    drivers: state.drivers.map((d) => d.id === id ? { ...d, ...driver } : d)
  })),
  deleteDriver: (id) => set((state) => ({
    drivers: state.drivers.filter((d) => d.id !== id)
  })),
  
  // Actions pour les véhicules
  addVehicle: (vehicle) => set((state) => ({
    vehicles: [...state.vehicles, { id: generateId(), ...vehicle }]
  })),
  updateVehicle: (id, vehicle) => set((state) => ({
    vehicles: state.vehicles.map((v) => v.id === id ? { ...v, ...vehicle } : v)
  })),
  deleteVehicle: (id) => set((state) => ({
    vehicles: state.vehicles.filter((v) => v.id !== id)
  })),
  
  // Actions pour les shifts
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
}); 
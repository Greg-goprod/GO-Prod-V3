import { StateCreator } from 'zustand';
import { StoreState } from '../types';

export type ViewMode = 'list' | 'grid' | 'calendar';

export interface ViewSlice {
  artistsViewMode: ViewMode;
  contactsViewMode: ViewMode;
  driversViewMode: ViewMode;
  vehiclesViewMode: ViewMode;
  missionsViewMode: ViewMode;
  shiftsViewMode: ViewMode;
  
  setArtistsViewMode: (mode: ViewMode) => void;
  setContactsViewMode: (mode: ViewMode) => void;
  setDriversViewMode: (mode: ViewMode) => void;
  setVehiclesViewMode: (mode: ViewMode) => void;
  setMissionsViewMode: (mode: ViewMode) => void;
  setShiftsViewMode: (mode: ViewMode) => void;
}

export const createViewSlice: StateCreator<
  StoreState,
  [],
  [],
  ViewSlice
> = (set) => ({
  artistsViewMode: 'grid',
  contactsViewMode: 'list',
  driversViewMode: 'list',
  vehiclesViewMode: 'grid',
  missionsViewMode: 'list',
  shiftsViewMode: 'calendar',
  
  setArtistsViewMode: (mode) => set({ artistsViewMode: mode }),
  setContactsViewMode: (mode) => set({ contactsViewMode: mode }),
  setDriversViewMode: (mode) => set({ driversViewMode: mode }),
  setVehiclesViewMode: (mode) => set({ vehiclesViewMode: mode }),
  setMissionsViewMode: (mode) => set({ missionsViewMode: mode }),
  setShiftsViewMode: (mode) => set({ shiftsViewMode: mode }),
}); 
export type Scene = 'MAINSTAGE' | 'RIVERSTAGE' | 'LA GRANGE';

export type Artist = {
  id: string;
  name: string;
  spotifyUrl: string;
  performanceDate?: string;
  scene?: Scene;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
}

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  function: string;
  functionId: string;
  artistId?: string;
}

export type Language = string;

export type TShirtSize = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'XXXXL';

export type DriverPermit = 'A' | 'A1' | 'B' | 'B1' | 'BE' | 'C' | 'C1' | 'C1E' | 'CE' | 'D' | 'D1' | 'D1E' | 'DE' | 'F' | 'G' | 'M' | 'TPP 121' | 'TPP 122';

export type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  birthDate: string;
  languages: Language[];
  tShirtSize: TShirtSize;
  hiredSince: number;
  permits: DriverPermit[];
  notes?: string;
}

export type VehicleType = 'Van' | 'Sedan' | 'SUV' | 'Minibus' | 'Limousine' | 'Bus' | string;

export type FuelType = 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid' | string;

export type VehicleStatus = 'Available' | 'Unavailable' | 'Maintenance';

export type VehicleCheckLog = {
  date: string;
  kilometers: number;
  defects?: string;
  notes?: string;
}

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  type: VehicleType;
  color: string;
  passenger_capacity: number;
  luggage_capacity: number;
  engagement_number: string;
  registration_number: string;
  fuel_type: FuelType;
  additional_equipment?: string[];
  supplier?: string;
  status: VehicleStatus;
  reception?: VehicleCheckLog;
  return?: VehicleCheckLog;
}

export type ShiftColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';

export type Shift = {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  driverIds?: string[];
  color?: ShiftColor;
}

export type ViewMode = 'grid' | 'list';

export type EventType = 'Concert' | 'Festival' | 'Corporate' | 'Private' | 'Other';

export type EventStatus = 'Draft' | 'Confirmed' | 'Cancelled' | 'Completed';

export type Event = {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  startDateTime?: string | Date;
  endDateTime?: string | Date;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  isAllDay?: boolean;
};
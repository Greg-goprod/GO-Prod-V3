import { Artist, Contact, Driver, Vehicle, Shift } from '../types';

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Adele',
    spotifyUrl: 'https://open.spotify.com/artist/4dpARuHxo51G3z768sgnrY',
    instagramUrl: 'https://instagram.com/adele',
    facebookUrl: 'https://facebook.com/adele',
    twitterUrl: 'https://twitter.com/adele',
    youtubeUrl: 'https://youtube.com/adele'
  },
  {
    id: '2',
    name: 'Ed Sheeran',
    spotifyUrl: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V',
    instagramUrl: 'https://instagram.com/edsheeran',
    facebookUrl: 'https://facebook.com/edsheeran',
    twitterUrl: 'https://twitter.com/edsheeran',
    youtubeUrl: 'https://youtube.com/edsheeran'
  }
];

export const contacts: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    function: 'Tour Manager',
    artistId: '1'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 987-6543',
    function: 'PR Manager',
    artistId: '2'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 456-7890',
    function: 'Agent',
    artistId: '3'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 789-0123',
    function: 'Event Coordinator'
  }
];

export const drivers: Driver[] = [
  {
    id: '1',
    firstName: 'James',
    lastName: 'Wilson',
    street: '123 Main St',
    postalCode: '10001',
    city: 'New York',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 234-5678',
    birthDate: '1985-03-15',
    languages: ['English', 'French', 'Spanish'],
    tShirtSize: 'L',
    hiredSince: 2018,
    permits: ['B', 'C', 'D'],
    notes: 'Experienced with VIP clients'
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Garcia',
    street: '456 Oak Ave',
    postalCode: '90210',
    city: 'Los Angeles',
    email: 'maria.garcia@example.com',
    phone: '+1 (555) 345-6789',
    birthDate: '1990-07-22',
    languages: ['English', 'Spanish', 'Portuguese'],
    tShirtSize: 'M',
    hiredSince: 2020,
    permits: ['B', 'BE'],
    notes: 'Preferred for long-distance trips'
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Chen',
    street: '789 Pine Rd',
    postalCode: '94107',
    city: 'San Francisco',
    email: 'robert.chen@example.com',
    phone: '+1 (555) 456-7890',
    birthDate: '1988-11-10',
    languages: ['English', 'Mandarin', 'French'],
    tShirtSize: 'XL',
    hiredSince: 2017,
    permits: ['B', 'C', 'CE'],
    notes: 'Specialized in luxury vehicles'
  }
];

export const vehicles: Vehicle[] = [
  {
    id: '1',
    brand: 'Mercedes-Benz',
    model: 'S-Class',
    type: 'Sedan',
    color: 'Black',
    passengerCapacity: 4,
    luggageCapacity: 3,
    engagementNumber: 'V001',
    registrationNumber: 'ABC123',
    fuelType: 'Diesel',
    additionalEquipment: 'Leather seats, mini-bar, Wi-Fi',
    supplier: 'Luxury Fleet Co.',
    status: 'Available',
    reception: {
      date: '2023-01-15',
      kilometers: 25000,
      notes: 'Vehicle in excellent condition'
    }
  },
  {
    id: '2',
    brand: 'Toyota',
    model: 'Hiace',
    type: 'Van',
    color: 'White',
    passengerCapacity: 8,
    luggageCapacity: 10,
    engagementNumber: 'V002',
    registrationNumber: 'XYZ789',
    fuelType: 'Diesel',
    additionalEquipment: 'Cargo space divider, roof rack',
    supplier: 'TransportPro',
    status: 'Available',
    reception: {
      date: '2023-02-20',
      kilometers: 15000,
      notes: 'New tires installed'
    }
  },
  {
    id: '3',
    brand: 'BMW',
    model: 'X5',
    type: 'SUV',
    color: 'Silver',
    passengerCapacity: 5,
    luggageCapacity: 6,
    engagementNumber: 'V003',
    registrationNumber: 'DEF456',
    fuelType: 'Hybrid',
    additionalEquipment: 'Panoramic roof, premium sound system',
    supplier: 'Elite Motors',
    status: 'Maintenance',
    reception: {
      date: '2023-03-10',
      kilometers: 30000,
      defects: 'Scratch on rear bumper',
      notes: 'Scheduled for maintenance on 2023-04-01'
    }
  }
];

export const shifts: Shift[] = [
  {
    id: '1',
    startDateTime: '2023-04-15T08:00:00',
    endDateTime: '2023-04-15T16:00:00',
    driverId: '1'
  },
  {
    id: '2',
    startDateTime: '2023-04-15T16:00:00',
    endDateTime: '2023-04-16T00:00:00',
    driverId: '2'
  },
  {
    id: '3',
    startDateTime: '2023-04-16T00:00:00',
    endDateTime: '2023-04-16T08:00:00',
    driverId: '3'
  },
  {
    id: '4',
    startDateTime: '2023-04-16T08:00:00',
    endDateTime: '2023-04-16T16:00:00'
  }
];
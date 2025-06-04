import { artistService } from './artistService';
import { vehicleService } from './vehicleService';

/**
 * Services API pour interagir avec Supabase
 */
export const apiService = {
  artists: artistService,
  vehicles: vehicleService,
  // Ajoutez d'autres services ici au fur et à mesure
};

// Export pour un accès direct aux services
export { artistService } from './artistService';
export { vehicleService } from './vehicleService'; 
import { BaseService } from './baseService';
import { Vehicle } from '../../types';

/**
 * Service pour gérer les opérations API liées aux véhicules
 */
export class VehicleService extends BaseService<Vehicle> {
  constructor() {
    super('vehicles');
  }
  
  /**
   * Récupère les véhicules disponibles pour une période donnée
   */
  async getAvailableVehicles(startDate: string, endDate: string): Promise<Vehicle[]> {
    // Cette requête est complexe et pourrait nécessiter une fonction RPC dans Supabase
    // Ici, on simplifie en récupérant tous les véhicules pour l'exemple
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('is_available', true);

    if (error) {
      console.error('Erreur lors de la récupération des véhicules disponibles:', error);
      throw error;
    }

    return data as Vehicle[];
  }
  
  /**
   * Récupère les véhicules par type
   */
  async getVehiclesByType(typeId: string): Promise<Vehicle[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('type_id', typeId);

    if (error) {
      console.error('Erreur lors de la récupération des véhicules par type:', error);
      throw error;
    }

    return data as Vehicle[];
  }
  
  /**
   * Marque un véhicule comme indisponible
   */
  async setVehicleUnavailable(vehicleId: string, reason: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .update({ 
        is_available: false,
        unavailable_reason: reason
      })
      .eq('id', vehicleId);

    if (error) {
      console.error('Erreur lors de la mise à jour de la disponibilité du véhicule:', error);
      throw error;
    }
  }
}

// Instance unique exportée
export const vehicleService = new VehicleService(); 
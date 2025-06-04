import { BaseService } from './baseService';
import { Artist } from '../../types';

/**
 * Service pour gérer les opérations API liées aux artistes
 */
export class ArtistService extends BaseService<Artist> {
  constructor() {
    super('artists');
  }
  
  /**
   * Récupère les artistes avec les détails de leur statut
   */
  async getArtistsWithStatus(): Promise<Artist[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(`
        *,
        status:artist_statuses(*)
      `);

    if (error) {
      console.error('Erreur lors de la récupération des artistes avec leur statut:', error);
      throw error;
    }

    return data as Artist[];
  }
  
  /**
   * Recherche des artistes par nom
   */
  async searchArtists(query: string): Promise<Artist[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .ilike('name', `%${query}%`);

    if (error) {
      console.error('Erreur lors de la recherche d\'artistes:', error);
      throw error;
    }

    return data as Artist[];
  }
  
  /**
   * Met à jour le statut d'un artiste
   */
  async updateArtistStatus(artistId: string, statusId: string): Promise<void> {
    const { error } = await this.supabase
      .from('artist_status_links')
      .upsert({ artist_id: artistId, status_id: statusId });

    if (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'artiste:', error);
      throw error;
    }
  }
}

// Instance unique exportée
export const artistService = new ArtistService(); 
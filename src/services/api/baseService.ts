import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

/**
 * Service de base pour interagir avec Supabase
 * Fournit des méthodes CRUD génériques
 */
export class BaseService<T extends { id: string }> {
  protected supabase: SupabaseClient;
  protected table: string;

  constructor(table: string) {
    this.supabase = supabase;
    this.table = table;
  }

  /**
   * Récupère tous les éléments de la table
   */
  async getAll(): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*');

    if (error) {
      console.error(`Erreur lors de la récupération des données de ${this.table}:`, error);
      throw error;
    }

    return data as T[];
  }

  /**
   * Récupère un élément par son ID
   */
  async getById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'élément ${id} dans ${this.table}:`, error);
      throw error;
    }

    return data as T;
  }

  /**
   * Crée un nouvel élément
   */
  async create(item: Omit<T, 'id'>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error(`Erreur lors de la création d'un élément dans ${this.table}:`, error);
      throw error;
    }

    return data as T;
  }

  /**
   * Met à jour un élément existant
   */
  async update(id: string, item: Partial<T>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Erreur lors de la mise à jour de l'élément ${id} dans ${this.table}:`, error);
      throw error;
    }

    return data as T;
  }

  /**
   * Supprime un élément par son ID
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression de l'élément ${id} dans ${this.table}:`, error);
      throw error;
    }
  }

  /**
   * Récupère des éléments avec filtrage
   */
  async getFiltered(filterField: string, filterValue: any): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq(filterField, filterValue);

    if (error) {
      console.error(`Erreur lors du filtrage des données de ${this.table}:`, error);
      throw error;
    }

    return data as T[];
  }
} 
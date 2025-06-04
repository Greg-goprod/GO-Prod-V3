import { useState, useEffect, useCallback } from 'react';
import { artistService } from '../../services/api';
import { Artist } from '../../types';
import { useStore } from '../../store';

/**
 * Hook personnalisé pour gérer les artistes
 * Offre des fonctionnalités CRUD et de recherche
 */
export const useArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Accès au store pour la persistance
  const storeArtists = useStore(state => state.artists);
  const addArtistToStore = useStore(state => state.addArtist);
  const updateArtistInStore = useStore(state => state.updateArtist);
  const deleteArtistFromStore = useStore(state => state.deleteArtist);
  
  // Charger les artistes depuis l'API ou le store
  const loadArtists = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Si nous avons déjà des données dans le store et qu'un rafraîchissement n'est pas forcé
      if (storeArtists.length > 0 && !forceRefresh) {
        setArtists(storeArtists);
      } else {
        // Sinon, charger depuis l'API
        const data = await artistService.getAll();
        setArtists(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des artistes:', err);
      setError('Impossible de charger les artistes. Veuillez réessayer.');
      
      // Fallback aux données du store si disponibles
      if (storeArtists.length > 0) {
        setArtists(storeArtists);
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeArtists]);
  
  // Charger les artistes au montage du composant
  useEffect(() => {
    loadArtists();
  }, [loadArtists]);
  
  // Créer un nouvel artiste
  const createArtist = useCallback(async (artist: Omit<Artist, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newArtist = await artistService.create(artist);
      addArtistToStore(artist);
      setArtists(prev => [...prev, newArtist]);
      return newArtist;
    } catch (err) {
      console.error('Erreur lors de la création d\'un artiste:', err);
      setError('Impossible de créer l\'artiste. Veuillez réessayer.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addArtistToStore]);
  
  // Mettre à jour un artiste existant
  const updateArtist = useCallback(async (id: string, artist: Partial<Artist>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedArtist = await artistService.update(id, artist);
      updateArtistInStore(id, artist);
      setArtists(prev => prev.map(a => a.id === id ? { ...a, ...artist } : a));
      return updatedArtist;
    } catch (err) {
      console.error('Erreur lors de la mise à jour d\'un artiste:', err);
      setError('Impossible de mettre à jour l\'artiste. Veuillez réessayer.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateArtistInStore]);
  
  // Supprimer un artiste
  const deleteArtist = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await artistService.delete(id);
      deleteArtistFromStore(id);
      setArtists(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression d\'un artiste:', err);
      setError('Impossible de supprimer l\'artiste. Veuillez réessayer.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [deleteArtistFromStore]);
  
  // Rechercher des artistes
  const searchArtists = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!query.trim()) {
        // Si la requête est vide, retourner tous les artistes
        return loadArtists();
      }
      
      const results = await artistService.searchArtists(query);
      setArtists(results);
      return results;
    } catch (err) {
      console.error('Erreur lors de la recherche d\'artistes:', err);
      setError('Impossible de rechercher des artistes. Veuillez réessayer.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadArtists]);
  
  return {
    artists,
    isLoading,
    error,
    loadArtists,
    createArtist,
    updateArtist,
    deleteArtist,
    searchArtists
  };
}; 
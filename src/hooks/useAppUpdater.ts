import { useState, useEffect } from 'react';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'installing' | 'installed' | 'error';

/**
 * Hook pour gérer les mises à jour de l'application
 * Permet de vérifier et d'appliquer les mises à jour du service worker
 */
export const useAppUpdater = () => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Vérifier si une mise à jour est disponible
  const checkForUpdates = async () => {
    if (!registration) return;
    
    try {
      setUpdateStatus('checking');
      await registration.update();
      // La mise à jour sera détectée via l'événement updatefound
    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour:', error);
      setUpdateError('Impossible de vérifier les mises à jour');
      setUpdateStatus('error');
    }
  };

  // Appliquer la mise à jour
  const applyUpdate = () => {
    if (!registration || !registration.waiting) return;
    
    setUpdateStatus('installing');
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  // Réinitialiser après une mise à jour
  const resetUpdateStatus = () => {
    setUpdateStatus('idle');
    setUpdateError(null);
  };

  // Configurer l'écouteur de mise à jour
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleUpdate = (reg: ServiceWorkerRegistration) => {
      setRegistration(reg);
      
      if (reg.waiting) {
        // Une mise à jour est déjà en attente
        setUpdateStatus('available');
        return;
      }

      // Écouter les nouvelles mises à jour
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nouvelle version disponible
            setUpdateStatus('available');
          }
        });
      });
    };

    // Récupérer l'enregistrement existant
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        handleUpdate(reg);
      }
    });

    // Écouter les changements de contrôleur pour détecter quand la mise à jour est appliquée
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      setUpdateStatus('installed');
      window.location.reload();
    });
  }, []);

  return {
    updateStatus,
    updateError,
    checkForUpdates,
    applyUpdate,
    resetUpdateStatus,
    hasUpdate: updateStatus === 'available',
  };
}; 
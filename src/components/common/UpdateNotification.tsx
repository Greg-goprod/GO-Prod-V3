import React, { useState, useEffect } from 'react';

/**
 * Composant qui affiche une notification lorsqu'une mise à jour de l'application est disponible
 */
export const UpdateNotification: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Écouter les événements du service worker
    if ('serviceWorker' in navigator) {
      // Vérifier les mises à jour de l'application
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    // Rafraîchir la page pour charger la nouvelle version
    window.location.reload();
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-primary-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
      <div>
        <p className="font-medium">Une mise à jour est disponible</p>
        <p className="text-sm text-primary-100">Cliquez pour mettre à jour l'application</p>
      </div>
      <button
        onClick={handleUpdate}
        className="ml-4 bg-white text-primary-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-primary-50"
      >
        Mettre à jour
      </button>
    </div>
  );
};

export default UpdateNotification; 
import React from 'react';

/**
 * Composant de chargement pour les pages
 * Affiche un indicateur de chargement centré
 */
export const PageLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
}; 
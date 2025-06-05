import React from 'react';

/**
 * Composant d'indicateur de chargement pour les pages
 */
export const PageLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
    </div>
  );
}; 
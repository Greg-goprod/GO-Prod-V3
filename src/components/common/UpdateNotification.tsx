import React from 'react';
import { useAppUpdater } from '../../hooks/useAppUpdater';

/**
 * Composant qui affiche une notification lorsqu'une mise à jour de l'application est disponible
 */
export const UpdateNotification: React.FC = () => {
  const { hasUpdate, updateStatus, applyUpdate, updateError } = useAppUpdater();

  if (!hasUpdate && updateStatus !== 'error') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {updateStatus === 'error' ? (
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {updateStatus === 'error' ? 'Erreur de mise à jour' : 'Mise à jour disponible'}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {updateStatus === 'error' 
              ? updateError || 'Une erreur s\'est produite lors de la mise à jour.' 
              : 'Une nouvelle version de l\'application est disponible.'}
          </p>
          <div className="mt-4 flex">
            <button
              type="button"
              onClick={applyUpdate}
              disabled={updateStatus === 'error' || updateStatus === 'installing'}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateStatus === 'installing' ? 'Installation...' : 'Mettre à jour maintenant'}
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
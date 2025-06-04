import React from 'react';
import { Link } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-red-600 dark:text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m0 0v2m0-2h2m-2 0H8m9 3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Accès refusé
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            to="/"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Retourner à l'accueil
          </Link>
          <div className="text-sm">
            <Link to="/contact" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Contacter l'administrateur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 
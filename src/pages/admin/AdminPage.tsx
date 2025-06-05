import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Administration</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Centre d'administration
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Cette section vous permet de gérer tous les aspects administratifs de votre événement.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Booking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gestion des réservations et engagements
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Contrats</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Documents légaux et conventions
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Finances</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Budget, paiements et comptabilité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export par défaut
export default AdminPage;

// Export nommé pour la compatibilité
export { AdminPage }; 
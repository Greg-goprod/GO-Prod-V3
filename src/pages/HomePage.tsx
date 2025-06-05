import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Bienvenue sur GO-PROD</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Tableau de bord</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
            <h3 className="text-lg font-medium text-primary-700 dark:text-primary-300 mb-2">Artistes</h3>
            <p className="text-2xl font-bold text-primary-800 dark:text-primary-200">23</p>
            <p className="text-sm text-primary-600 dark:text-primary-400">3 nouveaux cette semaine</p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="text-lg font-medium text-amber-700 dark:text-amber-300 mb-2">Production</h3>
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">42</p>
            <p className="text-sm text-amber-600 dark:text-amber-400">5 tâches en attente</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">Planning</h3>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">12</p>
            <p className="text-sm text-green-600 dark:text-green-400">Jours avant l'événement</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Activité récente</h2>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div 
              key={item} 
              className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  {item}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Action exemple #{item}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Il y a {item * 10} minutes
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
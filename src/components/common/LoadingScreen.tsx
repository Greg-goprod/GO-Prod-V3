import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Chargement...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen; 
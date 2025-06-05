import React, { useState } from 'react';

/**
 * Sélecteur de langue permettant de changer la langue de l'application
 */
export const LanguageSelector: React.FC = () => {
  const [language, setLanguage] = useState('fr');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    // Ici, vous pourriez appeler une fonction pour changer la langue dans i18next
    // changeLanguage(e.target.value);
  };

  return (
    <div className="max-w-xs">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}; 
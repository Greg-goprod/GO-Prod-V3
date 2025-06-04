import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';

/**
 * Sélecteur de langue permettant de changer la langue de l'application
 */
export const LanguageSelector: React.FC = () => {
  const { currentLanguage, availableLanguages, changeLanguage, t } = useLocalization();
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language-selector" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('settings.language')}:
      </label>
      <select
        id="language-selector"
        value={currentLanguage}
        onChange={handleChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        aria-label={t('settings.language')}
      >
        {availableLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}; 
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useStore } from '../store';

/**
 * Hook personnalisé pour gérer la localisation dans l'application
 * Gère le changement de langue et fournit des fonctions de traduction
 */
export const useLocalization = () => {
  const { t, i18n } = useTranslation();
  const setLanguage = useStore(state => state.setLanguage);
  
  // Récupérer la langue actuelle
  const currentLanguage = i18n.language;
  
  // Langues disponibles
  const availableLanguages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' }
  ];
  
  // Changer la langue
  const changeLanguage = useCallback(async (lng: string) => {
    await i18n.changeLanguage(lng);
    setLanguage(lng);
    // Mettre à jour la direction du document pour les langues RTL si nécessaire
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = lng;
  }, [i18n, setLanguage]);
  
  // Formater une date selon la locale
  const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(currentLanguage, options).format(dateObj);
  }, [currentLanguage]);
  
  // Formater un nombre selon la locale
  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(currentLanguage, options).format(number);
  }, [currentLanguage]);
  
  // Formater une durée
  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return t('common.hoursMinutes', { hours, minutes: mins });
    } else {
      return t('common.minutes', { minutes: mins });
    }
  }, [t]);
  
  return {
    t,
    i18n,
    currentLanguage,
    availableLanguages,
    changeLanguage,
    formatDate,
    formatNumber,
    formatDuration
  };
}; 
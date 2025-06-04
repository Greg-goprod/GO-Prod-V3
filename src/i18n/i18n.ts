import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Traductions intégrées à utiliser comme fallback
import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';

// Les ressources de traduction
const resources = {
  fr: {
    translation: translationFR
  },
  en: {
    translation: translationEN
  }
};

i18n
  // Chargement des traductions depuis le serveur
  .use(Backend)
  // Détection automatique de la langue
  .use(LanguageDetector)
  // Intégration avec React
  .use(initReactI18next)
  // Initialisation de i18next
  .init({
    resources,
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
    
    detection: {
      // Ordre de détection de la langue
      order: ['localStorage', 'navigator'],
      // Nom de la clé dans localStorage
      lookupLocalStorage: 'i18nextLng',
      // Persister la langue
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: true,
    },
    
    // Options de backend pour le chargement depuis le serveur
    backend: {
      // Chemin vers les fichiers de traduction
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n; 
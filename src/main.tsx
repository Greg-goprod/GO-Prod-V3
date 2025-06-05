import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SupabaseProvider } from './lib/supabaseClient.tsx';
import './i18n/i18n'; // Importer la configuration i18next
import './index.css';

// Enregistrement du service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
      
      // Gestion des mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nouvelle version disponible
            if (confirm('Une nouvelle version est disponible. Voulez-vous mettre à jour?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};

// Initialisation de l'application
const initApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <SupabaseProvider>
          <App />
        </SupabaseProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Démarrer l'application et enregistrer le service worker
initApp();
registerServiceWorker();
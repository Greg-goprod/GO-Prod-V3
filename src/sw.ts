/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope;

// Précache les ressources essentielles
// @ts-ignore
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

// Cache pour les pages HTML - Stratégie Network First pour avoir les dernières mises à jour
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'go-prod-pages-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache pour les API - Stratégie StaleWhileRevalidate pour un équilibre entre rapidité et fraîcheur
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/') || url.origin.includes('supabase'),
  new StaleWhileRevalidate({
    cacheName: 'go-prod-api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24, // 24 heures
      }),
    ],
  })
);

// Cache pour les ressources statiques - Stratégie CacheFirst pour de meilleures performances
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'script' || 
    request.destination === 'font',
  new CacheFirst({
    cacheName: 'go-prod-static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
      }),
    ],
  })
);

// Cache pour les images - Stratégie CacheFirst avec expiration
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'go-prod-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 jours
      }),
    ],
  })
);

// Gestion des mises à jour de l'application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification en cas de mise à jour disponible
self.addEventListener('install', () => {
  self.skipWaiting();
  console.log('Service Worker installé');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker activé');
}); 
import { lazy } from 'react';
import { RouteGroup } from './index';

// Chargement des pages paramètres avec l'import par défaut
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

export const settingsRoutes: RouteGroup = {
  name: 'Settings',
  routes: [
    {
      path: '/settings',
      component: SettingsPage,
      layout: true,
      protected: true,
    }
  ],
}; 
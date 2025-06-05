import { lazy } from 'react';
import { RouteGroup } from './index';

// Chargement des pages hospitalité avec l'import par défaut
const HospitalityPage = lazy(() => import('../pages/hospitality/HospitalityPage'));

export const hospitalityRoutes: RouteGroup = {
  name: 'Hospitality',
  routes: [
    {
      path: '/hospitality',
      component: HospitalityPage,
      layout: true,
      protected: true,
    }
  ],
}; 
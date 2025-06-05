import { lazy } from 'react';
import { RouteGroup } from './index';

// Chargement des pages ground avec l'import par défaut
const GroundPage = lazy(() => import('../pages/ground/GroundPage'));

export const groundRoutes: RouteGroup = {
  name: 'Ground',
  routes: [
    {
      path: '/ground',
      component: GroundPage,
      layout: true,
      protected: true,
    }
  ],
}; 
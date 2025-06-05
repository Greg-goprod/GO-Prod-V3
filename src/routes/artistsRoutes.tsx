import { lazy } from 'react';
import { RouteGroup } from './index';

// Chargement des pages artistes avec l'import par défaut
const ArtistsPage = lazy(() => import('../pages/artists/ArtistsPage'));
const ArtistDetailsPage = lazy(() => import('../pages/artists/ArtistDetailsPage'));
const ArtistEditPage = lazy(() => import('../pages/artists/ArtistEditPage'));
const ArtistRidersPage = lazy(() => import('../pages/artists/ArtistRidersPage'));

export const artistsRoutes: RouteGroup = {
  name: 'Artists',
  routes: [
    {
      path: '/artists',
      component: ArtistsPage,
      layout: true,
      protected: true,
    },
    {
      path: '/artists/:id',
      component: ArtistDetailsPage,
      layout: true,
      protected: true,
    },
    {
      path: '/artists/:id/edit',
      component: ArtistEditPage,
      layout: true,
      protected: true,
    },
    {
      path: '/artists/:id/riders',
      component: ArtistRidersPage,
      layout: true,
      protected: true,
    }
  ],
}; 
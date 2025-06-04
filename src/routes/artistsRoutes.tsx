import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageLoader } from '../components/common/PageLoader';

// Import des pages d'artistes
const ArtistsPage = React.lazy(() => import('../pages/ArtistsPage').then(module => ({ default: module.ArtistsPage })));
const LineupPage = React.lazy(() => import('../pages/LineupPage').then(module => ({ default: module.LineupPage })));
const ArtistPage = React.lazy(() => import('../pages/ArtistPage').then(module => ({ default: module.ArtistPage })));

/**
 * Routes liées aux artistes
 */
export const artistsRoutes = (
  <>
    <Route path="artists" element={
      <Suspense fallback={<PageLoader />}>
        <ArtistsPage />
      </Suspense>
    } />
    <Route path="artists/:id" element={
      <Suspense fallback={<PageLoader />}>
        <ArtistPage />
      </Suspense>
    } />
    <Route path="lineup" element={
      <Suspense fallback={<PageLoader />}>
        <LineupPage />
      </Suspense>
    } />
  </>
); 
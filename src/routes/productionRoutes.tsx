import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageLoader } from '../components/common/PageLoader';
import { RouteGroup } from './index';

// Import des pages de production avec l'import par défaut
const ProductionPage = lazy(() => import('../pages/production/ProductionPage'));
const TimetablePage = React.lazy(() => import('../pages/TimetablePage').then(module => ({ default: module.TimetablePage })));
const TechniquePage = React.lazy(() => import('../pages/TechniquePage').then(module => ({ default: module.TechniquePage })));
const TravelsPage = React.lazy(() => import('../pages/TravelsPage').then(module => ({ default: module.TravelsPage })));
const PartyCrewPage = React.lazy(() => import('../pages/PartyCrewPage').then(module => ({ default: module.PartyCrewPage })));

/**
 * Routes liées à la production
 */
export const productionRoutes: RouteGroup = {
  name: 'Production',
  routes: [
    {
      path: '/production',
      component: ProductionPage,
      layout: true,
      protected: true,
    }
  ],
};

export const productionRoutesOld = (
  <>
    <Route path="timetable" element={
      <Suspense fallback={<PageLoader />}>
        <TimetablePage />
      </Suspense>
    } />
    <Route path="technique" element={
      <Suspense fallback={<PageLoader />}>
        <TechniquePage />
      </Suspense>
    } />
    <Route path="travels" element={
      <Suspense fallback={<PageLoader />}>
        <TravelsPage />
      </Suspense>
    } />
    <Route path="partycrew" element={
      <Suspense fallback={<PageLoader />}>
        <PartyCrewPage />
      </Suspense>
    } />
  </>
); 
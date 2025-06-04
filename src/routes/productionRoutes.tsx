import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageLoader } from '../components/common/PageLoader';

// Import des pages de production
const ProductionPage = React.lazy(() => import('../pages/ProductionPage').then(module => ({ default: module.ProductionPage })));
const TimetablePage = React.lazy(() => import('../pages/TimetablePage').then(module => ({ default: module.TimetablePage })));
const TechniquePage = React.lazy(() => import('../pages/TechniquePage').then(module => ({ default: module.TechniquePage })));
const TravelsPage = React.lazy(() => import('../pages/TravelsPage').then(module => ({ default: module.TravelsPage })));
const PartyCrewPage = React.lazy(() => import('../pages/PartyCrewPage').then(module => ({ default: module.PartyCrewPage })));

/**
 * Routes liées à la production
 */
export const productionRoutes = (
  <>
    <Route path="production" element={
      <Suspense fallback={<PageLoader />}>
        <ProductionPage />
      </Suspense>
    } />
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
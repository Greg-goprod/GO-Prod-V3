import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageLoader } from '../components/common/PageLoader';

// Import des pages d'hospitalité
const HospitalityPage = React.lazy(() => import('../pages/HospitalityPage').then(module => ({ default: module.HospitalityPage })));
const BackstagePage = React.lazy(() => import('../pages/BackstagePage').then(module => ({ default: module.BackstagePage })));
const CateringPage = React.lazy(() => import('../pages/CateringPage').then(module => ({ default: module.CateringPage })));
const HotelsPage = React.lazy(() => import('../pages/HotelsPage').then(module => ({ default: module.HotelsPage })));

/**
 * Routes liées à l'hospitalité
 */
export const hospitalityRoutes = (
  <>
    <Route path="hospitality" element={
      <Suspense fallback={<PageLoader />}>
        <HospitalityPage />
      </Suspense>
    } />
    <Route path="backstage" element={
      <Suspense fallback={<PageLoader />}>
        <BackstagePage />
      </Suspense>
    } />
    <Route path="catering" element={
      <Suspense fallback={<PageLoader />}>
        <CateringPage />
      </Suspense>
    } />
    <Route path="hotels" element={
      <Suspense fallback={<PageLoader />}>
        <HotelsPage />
      </Suspense>
    } />
  </>
); 
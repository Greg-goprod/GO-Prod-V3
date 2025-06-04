import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageLoader } from '../components/common/PageLoader';

// Import des pages liées au terrain
const GroundPage = React.lazy(() => import('../pages/GroundPage').then(module => ({ default: module.GroundPage })));
const MissionsPage = React.lazy(() => import('../pages/MissionsPage').then(module => ({ default: module.MissionsPage })));
const DriversPage = React.lazy(() => import('../pages/DriversPage').then(module => ({ default: module.DriversPage })));
const VehiclesPage = React.lazy(() => import('../pages/VehiclesPage').then(module => ({ default: module.VehiclesPage })));
const ShiftsPage = React.lazy(() => import('../pages/ShiftsPage').then(module => ({ default: module.ShiftsPage })));

/**
 * Routes liées au terrain
 */
export const groundRoutes = (
  <>
    <Route path="ground" element={
      <Suspense fallback={<PageLoader />}>
        <GroundPage />
      </Suspense>
    } />
    <Route path="missions" element={
      <Suspense fallback={<PageLoader />}>
        <MissionsPage />
      </Suspense>
    } />
    <Route path="drivers" element={
      <Suspense fallback={<PageLoader />}>
        <DriversPage />
      </Suspense>
    } />
    <Route path="vehicles" element={
      <Suspense fallback={<PageLoader />}>
        <VehiclesPage />
      </Suspense>
    } />
    <Route path="shifts" element={
      <Suspense fallback={<PageLoader />}>
        <ShiftsPage />
      </Suspense>
    } />
  </>
); 
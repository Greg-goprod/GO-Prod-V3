import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageLoader } from '../components/common/PageLoader';
import { RouteGroup } from './index';

// Import des pages d'administration
const AdministrationPage = React.lazy(() => import('../pages/AdministrationPage').then(module => ({ default: module.AdministrationPage })));
const BookingPage = React.lazy(() => import('../pages/BookingPage').then(module => ({ default: module.BookingPage })));
const ContractsPage = React.lazy(() => import('../pages/ContractsPage').then(module => ({ default: module.ContractsPage })));
const FinancesPage = React.lazy(() => import('../pages/FinancesPage').then(module => ({ default: module.FinancesPage })));
const SalesPage = React.lazy(() => import('../pages/SalesPage').then(module => ({ default: module.SalesPage })));

// Chargement des pages administration avec l'import par défaut
const AdminPage = lazy(() => import('../pages/admin/AdminPage'));

/**
 * Routes liées à l'administration
 */
export const administrationRoutes: RouteGroup = {
  name: 'Administration',
  routes: [
    {
      path: '/admin',
      component: AdminPage,
      layout: true,
      protected: true,
    }
  ],
};

export const administrationRoutesOld = (
  <>
    <Route path="administration" element={
      <Suspense fallback={<PageLoader />}>
        <AdministrationPage />
      </Suspense>
    } />
    <Route path="booking" element={
      <Suspense fallback={<PageLoader />}>
        <BookingPage />
      </Suspense>
    } />
    <Route path="contracts" element={
      <Suspense fallback={<PageLoader />}>
        <ContractsPage />
      </Suspense>
    } />
    <Route path="finances" element={
      <Suspense fallback={<PageLoader />}>
        <FinancesPage />
      </Suspense>
    } />
    <Route path="sales" element={
      <Suspense fallback={<PageLoader />}>
        <SalesPage />
      </Suspense>
    } />
  </>
); 
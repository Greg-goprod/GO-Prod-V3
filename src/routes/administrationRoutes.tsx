import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageLoader } from '../components/common/PageLoader';

// Import des pages d'administration
const AdministrationPage = React.lazy(() => import('../pages/AdministrationPage').then(module => ({ default: module.AdministrationPage })));
const BookingPage = React.lazy(() => import('../pages/BookingPage').then(module => ({ default: module.BookingPage })));
const ContractsPage = React.lazy(() => import('../pages/ContractsPage').then(module => ({ default: module.ContractsPage })));
const FinancesPage = React.lazy(() => import('../pages/FinancesPage').then(module => ({ default: module.FinancesPage })));
const SalesPage = React.lazy(() => import('../pages/SalesPage').then(module => ({ default: module.SalesPage })));

/**
 * Routes liées à l'administration
 */
export const administrationRoutes = (
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
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { PageLoader } from '../components/common/PageLoader';

// Import des pages de paramètres
const SettingsPage = React.lazy(() => import('../pages/SettingsPage').then(module => ({ default: module.SettingsPage })));

/**
 * Routes liées aux paramètres
 */
export const settingsRoutes = (
  <>
    <Route path="settings" element={
      <Suspense fallback={<PageLoader />}>
        <SettingsPage />
      </Suspense>
    } />
  </>
); 
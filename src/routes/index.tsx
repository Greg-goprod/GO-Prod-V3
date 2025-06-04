import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { PageLoader } from '../components/common/PageLoader';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Routes importées par modules
import { artistsRoutes } from './artistsRoutes';
import { productionRoutes } from './productionRoutes';
import { groundRoutes } from './groundRoutes';
import { hospitalityRoutes } from './hospitalityRoutes';
import { administrationRoutes } from './administrationRoutes';
import { settingsRoutes } from './settingsRoutes';

// Pages d'authentification
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('../pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = React.lazy(() => import('../pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = React.lazy(() => import('../pages/auth/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));
const UnauthorizedPage = React.lazy(() => import('../pages/auth/UnauthorizedPage').then(module => ({ default: module.UnauthorizedPage })));

// Page d'accueil
const HomePage = React.lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));

// Routes globales (hors catégories)
const ContactsPage = React.lazy(() => import('../pages/ContactsPage').then(module => ({ default: module.ContactsPage })));
const PressPage = React.lazy(() => import('../pages/PressPage').then(module => ({ default: module.PressPage })));
const RightsPage = React.lazy(() => import('../pages/RightsPage').then(module => ({ default: module.RightsPage })));

/**
 * Fonction de rendu des routes de l'application
 * Structure les routes de façon modulaire et maintenable
 * Intègre l'authentification et les routes protégées
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes d'authentification (publiques) */}
      <Route path="login" element={
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
      } />
      <Route path="register" element={
        <Suspense fallback={<PageLoader />}>
          <RegisterPage />
        </Suspense>
      } />
      <Route path="forgot-password" element={
        <Suspense fallback={<PageLoader />}>
          <ForgotPasswordPage />
        </Suspense>
      } />
      <Route path="reset-password" element={
        <Suspense fallback={<PageLoader />}>
          <ResetPasswordPage />
        </Suspense>
      } />
      <Route path="unauthorized" element={
        <Suspense fallback={<PageLoader />}>
          <UnauthorizedPage />
        </Suspense>
      } />
      
      {/* Routes protégées (nécessitent une authentification) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          {/* Page d'accueil */}
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          } />

          {/* Routes par modules */}
          {artistsRoutes}
          {productionRoutes}
          {groundRoutes}
          {hospitalityRoutes}
          {administrationRoutes}
          
          {/* Routes globales */}
          <Route path="contacts" element={
            <Suspense fallback={<PageLoader />}>
              <ContactsPage />
            </Suspense>
          } />
          <Route path="press" element={
            <Suspense fallback={<PageLoader />}>
              <PressPage />
            </Suspense>
          } />
          <Route path="rights" element={
            <Suspense fallback={<PageLoader />}>
              <RightsPage />
            </Suspense>
          } />
          
          {/* Routes de configuration */}
          {settingsRoutes}
        </Route>
      </Route>
      
      {/* Route par défaut (redirection vers la page d'accueil) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}; 
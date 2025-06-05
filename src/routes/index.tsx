import React, { lazy, Suspense } from 'react';
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
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const UnauthorizedPage = lazy(() => import('../pages/auth/UnauthorizedPage'));

// Page d'accueil
const HomePage = lazy(() => import('../pages/HomePage'));

// Routes globales (hors catégories) - Utiliser lazy avec export par défaut
const ContactsPage = lazy(() => import('../pages/ContactsPage'));
const PressPage = lazy(() => import('../pages/PressPage'));
const RightsPage = lazy(() => import('../pages/RightsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Types pour les routes
export interface RouteItem {
  path: string;
  component: React.ComponentType<any>;
  layout?: boolean;
  protected?: boolean;
  guestOnly?: boolean;
}

export interface RouteGroup {
  name: string;
  routes: RouteItem[];
}

// Définition des routes principales
export const routes: RouteGroup[] = [
  {
    name: 'Auth',
    routes: [
      {
        path: '/login',
        component: LoginPage,
        layout: false,
        guestOnly: true,
      },
      {
        path: '/register',
        component: RegisterPage,
        layout: false,
        guestOnly: true,
      },
      {
        path: '/unauthorized',
        component: UnauthorizedPage,
        layout: false,
      },
    ],
  },
  {
    name: 'Core',
    routes: [
      {
        path: '/',
        component: HomePage,
        layout: true,
        protected: true,
      },
      ...artistsRoutes.routes,
      ...productionRoutes.routes,
      ...hospitalityRoutes.routes,
      ...groundRoutes.routes,
      ...administrationRoutes.routes,
      ...settingsRoutes.routes,
      {
        path: '*',
        component: NotFoundPage,
        layout: false,
      },
    ],
  },
];

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

          {/* Routes par modules - Conversion en éléments React Router */}
          {/* Routes Artistes */}
          <Route path="artists" element={
            <Suspense fallback={<PageLoader />}>
              <React.Fragment>{artistsRoutes.routes.map(route => 
                route.path === '/artists' ? <Route index element={<route.component />} key={route.path} /> : null
              )}</React.Fragment>
            </Suspense>
          } />
          <Route path="artists/:id" element={
            <Suspense fallback={<PageLoader />}>
              <React.Fragment>{artistsRoutes.routes.map(route => 
                route.path === '/artists/:id' ? <route.component /> : null
              )}</React.Fragment>
            </Suspense>
          } />
          <Route path="artists/:id/edit" element={
            <Suspense fallback={<PageLoader />}>
              <React.Fragment>{artistsRoutes.routes.map(route => 
                route.path === '/artists/:id/edit' ? <route.component /> : null
              )}</React.Fragment>
            </Suspense>
          } />
          <Route path="artists/:id/riders" element={
            <Suspense fallback={<PageLoader />}>
              <React.Fragment>{artistsRoutes.routes.map(route => 
                route.path === '/artists/:id/riders' ? <route.component /> : null
              )}</React.Fragment>
            </Suspense>
          } />

          {/* Routes Production */}
          <Route path="production" element={
            <Suspense fallback={<PageLoader />}>
              <React.Fragment>{productionRoutes.routes.map(route => 
                route.path === '/production' ? <route.component /> : null
              )}</React.Fragment>
            </Suspense>
          } />

          {/* Routes Ground */}
          <Route path="ground" element={
            <Suspense fallback={<PageLoader />}>
              <React.Fragment>{groundRoutes.routes.map(route => 
                route.path === '/ground' ? <route.component /> : null
              )}</React.Fragment>
            </Suspense>
          } />

          {/* Routes Hospitality */}
          <Route path="hospitality" element={
            <Suspense fallback={<PageLoader />}>
              <React.Fragment>{hospitalityRoutes.routes.map(route => 
                route.path === '/hospitality' ? <route.component /> : null
              )}</React.Fragment>
            </Suspense>
          } />

          {/* Routes Administration */}
          <Route path="admin" element={
            <Suspense fallback={<PageLoader />}>
              <React.Fragment>{administrationRoutes.routes.map(route => 
                route.path === '/admin' ? <route.component /> : null
              )}</React.Fragment>
            </Suspense>
          } />
          
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
          <Route path="settings" element={
            <Suspense fallback={<PageLoader />}>
              <React.Fragment>{settingsRoutes.routes.map(route => 
                route.path === '/settings' ? <route.component /> : null
              )}</React.Fragment>
            </Suspense>
          } />
        </Route>
      </Route>
      
      {/* Route par défaut (redirection vers la page d'accueil) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}; 
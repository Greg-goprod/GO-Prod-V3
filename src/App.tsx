import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';

// Pages avec chargement différé
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages par module
import ArtistsPage from './pages/artists/ArtistsPage';
import ProductionPage from './pages/production/ProductionPage';
import HospitalityPage from './pages/hospitality/HospitalityPage';
import GroundPage from './pages/ground/GroundPage';
import AdminPage from './pages/admin/AdminPage';
import SettingsPage from './pages/settings/SettingsPage';

const App: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          {/* Routes protégées (nécessitent une authentification) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/artists" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ArtistsPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/production" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductionPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/hospitality" 
            element={
              <ProtectedRoute>
                <Layout>
                  <HospitalityPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/ground" 
            element={
              <ProtectedRoute>
                <Layout>
                  <GroundPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Routes publiques (ne nécessitent pas d'authentification) */}
          <Route 
            path="/login" 
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            } 
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Route 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default App;
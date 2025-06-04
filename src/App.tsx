import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from 'react-error-boundary';

// Error Fallback Component
const ErrorFallback = ({ error }) => (
  <div className="flex items-center justify-center h-full w-full min-h-[50vh] p-4">
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-lg w-full">
      <h2 className="text-red-800 font-semibold mb-2">An error occurred</h2>
      <p className="text-red-600">{error.message}</p>
    </div>
  </div>
);

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

// Properly configured lazy imports for named exports
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ArtistsPage = lazy(() => import('./pages/ArtistsPage').then(module => ({ default: module.ArtistsPage })));
const LineupPage = lazy(() => import('./pages/LineupPage').then(module => ({ default: module.LineupPage })));
const ProductionPage = lazy(() => import('./pages/ProductionPage').then(module => ({ default: module.ProductionPage })));
const TimetablePage = lazy(() => import('./pages/TimetablePage').then(module => ({ default: module.TimetablePage })));
const TechniquePage = lazy(() => import('./pages/TechniquePage').then(module => ({ default: module.TechniquePage })));
const GroundPage = lazy(() => import('./pages/GroundPage').then(module => ({ default: module.GroundPage })));
const MissionsPage = lazy(() => import('./pages/MissionsPage').then(module => ({ default: module.MissionsPage })));
const DriversPage = lazy(() => import('./pages/DriversPage').then(module => ({ default: module.DriversPage })));
const VehiclesPage = lazy(() => import('./pages/VehiclesPage').then(module => ({ default: module.VehiclesPage })));
const ShiftsPage = lazy(() => import('./pages/ShiftsPage').then(module => ({ default: module.ShiftsPage })));
const HospitalityPage = lazy(() => import('./pages/HospitalityPage').then(module => ({ default: module.HospitalityPage })));
const BackstagePage = lazy(() => import('./pages/BackstagePage').then(module => ({ default: module.BackstagePage })));
const CateringPage = lazy(() => import('./pages/CateringPage').then(module => ({ default: module.CateringPage })));
const HotelsPage = lazy(() => import('./pages/HotelsPage').then(module => ({ default: module.HotelsPage })));
const TravelsPage = lazy(() => import('./pages/TravelsPage').then(module => ({ default: module.TravelsPage })));
const PartyCrewPage = lazy(() => import('./pages/PartyCrewPage').then(module => ({ default: module.PartyCrewPage })));
const AdministrationPage = lazy(() => import('./pages/AdministrationPage').then(module => ({ default: module.AdministrationPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then(module => ({ default: module.BookingPage })));
const ContractsPage = lazy(() => import('./pages/ContractsPage').then(module => ({ default: module.ContractsPage })));
const FinancesPage = lazy(() => import('./pages/FinancesPage').then(module => ({ default: module.FinancesPage })));
const SalesPage = lazy(() => import('./pages/SalesPage').then(module => ({ default: module.SalesPage })));
const PressPage = lazy(() => import('./pages/PressPage').then(module => ({ default: module.PressPage })));
const RightsPage = lazy(() => import('./pages/RightsPage').then(module => ({ default: module.RightsPage })));
const ContactsPage = lazy(() => import('./pages/ContactsPage').then(module => ({ default: module.ContactsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));

function App() {
  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            } />
            
            {/* Artists */}
            <Route path="artists" element={
              <Suspense fallback={<PageLoader />}>
                <ArtistsPage />
              </Suspense>
            } />
            <Route path="lineup" element={
              <Suspense fallback={<PageLoader />}>
                <LineupPage />
              </Suspense>
            } />
            
            {/* Production */}
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
            
            {/* Ground */}
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
            
            {/* Hospitality */}
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
            
            {/* Other Production Routes */}
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
            
            {/* Administration */}
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
            
            {/* Other Main Routes */}
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
            <Route path="contacts" element={
              <Suspense fallback={<PageLoader />}>
                <ContactsPage />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            } />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
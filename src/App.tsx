import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './routes';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { GuestRoute } from './components/auth/GuestRoute';
import UpdateNotification from './components/common/UpdateNotification';
import { PageTransition } from './components/common/PageTransition';
import { useLocalization } from './hooks/useLocalization';

const App: React.FC = () => {
  const location = useLocation();
  const { i18n } = useLocalization();
  
  // Mettre à jour la langue du document en fonction de i18n
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
  }, [i18n.language, i18n]);
  
  return (
    <>
      <UpdateNotification />
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location}>
          {routes.map((routeGroup) => (
            routeGroup.routes.map((route) => {
              // Composant à afficher, protégé par authentification si nécessaire
              const Component = route.component;
              const RouteWrapper = route.protected 
                ? ProtectedRoute 
                : route.guestOnly 
                  ? GuestRoute 
                  : React.Fragment;
              
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <RouteWrapper>
                      {route.layout ? (
                        <Layout>
                          <PageTransition>
                            <Component />
                          </PageTransition>
                        </Layout>
                      ) : (
                        <PageTransition>
                          <Component />
                        </PageTransition>
                      )}
                    </RouteWrapper>
                  }
                />
              );
            })
          ))}
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
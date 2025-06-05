import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import LoadingScreen from '../common/LoadingScreen';

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Afficher le loader pendant la vérification d'authentification
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Rediriger vers la page d'origine si l'utilisateur est déjà connecté
  if (user) {
    return <Navigate to={from} replace />;
  }

  // Rendre le contenu de la route si l'utilisateur n'est pas authentifié
  return <>{children}</>;
}; 
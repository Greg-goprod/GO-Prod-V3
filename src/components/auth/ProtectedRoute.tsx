import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import LoadingScreen from '../common/LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Afficher le loader pendant la vérification d'authentification
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Rediriger vers la page de login si l'utilisateur n'est pas connecté
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Rendre le contenu de la route si l'utilisateur est authentifié
  return <>{children}</>;
}; 
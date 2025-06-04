import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { PageLoader } from './PageLoader';

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

/**
 * Composant de route protégée
 * Vérifie l'authentification et les autorisations avant d'autoriser l'accès
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles = [] }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Afficher le chargement pendant la vérification de l'authentification
  if (loading) {
    return <PageLoader />;
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles si nécessaire
  if (requiredRoles.length > 0) {
    const userRoles = user.app_metadata.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // L'utilisateur est authentifié et autorisé, rendre les routes enfants
  return <Outlet />;
}; 
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook personnalisé pour gérer l'authentification
 * Fournit des méthodes pour se connecter, s'inscrire et se déconnecter
 * Temporairement modifié pour simuler un utilisateur connecté en environnement de développement
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    // Simulation d'un utilisateur connecté pour le développement
    user: {
      id: 'temp-user-id',
      email: 'dev@example.com',
      app_metadata: {},
      user_metadata: {
        name: 'Développeur Test',
        role: 'admin'
      },
      aud: 'authenticated',
      created_at: ''
    } as User,
    session: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    // En mode développement, on simule un utilisateur déjà connecté
    // En production, on utiliserait le code commenté ci-dessous
    
    /*
    // Récupérer la session actuelle
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        setAuthState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          error: error?.message ?? null,
        });
      } catch (error) {
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          error: (error as Error).message,
        });
      }
    };

    getInitialSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          error: null,
        });
      }
    );

    // Nettoyer l'abonnement
    return () => {
      subscription.unsubscribe();
    };
    */
  }, []);

  // Connexion avec email et mot de passe
  const signIn = async (email: string, password: string) => {
    try {
      // Simuler une connexion réussie
      setAuthState({
        user: {
          id: 'temp-user-id',
          email: email,
          app_metadata: {},
          user_metadata: {
            name: 'Utilisateur Test',
            role: 'admin'
          },
          aud: 'authenticated',
          created_at: ''
        } as User,
        session: null,
        isLoading: false,
        error: null,
      });
      
      return { user: authState.user, session: authState.session };
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      throw error;
    }
  };

  // Inscription avec email et mot de passe
  const signUp = async (email: string, password: string, userData?: object) => {
    try {
      // Simuler une inscription réussie
      setAuthState({
        user: {
          id: 'temp-user-id',
          email: email,
          app_metadata: {},
          user_metadata: userData || {},
          aud: 'authenticated',
          created_at: ''
        } as User,
        session: null,
        isLoading: false,
        error: null,
      });
      
      return { user: authState.user, session: authState.session };
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      throw error;
    }
  };

  // Déconnexion
  const signOut = async () => {
    setAuthState({
      user: null,
      session: null,
      isLoading: false,
      error: null,
    });
  };

  // Réinitialisation du mot de passe
  const resetPassword = async (email: string) => {
    // Simuler une réinitialisation de mot de passe réussie
    console.log(`Réinitialisation simulée pour: ${email}`);
    return { success: true };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
} 
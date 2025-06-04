import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '../../lib/supabaseClient';
import { Session, User, AuthError } from '@supabase/supabase-js';

/**
 * Hook personnalisé pour gérer l'authentification
 * Fournit des méthodes pour se connecter, s'inscrire et se déconnecter
 */
export const useAuth = () => {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger la session au montage du composant
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    // Nettoyage de l'écouteur
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Connexion avec email et mot de passe
  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        }
      } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        setError('Une erreur s\'est produite lors de la connexion. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    },
    [supabase.auth]
  );

  // Inscription avec email et mot de passe
  const signUp = useCallback(
    async (email: string, password: string, userData?: object) => {
      setLoading(true);
      setError(null);

      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData,
          },
        });

        if (error) {
          setError(error.message);
        }
      } catch (err) {
        console.error('Erreur lors de l\'inscription:', err);
        setError('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    },
    [supabase.auth]
  );

  // Déconnexion
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      setError('Une erreur s\'est produite lors de la déconnexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [supabase.auth]);

  // Réinitialisation du mot de passe
  const resetPassword = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(null);

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          setError(error.message);
        }
      } catch (err) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', err);
        setError('Une erreur s\'est produite lors de la réinitialisation du mot de passe. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    },
    [supabase.auth]
  );

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}; 
import { useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Hook pour gérer les animations dans l'application
 * Prend en compte les préférences utilisateur (réduction des animations)
 */
export const useAnimations = () => {
  // Détection de la préférence pour les animations réduites
  const prefersReducedMotion = useReducedMotion();
  
  // Variantes d'animation pour les éléments
  const animations = useMemo(() => ({
    // Animation pour les éléments apparaissant dans une liste
    listItem: {
      hidden: { 
        opacity: 0, 
        y: 20,
      },
      visible: (i: number) => ({ 
        opacity: 1, 
        y: 0, 
        transition: { 
          delay: prefersReducedMotion ? 0 : i * 0.05,
          duration: 0.3,
          ease: 'easeOut',
        } 
      }),
      exit: { 
        opacity: 0, 
        transition: { 
          duration: 0.2 
        } 
      }
    },
    
    // Animation pour les modales et popups
    modal: {
      hidden: { 
        opacity: 0, 
        scale: 0.95 
      },
      visible: { 
        opacity: 1, 
        scale: 1, 
        transition: { 
          duration: 0.3, 
          ease: 'easeOut' 
        } 
      },
      exit: { 
        opacity: 0, 
        scale: 0.95, 
        transition: { 
          duration: 0.2, 
          ease: 'easeIn' 
        } 
      }
    },
    
    // Animation pour les notifications
    notification: {
      hidden: { 
        opacity: 0, 
        x: 50 
      },
      visible: { 
        opacity: 1, 
        x: 0, 
        transition: { 
          duration: 0.3 
        } 
      },
      exit: { 
        opacity: 0, 
        x: 50, 
        transition: { 
          duration: 0.2 
        } 
      }
    },
    
    // Animation pour les boutons et éléments interactifs
    buttonTap: prefersReducedMotion 
      ? {} 
      : { 
          scale: 0.95,
          transition: { 
            duration: 0.1 
          }
        },
    
    // Animation pour le hover
    hover: prefersReducedMotion
      ? {}
      : {
          scale: 1.02,
          transition: { 
            duration: 0.2 
          }
        },
        
    // Animation pour le drag
    drag: {
      initial: { 
        opacity: 1 
      },
      drag: { 
        opacity: 0.8, 
        scale: 1.02, 
        zIndex: 10, 
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' 
      }
    }
  }), [prefersReducedMotion]);
  
  return {
    animations,
    prefersReducedMotion
  };
}; 
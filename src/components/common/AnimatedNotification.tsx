import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from '../../hooks/useAnimations';

interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  isVisible: boolean;
  onClose: (id: string) => void;
  duration?: number;
}

/**
 * Composant de notification animée
 * Affiche une notification temporaire avec animation
 */
export const AnimatedNotification: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  title,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const { animations } = useAnimations();
  
  // Fermeture automatique après la durée spécifiée
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible, duration, onClose, id]);
  
  // Couleurs et icônes en fonction du type de notification
  const typeStyles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20',
      border: 'border-green-400 dark:border-green-700',
      icon: (
        <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: title || 'Succès',
      titleColor: 'text-green-700 dark:text-green-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20',
      border: 'border-red-400 dark:border-red-700',
      icon: (
        <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      title: title || 'Erreur',
      titleColor: 'text-red-700 dark:text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20',
      border: 'border-yellow-400 dark:border-yellow-700',
      icon: (
        <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: title || 'Attention',
      titleColor: 'text-yellow-700 dark:text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20',
      border: 'border-blue-400 dark:border-blue-700',
      icon: (
        <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: title || 'Information',
      titleColor: 'text-blue-700 dark:text-blue-400',
    },
  };
  
  const style = typeStyles[type];
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animations.notification}
          className={`rounded-md border ${style.border} ${style.bg} p-4 shadow-md mb-4 max-w-md w-full`}
          role="alert"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {style.icon}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${style.titleColor}`}>
                {style.title}
              </h3>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                <p>{message}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className={`inline-flex rounded-md p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-500`}
                  onClick={() => onClose(id)}
                  aria-label="Fermer"
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from '../../hooks/useAnimations';
import { createPortal } from 'react-dom';

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Composant de modale animée
 * Affiche une modale avec une animation d'entrée et de sortie
 */
export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
}) => {
  const { animations } = useAnimations();
  
  // Fermer la modale avec la touche Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Empêcher le défilement du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Classes pour les différentes tailles de modale
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animations.modal}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full ${sizeClasses[size]} z-50`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
            >
              {/* Modal header */}
              {title && (
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 
                    id="modal-title" 
                    className="text-lg font-medium text-gray-900 dark:text-white"
                  >
                    {title}
                  </h3>
                </div>
              )}
              
              {/* Modal body */}
              <div className="px-6 py-4">
                {children}
              </div>
              
              {/* Modal footer */}
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={onClose}
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  
  return createPortal(modalContent, document.body);
}; 
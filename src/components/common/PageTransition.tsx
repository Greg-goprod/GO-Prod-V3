import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
  transitionKey?: string;
}

/**
 * Composant de transition de page
 * Ajoute des animations de transition entre les différentes pages
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  transitionKey 
}) => {
  const location = useLocation();
  const key = transitionKey || location.pathname;
  
  // Variantes d'animation pour les pages
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    out: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}; 
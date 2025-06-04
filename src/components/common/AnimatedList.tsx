import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from '../../hooks/useAnimations';

interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  className?: string;
  itemClassName?: string;
}

/**
 * Composant de liste avec animation
 * Anime l'apparition et la disparition des éléments de la liste
 */
export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  className = '',
  itemClassName = '',
}: AnimatedListProps<T>) {
  const { animations } = useAnimations();
  
  return (
    <ul className={className}>
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <motion.li
            key={keyExtractor(item)}
            custom={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={animations.listItem}
            className={itemClassName}
            layout
          >
            {renderItem(item, index)}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
} 
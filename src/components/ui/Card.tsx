import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { effects } from '../../lib/design-tokens';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
  bgColor?: boolean;
}

/**
 * Composant Card standardisé
 * Utilisé pour regrouper des informations associées dans un conteneur visuel
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hoverable = false, bordered = true, compact = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'bg-white dark:bg-dark-800 rounded-md overflow-hidden transition-all',
          
          // Border
          bordered && 'border border-gray-200 dark:border-dark-700',
          
          // Shadow
          !hoverable && effects.boxShadow.card,
          hoverable && 'hover:shadow-card-hover cursor-pointer',
          
          // Padding
          !compact && 'p-4',
          compact && 'p-3',
          
          // Custom classes
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * En-tête de carte
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, separator = true, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          'px-4 py-3 -mx-4 -mt-4 mb-4',
          separator && 'border-b border-gray-200 dark:border-dark-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Contenu principal de la carte
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, padding = 'md', ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          {
            'p-0': padding === 'none',
            'p-2': padding === 'sm',
            'p-4': padding === 'md',
            'p-6': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * Pied de carte
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, separator = true, bgColor = true, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          'px-4 py-3 -mx-4 -mb-4 mt-4',
          separator && 'border-t border-gray-200 dark:border-dark-700',
          bgColor && 'bg-gray-50 dark:bg-dark-850',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
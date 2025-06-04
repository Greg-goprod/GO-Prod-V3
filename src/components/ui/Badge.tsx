import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ComponentSize } from '../../lib/design-tokens';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: ComponentSize;
  rounded?: boolean;
}

/**
 * Composant Badge standardisé
 * Utilisé pour afficher des statuts, notifications ou étiquettes
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', rounded = false, children, ...props }, ref) => {
    // Déterminer les styles de variante à appliquer
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 dark:bg-dark-700 dark:text-gray-300',
      primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
      secondary: 'bg-gray-100 text-gray-800 dark:bg-dark-700 dark:text-gray-300',
      success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
      warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
      error: 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300',
      outline: 'bg-transparent border border-current text-gray-600 dark:text-gray-400',
    };
    
    // Déterminer les styles de taille à appliquer
    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-sm',
      xl: 'px-3.5 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center font-medium',
          rounded ? 'rounded-full' : 'rounded-md',
          
          // Variant styles
          variantClasses[variant],
          
          // Size styles
          sizeClasses[size],
          
          // Custom classes
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
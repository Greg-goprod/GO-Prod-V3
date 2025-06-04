import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ComponentSize } from '../../lib/design-tokens';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: ComponentSize;
  error?: boolean;
  label?: string;
  description?: string;
}

/**
 * Composant Switch standardisé
 * Utilisé pour les options de type booléen (on/off)
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size = 'md', error, label, description, ...props }, ref) => {
    const id = React.useId();
    
    // Définir les tailles en fonction du design token
    const sizeStyles = {
      xs: {
        switch: 'w-7 h-3.5',
        thumb: 'w-2.5 h-2.5 peer-checked:translate-x-3.5',
        container: 'h-4'
      },
      sm: {
        switch: 'w-8 h-4',
        thumb: 'w-3 h-3 peer-checked:translate-x-4',
        container: 'h-5'
      },
      md: {
        switch: 'w-11 h-6',
        thumb: 'w-5 h-5 peer-checked:translate-x-5',
        container: 'h-7'
      },
      lg: {
        switch: 'w-14 h-7',
        thumb: 'w-6 h-6 peer-checked:translate-x-7',
        container: 'h-8'
      },
      xl: {
        switch: 'w-16 h-8',
        thumb: 'w-7 h-7 peer-checked:translate-x-8',
        container: 'h-9'
      }
    };
    
    const currentSize = sizeStyles[size];

    return (
      <div className={cn('flex items-center', className)}>
        <label 
          htmlFor={id}
          className={cn(
            'relative inline-flex items-center',
            currentSize.container
          )}
        >
          <input
            id={id}
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          <div className={cn(
            // Base styles
            'relative rounded-full transition-colors',
            'bg-gray-300 dark:bg-gray-600',
            'cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'peer-checked:bg-primary-500 dark:peer-checked:bg-primary-500',
            'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
            
            // Error state
            error && 'border-2 border-error-500 dark:border-error-500',
            
            // Size
            currentSize.switch
          )}>
            <span className={cn(
              // Base styles for thumb
              'absolute top-0.5 left-0.5 bg-white rounded-full transition-transform',
              'shadow-sm',
              'peer-checked:translate-x-full peer-checked:transform',
              
              // Size
              currentSize.thumb
            )} />
          </div>
        </label>
        
        {(label || description) && (
          <div className="ml-2">
            {label && (
              <label 
                htmlFor={id}
                className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
              >
                {label}
              </label>
            )}
            
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch'; 
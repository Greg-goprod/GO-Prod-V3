import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';
import { ComponentSize, InputVariant } from '../../lib/design-tokens';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  error?: boolean;
  fullWidth?: boolean;
  size?: ComponentSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
}

/**
 * Composant Select standardisé
 * Permet à l'utilisateur de sélectionner une option parmi une liste
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    options, 
    error, 
    fullWidth = false, 
    size = 'md', 
    variant = 'default',
    leftIcon, 
    label,
    helperText,
    ...props 
  }, ref) => {
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            className={cn(
              // Base styles
              'block appearance-none rounded-md shadow-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2',
              'disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-dark-700 dark:disabled:text-gray-400 disabled:cursor-not-allowed',
              
              // Variant styles
              {
                // Default variant
                'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus-visible:ring-primary-500 focus-visible:border-primary-500': 
                  variant === 'default',
                
                // Filled variant
                'border-transparent bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white focus-visible:ring-primary-500 focus-visible:bg-gray-50 dark:focus-visible:bg-dark-800': 
                  variant === 'filled',
                
                // Outline variant
                'bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus-visible:ring-primary-500 focus-visible:border-primary-500': 
                  variant === 'outline',
              },
              
              // Error state
              error && 'border-error-500 dark:border-error-500 focus-visible:border-error-500 focus-visible:ring-error-500',
              
              // Icon padding
              leftIcon && 'pl-10',
              'pr-10', // Space for the dropdown icon
              
              // Size styles
              {
                'h-7 text-xs': size === 'xs',
                'h-8 text-sm': size === 'sm',
                'h-10 text-sm': size === 'md',
                'h-12 text-base': size === 'lg',
                'h-14 text-lg': size === 'xl',
              },
              
              // Full width
              fullWidth && 'w-full',
              
              // Custom classes
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value} 
                disabled={option.disabled}
                className="py-1"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
            <ChevronDown size={16} className="opacity-70" />
          </div>
        </div>
        
        {helperText && (
          <p className={cn(
            "mt-1 text-xs",
            error ? "text-error-600 dark:text-error-500" : "text-gray-500 dark:text-gray-400"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
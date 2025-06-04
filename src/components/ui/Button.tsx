import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ButtonVariant, ComponentSize } from '../../lib/design-tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Composant Button standardisé
 * Utilise les design tokens pour garantir la cohérence
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    fullWidth = false,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          
          // Variant styles
          {
            // Primary button
            'bg-primary-600 hover:bg-primary-700 text-white focus-visible:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700 dark:text-white': 
              variant === 'primary',
            
            // Secondary button
            'bg-gray-600 hover:bg-gray-700 text-white focus-visible:ring-gray-500 dark:bg-dark-600 dark:hover:bg-dark-700 dark:text-white': 
              variant === 'secondary',
            
            // Outline button
            'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 focus-visible:ring-primary-500 dark:bg-dark-800 dark:hover:bg-dark-700 dark:text-gray-200 dark:border-gray-600': 
              variant === 'outline',
            
            // Ghost button
            'bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-primary-500 dark:hover:bg-dark-800 dark:text-gray-200': 
              variant === 'ghost',
            
            // Link button
            'bg-transparent text-primary-600 hover:underline focus-visible:ring-primary-500 dark:text-primary-400 p-0': 
              variant === 'link',
            
            // Danger button
            'bg-error-600 hover:bg-error-700 text-white focus-visible:ring-error-500 dark:bg-error-600 dark:hover:bg-error-700': 
              variant === 'danger',
          },
          
          // Size styles
          {
            'px-2 py-1 text-xs rounded': size === 'xs',
            'px-2.5 py-1.5 text-sm rounded': size === 'sm',
            'px-4 py-2 text-sm rounded-md': size === 'md',
            'px-5 py-2.5 text-base rounded-md': size === 'lg',
            'px-6 py-3 text-lg rounded-lg': size === 'xl',
          },
          
          // Full width
          fullWidth && 'w-full',
          
          // Custom classes
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
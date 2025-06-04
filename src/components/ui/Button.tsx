import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

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
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-900',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500': 
              variant === 'primary',
            'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500': 
              variant === 'secondary',
            'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 dark:bg-dark-800 dark:hover:bg-dark-700 dark:text-gray-200 dark:border-gray-600 focus:ring-primary-500': 
              variant === 'outline',
            'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-dark-800 dark:text-gray-200 focus:ring-primary-500': 
              variant === 'ghost',
            'bg-transparent text-primary-600 hover:underline dark:text-primary-400 focus:ring-primary-500': 
              variant === 'link',
            'bg-error-600 hover:bg-error-700 text-white focus:ring-error-500': 
              variant === 'danger',
          },
          {
            'px-2.5 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-5 py-2.5 text-lg': size === 'lg',
          },
          fullWidth && 'w-full',
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
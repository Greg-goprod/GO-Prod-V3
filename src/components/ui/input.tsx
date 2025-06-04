import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, fullWidth = false, size = 'md', type = 'text', ...props }, ref) => {
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'block rounded-md shadow-sm transition duration-200 h-8 py-1 text-sm',
            'border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-dark-800',
            'text-gray-900 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400',
            'disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-dark-700 dark:disabled:text-gray-400 disabled:cursor-not-allowed',
            error && 'border-error-500 dark:border-error-500 focus:border-error-500 focus:ring-error-500 dark:focus:ring-error-400',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            size === 'sm' && 'px-2 text-xs',
            size === 'md' && 'px-3 text-sm',
            size === 'lg' && 'px-4 text-base',
            fullWidth && 'w-full',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
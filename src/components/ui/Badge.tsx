import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantStyles = {
    default: 'bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-300',
    primary: 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300',
    secondary: 'bg-secondary-100 dark:bg-secondary-900/50 text-secondary-800 dark:text-secondary-300',
    success: 'bg-success-100 dark:bg-success-900/50 text-success-800 dark:text-success-300',
    warning: 'bg-warning-100 dark:bg-warning-900/50 text-warning-800 dark:text-warning-300',
    error: 'bg-error-100 dark:bg-error-900/50 text-error-800 dark:text-error-300',
    outline: 'bg-transparent border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300',
  };

  return (
    <span
      className={clsx(
        baseStyles,
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
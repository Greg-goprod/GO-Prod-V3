import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size = 'md', error, ...props }, ref) => {
    return (
      <label className={cn(
        'relative inline-flex items-center',
        size === 'sm' && 'h-4',
        size === 'md' && 'h-6',
        size === 'lg' && 'h-7',
        className
      )}>
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          {...props}
        />
        <div className={cn(
          'relative rounded-full transition-colors',
          'bg-gray-300 dark:bg-gray-600',
          'focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400',
          'peer-checked:bg-primary-500 dark:peer-checked:bg-primary-400',
          error && 'border-2 border-error-500 dark:border-error-500',
          size === 'sm' && 'w-8 h-4',
          size === 'md' && 'w-11 h-6',
          size === 'lg' && 'w-14 h-7',
          'peer'
        )}>
          <span className={cn(
            'absolute top-0.5 left-0.5 bg-white rounded-full transition-transform',
            'shadow-sm',
            'peer-checked:translate-x-full peer-checked:transform',
            size === 'sm' && 'w-3 h-3 peer-checked:translate-x-4',
            size === 'md' && 'w-5 h-5 peer-checked:translate-x-5',
            size === 'lg' && 'w-6 h-6 peer-checked:translate-x-7',
          )} />
        </div>
      </label>
    );
  }
);

Switch.displayName = 'Switch'; 
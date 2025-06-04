import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  error?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, fullWidth = false, size = 'md', leftIcon, label, ...props }, ref) => {
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            className={cn(
              'block appearance-none w-full text-sm',
              'h-8 min-h-[2rem]', // Reduced height
              'px-2 py-1', // Reduced padding
              'rounded-md border border-gray-300 dark:border-dark-600',
              'bg-white dark:bg-dark-800',
              'text-gray-900 dark:text-white',
              'shadow-sm hover:shadow focus:shadow-md transition-shadow duration-200',
              'focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              leftIcon && 'pl-8',
              'pr-8', // Space for the dropdown icon
              error && 'border-error-500 dark:border-error-500',
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
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-500 dark:text-gray-400">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
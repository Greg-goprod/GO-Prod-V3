import React from 'react';
import { cn } from '../../lib/utils';

interface FormLayoutProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  span?: 1 | 2 | 3 | 4 | 5 | 6;
  labelPosition?: 'top' | 'left';
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const FormLayout: React.FC<FormLayoutProps> & {
  Field: React.FC<FormFieldProps>;
  Section: React.FC<FormSectionProps>;
  Actions: React.FC<FormActionsProps>;
} = ({ children, onSubmit, className }) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className={cn('space-y-6', className)}
    >
      {children}
    </form>
  );
};

const Field: React.FC<FormFieldProps> = ({ 
  label, 
  children, 
  error, 
  hint,
  required = false,
  span = 3,
  labelPosition = 'top'
}) => {
  return (
    <div className={cn(
      'mb-4',
      {
        'col-span-1': span === 1,
        'col-span-2': span === 2,
        'col-span-3': span === 3,
        'col-span-4': span === 4,
        'col-span-5': span === 5,
        'col-span-6': span === 6,
      }
    )}>
      <div className={cn(
        labelPosition === 'top' ? 'flex flex-col' : 'flex items-center gap-3'
      )}>
        <label 
          className={cn(
            'block text-sm font-medium', 
            labelPosition === 'left' && 'w-1/3',
            'text-gray-700 dark:text-gray-200'
          )}
        >
          {label}
          {required && <span className="ml-1 text-error-500">*</span>}
        </label>
        <div className={cn(
          'mt-1',
          labelPosition === 'left' && 'w-2/3',
          'w-full shadow-sm'
        )}>
          {children}
          {(error || hint) && (
            <p className={cn(
              'mt-1 text-xs',
              error 
                ? 'text-error-600 dark:text-error-400' 
                : 'text-gray-500 dark:text-gray-400'
            )}>
              {error || hint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<FormSectionProps> = ({ 
  title, 
  description, 
  children,
  className
}) => {
  return (
    <div className={cn('mb-8', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-6 gap-4">
        {children}
      </div>
    </div>
  );
};

const Actions: React.FC<FormActionsProps> = ({ 
  children,
  className,
  align = 'right'
}) => {
  return (
    <div className={cn(
      'mt-8 pt-5 border-t border-gray-200 dark:border-gray-700',
      {
        'flex justify-start': align === 'left',
        'flex justify-center': align === 'center',
        'flex justify-end': align === 'right',
      },
      'space-x-3',
      className
    )}>
      {children}
    </div>
  );
};

FormLayout.Field = Field;
FormLayout.Section = Section;
FormLayout.Actions = Actions;

export default FormLayout;
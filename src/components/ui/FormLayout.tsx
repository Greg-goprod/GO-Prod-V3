import React from 'react';
import { cn } from '../../lib/utils';

export interface FormLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

/**
 * Composant FormLayout standardisé
 * Utilisé pour structurer les formulaires avec un espacement cohérent
 */
export const FormLayout = ({
  children,
  columns = 1,
  gap = 'md',
  fullWidth = false,
  className,
  ...props
}: FormLayoutProps) => {
  // Classes pour les différentes tailles d'espacement
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  // Classes pour les différentes configurations de colonnes
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        fullWidth ? 'w-full' : 'max-w-5xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Composant FormField utilisé à l'intérieur de FormLayout
 * Permet de configurer la disposition d'un champ individuel
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 'full';
}

export const FormField = ({
  children,
  span = 1,
  className,
  ...props
}: FormFieldProps) => {
  // Classes pour les différentes étendues de colonnes
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 lg:col-span-3',
    4: 'col-span-1 md:col-span-2 lg:col-span-4',
    'full': 'col-span-full',
  };

  return (
    <div
      className={cn(
        spanClasses[span],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Composant FormSection pour organiser les champs en sections
 */
export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  description?: string;
  span?: 1 | 2 | 3 | 4 | 'full';
}

export const FormSection = ({
  children,
  title,
  description,
  span = 'full',
  className,
  ...props
}: FormSectionProps) => {
  // Classes pour les différentes étendues de colonnes
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 lg:col-span-3',
    4: 'col-span-1 md:col-span-2 lg:col-span-4',
    'full': 'col-span-full',
  };

  return (
    <div
      className={cn(
        spanClasses[span],
        'mb-6',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4 border-b border-gray-200 dark:border-dark-700 pb-3">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
};
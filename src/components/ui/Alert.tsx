import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  hideIcon?: boolean;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

/**
 * Composant Alert standardisé
 * Utilisé pour afficher des messages importants à l'utilisateur
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, children, variant = 'info', title, hideIcon = false, ...props }, ref) => {
    const Icon = icons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          // Base styles
          'flex p-4 rounded-lg border',
          
          // Variant styles
          {
            'bg-primary-50 text-primary-800 border-primary-200 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-800/30': 
              variant === 'info',
            
            'bg-success-50 text-success-800 border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-800/30': 
              variant === 'success',
            
            'bg-warning-50 text-warning-800 border-warning-200 dark:bg-warning-900/20 dark:text-warning-300 dark:border-warning-800/30': 
              variant === 'warning',
            
            'bg-error-50 text-error-800 border-error-200 dark:bg-error-900/20 dark:text-error-300 dark:border-error-800/30': 
              variant === 'error',
          },
          
          // Custom classes
          className
        )}
        {...props}
      >
        {!hideIcon && Icon && (
          <Icon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
        )}
        
        <div className="flex-1">
          {title && (
            <h5 className="font-medium mb-1">{title}</h5>
          )}
          <div className={title ? 'text-sm' : ''}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
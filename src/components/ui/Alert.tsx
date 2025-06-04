import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import clsx from 'clsx';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

const styles = {
  info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  success: 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  error: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  className,
}) => {
  const Icon = icons[variant];

  return (
    <div
      className={clsx(
        'flex items-center p-4 rounded-lg',
        styles[variant],
        className
      )}
    >
      {Icon && <Icon className="w-5 h-5 mr-3" />}
      <div>{children}</div>
    </div>
  );
};
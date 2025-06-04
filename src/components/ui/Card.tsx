import React from 'react';
import clsx from 'clsx';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  hoverable = false,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-dark-800 rounded-md border border-gray-200 dark:border-dark-700 overflow-hidden transition-shadow duration-200',
        'p-3',
        hoverable && 'hover:shadow-card-hover cursor-pointer',
        !hoverable && 'shadow-card',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return <div className={clsx('px-3 py-2 border-b border-gray-200 dark:border-dark-700', className)}>{children}</div>;
};

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return <div className={clsx('p-3', className)}>{children}</div>;
};

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return <div className={clsx('px-3 py-2 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800', className)}>{children}</div>;
};
import React from 'react';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  rightContent,
}) => {
  return (
    <div className="pb-5 border-b border-gray-200 dark:border-dark-700 sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-gray-800 dark:text-gray-400">{description}</p>
        )}
      </div>
      <div className="mt-3 flex sm:mt-0 sm:ml-4">
        {rightContent}
        {actionLabel && onAction && (
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
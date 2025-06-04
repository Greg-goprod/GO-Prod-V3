import React from 'react';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-3 bg-gray-100 dark:bg-dark-800 rounded-full mb-4 text-gray-600 dark:text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-800 dark:text-gray-400 mb-6 max-w-md">{description}</p>
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
  );
};
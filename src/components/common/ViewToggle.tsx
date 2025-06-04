import React from 'react';
import { Grid, List } from 'lucide-react';
import { ViewMode } from '../../types';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-dark-800 rounded-md">
      <button
        className={`flex items-center justify-center p-2 ${
          currentView === 'grid'
            ? 'bg-white dark:bg-dark-700 text-primary-700 dark:text-primary-400 rounded-md shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
      >
        <Grid size={18} />
      </button>
      <button
        className={`flex items-center justify-center p-2 ${
          currentView === 'list'
            ? 'bg-white dark:bg-dark-700 text-primary-700 dark:text-primary-400 rounded-md shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
        onClick={() => onViewChange('list')}
        aria-label="List view"
      >
        <List size={18} />
      </button>
    </div>
  );
};
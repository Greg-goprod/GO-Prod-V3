import React from 'react';
import { PageHeader } from '../components/common/PageHeader';

export const TimetablePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable"
        description="Planning des performances"
      />
    </div>
  );
};
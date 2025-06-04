import React from 'react';
import { PageHeader } from '../components/common/PageHeader';

export const LineupPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Line-up"
        description="Gérer le line-up du festival"
      />
    </div>
  );
};
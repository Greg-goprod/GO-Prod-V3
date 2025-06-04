import React from 'react';
import { PageHeader } from '../components/common/PageHeader';

export const FinancesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Finances"
        description="Gestion financière"
      />
    </div>
  );
};
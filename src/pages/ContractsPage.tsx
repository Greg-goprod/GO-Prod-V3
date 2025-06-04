import React from 'react';
import { PageHeader } from '../components/common/PageHeader';

export const ContractsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Contrats"
        description="Gestion des contrats"
      />
    </div>
  );
};
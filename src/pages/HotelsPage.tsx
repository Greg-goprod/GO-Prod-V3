import React from 'react';
import { PageHeader } from '../components/common/PageHeader';

export const HotelsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hôtels"
        description="Gestion des hôtels"
      />
    </div>
  );
};
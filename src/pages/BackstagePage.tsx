import React from 'react';
import { PageHeader } from '../components/common/PageHeader';

export const BackstagePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Backstage"
        description="Gestion du backstage"
      />
    </div>
  );
};
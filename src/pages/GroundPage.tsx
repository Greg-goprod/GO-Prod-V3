import React from 'react';
import { PageHeader } from '../components/common/PageHeader';

export const GroundPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ground"
        description="Gestion du ground"
      />
    </div>
  );
};
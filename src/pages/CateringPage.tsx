import React from 'react';
import { PageHeader } from '../components/common/PageHeader';

export const CateringPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Catering"
        description="Gestion du catering"
      />
    </div>
  );
};
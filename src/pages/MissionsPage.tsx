import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Plus } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { MissionsList } from '../components/missions/MissionsList';
import { MissionForm } from '../components/missions/MissionForm';
import { Modal } from '../components/ui/Modal';

export const MissionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');

  const handleOpenMap = () => {
    window.open('/missions/map', 'Carte des missions', 'width=1200,height=800');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('missions.title')}
        description={t('missions.description')}
        actionLabel={t('missions.addMission')}
        onAction={() => setIsFormOpen(true)}
        rightContent={
          <Button
            variant="outline"
            onClick={handleOpenMap}
            icon={<MapPin size={18} />}
          >
            {t('missions.openMap')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder={t('missions.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: t('missions.allStatuses') },
            { value: 'pending', label: t('missions.statuses.pending') },
            { value: 'assigned', label: t('missions.statuses.assigned') },
            { value: 'in_progress', label: t('missions.statuses.inProgress') },
            { value: 'completed', label: t('missions.statuses.completed') }
          ]}
        />

        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <Select
          value={driverFilter}
          onChange={(e) => setDriverFilter(e.target.value)}
          options={[
            { value: '', label: t('missions.allDrivers') }
            // Drivers will be loaded from the database
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <MissionsList
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            dateFilter={dateFilter}
            driverFilter={driverFilter}
            vehicleFilter={vehicleFilter}
          />
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={t('missions.newMission')}
        size="lg"
      >
        <MissionForm
          onSubmit={async (data) => {
            // Handle form submission
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
};
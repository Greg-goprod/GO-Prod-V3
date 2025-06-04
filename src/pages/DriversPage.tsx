import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, UserCheck } from 'lucide-react';
import { Driver } from '../types';
import { useSupabase } from '../lib/supabaseClient';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ViewToggle } from '../components/common/ViewToggle';
import { DriverForm } from '../components/drivers/DriverForm';
import { DriverTable } from '../components/drivers/DriverTable';
import { DriverCard } from '../components/drivers/DriverCard';
import { Alert } from '../components/ui/Alert';

export const DriversPage: React.FC = () => {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Driver | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDrivers(data.map(driver => ({
        id: driver.id,
        firstName: driver.first_name,
        lastName: driver.last_name,
        street: driver.street,
        postalCode: driver.postal_code,
        city: driver.city,
        email: driver.email,
        phone: driver.phone,
        birthDate: driver.birth_date,
        languages: driver.languages || [],
        tShirtSize: driver.t_shirt_size,
        hiredSince: driver.hired_year,
        permits: driver.permits,
        notes: driver.notes
      })));
    } catch (error: any) {
      console.error('Error fetching drivers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Driver, 'id'>) => {
    try {
      setError(null);
      const driverData = {
        first_name: data.firstName,
        last_name: data.lastName,
        street: data.street,
        postal_code: data.postalCode,
        city: data.city,
        email: data.email,
        phone: data.phone,
        birth_date: data.birthDate,
        languages: data.languages,
        t_shirt_size: data.tShirtSize,
        hired_year: data.hiredSince,
        permits: data.permits,
        notes: data.notes
      };

      let error;

      if (currentDriver) {
        // Check if email is being changed and if it's already in use
        if (currentDriver.email !== data.email) {
          const { data: existingDriver } = await supabase
            .from('drivers')
            .select('id')
            .eq('email', data.email)
            .single();

          if (existingDriver) {
            throw new Error('Un chauffeur avec cet email existe déjà');
          }
        }

        // Update existing driver
        ({ error } = await supabase
          .from('drivers')
          .update(driverData)
          .eq('id', currentDriver.id));
      } else {
        // Check if email exists before creating
        const { data: existingDriver } = await supabase
          .from('drivers')
          .select('id')
          .eq('email', data.email)
          .single();

        if (existingDriver) {
          throw new Error('Un chauffeur avec cet email existe déjà');
        }

        // Create new driver
        ({ error } = await supabase
          .from('drivers')
          .insert(driverData));
      }

      if (error) throw error;

      await fetchDrivers();
      setIsModalOpen(false);
      setCurrentDriver(undefined);
    } catch (error: any) {
      console.error('Error saving driver:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchDrivers();
    } catch (error: any) {
      console.error('Error deleting driver:', error);
      setError(error.message);
    }
  };

  const filteredDrivers = drivers.filter(driver => 
    `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('drivers.title')}
        description={t('drivers.description')}
        actionLabel={t('drivers.addDriver')}
        onAction={() => {
          setCurrentDriver(undefined);
          setIsModalOpen(true);
        }}
        rightContent={
          <ViewToggle
            currentView={viewMode}
            onViewChange={setViewMode}
          />
        }
      />

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : drivers.length === 0 ? (
        <EmptyState
          title={t('drivers.noDrivers')}
          description={t('drivers.addFirst')}
          icon={<UserCheck size={24} />}
          actionLabel={t('drivers.addDriver')}
          onAction={() => {
            setCurrentDriver(undefined);
            setIsModalOpen(true);
          }}
        />
      ) : filteredDrivers.length === 0 ? (
        <EmptyState
          title={t('common.noResults')}
          description={`${t('common.noResults')} "${searchTerm}"`}
          icon={<Search size={24} />}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onEdit={(driver) => {
                setCurrentDriver(driver);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <DriverTable
          drivers={filteredDrivers}
          onEdit={(driver) => {
            setCurrentDriver(driver);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentDriver(undefined);
          setError(null);
        }}
        title={currentDriver ? t('drivers.editDriver') : t('drivers.addDriver')}
        size="xl"
      >
        <DriverForm
          driver={currentDriver}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setCurrentDriver(undefined);
            setError(null);
          }}
        />
      </Modal>
    </div>
  );
};
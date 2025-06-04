import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Car } from 'lucide-react';
import { Vehicle, ViewMode } from '../types';
import { useSupabase } from '../lib/supabaseClient';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { ViewToggle } from '../components/common/ViewToggle';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { VehicleTable } from '../components/vehicles/VehicleTable';
import { VehicleGrid } from '../components/vehicles/VehicleGrid';

interface VehicleWithRelations extends Omit<Vehicle, 'reception' | 'return'> {
  reception?: { date: string; kilometers: number; defects?: string; notes?: string };
  return?: { date: string; kilometers: number; defects?: string; notes?: string };
}

export const VehiclesPage: React.FC = () => {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVehicles = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          id,
          brand,
          model,
          type,
          color,
          passenger_capacity,
          luggage_capacity,
          engagement_number,
          registration_number,
          fuel_type,
          status,
          supplier,
          additional_equipment,
          reception:vehicle_check_logs(date, kilometers, defects, notes).type.eq.RECEPTION,
          return:vehicle_check_logs(date, kilometers, defects, notes).type.eq.RETURN
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our expected format
      const formattedData = data?.map((vehicle: VehicleWithRelations) => ({
        ...vehicle,
        reception: vehicle.reception?.[0],
        return: vehicle.return?.[0]
      })) || [];

      setVehicles(formattedData);
    } catch (err) {
      setError(t('common.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchVehicles();
    } catch (err) {
      setError(t('common.errors.deleteFailed'));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('vehicles.title')}
        description={t('vehicles.description')}
        actionLabel={t('vehicles.addVehicle')}
        onAction={() => setIsModalOpen(true)}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <EmptyState
          title={t('vehicles.noVehicles')}
          description={t('vehicles.addFirst')}
          icon={<Car size={24} />}
          actionLabel={t('vehicles.addVehicle')}
          onAction={() => setIsModalOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <VehicleGrid
          vehicles={vehicles}
          onEdit={(vehicle: Vehicle) => {
            setCurrentVehicle(vehicle);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onEdit={(vehicle: Vehicle) => {
            setCurrentVehicle(vehicle);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentVehicle(undefined);
        }}
        title={currentVehicle ? t('vehicles.editVehicle') : t('vehicles.addVehicle')}
      >
        <VehicleForm
          vehicle={currentVehicle}
          onSubmit={async (data: Omit<Vehicle, 'id'>) => {
            try {
              if (currentVehicle) {
                // Update existing vehicle
                const { error: vehicleError } = await supabase
                  .from('vehicles')
                  .update({
                    brand: data.brand,
                    model: data.model,
                    type: data.type,
                    color: data.color,
                    passenger_capacity: data.passenger_capacity,
                    luggage_capacity: data.luggage_capacity,
                    engagement_number: data.engagement_number,
                    registration_number: data.registration_number,
                    fuel_type: data.fuel_type,
                    status: data.status,
                    supplier: data.supplier,
                    additional_equipment: data.additional_equipment
                  })
                  .eq('id', currentVehicle.id);

                if (vehicleError) throw vehicleError;

                // Update check logs if provided
                if (data.reception) {
                  await supabase
                    .from('vehicle_check_logs')
                    .upsert({
                      vehicle_id: currentVehicle.id,
                      type: 'RECEPTION',
                      date: data.reception.date,
                      kilometers: data.reception.kilometers,
                      defects: data.reception.defects,
                      notes: data.reception.notes
                    });
                }

                if (data.return) {
                  await supabase
                    .from('vehicle_check_logs')
                    .upsert({
                      vehicle_id: currentVehicle.id,
                      type: 'RETURN',
                      date: data.return.date,
                      kilometers: data.return.kilometers,
                      defects: data.return.defects,
                      notes: data.return.notes
                    });
                }
              } else {
                // Create new vehicle
                const { data: newVehicle, error: vehicleError } = await supabase
                  .from('vehicles')
                  .insert({
                    brand: data.brand,
                    model: data.model,
                    type: data.type,
                    color: data.color,
                    passenger_capacity: data.passenger_capacity,
                    luggage_capacity: data.luggage_capacity,
                    engagement_number: data.engagement_number,
                    registration_number: data.registration_number,
                    fuel_type: data.fuel_type,
                    status: data.status,
                    supplier: data.supplier,
                    additional_equipment: data.additional_equipment
                  })
                  .select('id')
                  .single();

                if (vehicleError || !newVehicle) throw vehicleError || new Error('Failed to create vehicle');

                // Create check logs if provided
                if (data.reception) {
                  await supabase
                    .from('vehicle_check_logs')
                    .insert({
                      vehicle_id: newVehicle.id,
                      type: 'RECEPTION',
                      date: data.reception.date,
                      kilometers: data.reception.kilometers,
                      defects: data.reception.defects,
                      notes: data.reception.notes
                    });
                }

                if (data.return) {
                  await supabase
                    .from('vehicle_check_logs')
                    .insert({
                      vehicle_id: newVehicle.id,
                      type: 'RETURN',
                      date: data.return.date,
                      kilometers: data.return.kilometers,
                      defects: data.return.defects,
                      notes: data.return.notes
                    });
                }
              }

              await fetchVehicles();
              setIsModalOpen(false);
              setCurrentVehicle(undefined);
            } catch (err) {
              console.error('Error saving vehicle:', err);
              setError(t('common.errors.saveFailed'));
            }
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setCurrentVehicle(undefined);
          }}
        />
      </Modal>
    </div>
  );
};
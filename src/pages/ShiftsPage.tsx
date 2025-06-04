import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Calendar, Grid, List } from 'lucide-react';
import { Shift } from '../types';
import { useSupabase } from '../lib/supabaseClient';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { ShiftForm } from '../components/shifts/ShiftForm';
import { ShiftTable } from '../components/shifts/ShiftTable';
import ShiftGrid from '../components/shifts/ShiftGrid';

type ViewMode = 'grid' | 'list';

export const ShiftsPage: React.FC = () => {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [shiftDrivers, setShiftDrivers] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [currentShift, setCurrentShift] = useState<Shift | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch shifts
      const { data: shiftsData, error: shiftsError } = await supabase
        .from('shifts')
        .select('*')
        .order('start_datetime', { ascending: true });

      if (shiftsError) throw shiftsError;

      // Fetch drivers
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select('id, first_name, last_name')
        .order('first_name');

      if (driversError) throw driversError;

      // Fetch shift-driver assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('shift_drivers')
        .select('*');

      if (assignmentsError) throw assignmentsError;

      // Process the data
      const shiftsWithData = shiftsData.map(shift => ({
        id: shift.id,
        name: shift.name,
        startDateTime: shift.start_datetime,
        endDateTime: shift.end_datetime,
        color: shift.color
      }));

      const driverAssignments = assignmentsData.reduce((acc: Record<string, string[]>, curr) => {
        if (!acc[curr.shift_id]) {
          acc[curr.shift_id] = [];
        }
        acc[curr.shift_id].push(curr.driver_id);
        return acc;
      }, {});

      setShifts(shiftsWithData);
      setDrivers(driversData);
      setShiftDrivers(driverAssignments);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (shift: Shift) => {
    setCurrentShift(shift);
    setIsShiftModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setShifts(shifts.filter(shift => shift.id !== id));
    } catch (error) {
      console.error('Error deleting shift:', error);
      setError('Failed to delete shift');
    }
  };

  const handleShiftSubmit = async (data: Omit<Shift, 'id' | 'driverIds'>) => {
    try {
      if (currentShift) {
        const { error: updateError } = await supabase
          .from('shifts')
          .update({
            name: data.name,
            start_datetime: data.startDateTime,
            end_datetime: data.endDateTime,
            color: data.color
          })
          .eq('id', currentShift.id);

        if (updateError) throw updateError;

        setShifts(shifts.map(shift =>
          shift.id === currentShift.id
            ? { ...shift, ...data }
            : shift
        ));
      }

      setIsShiftModalOpen(false);
    } catch (error) {
      console.error('Error saving shift:', error);
      setError('Failed to save shift');
    }
  };

  const getDriverNames = (shiftId: string): string[] => {
    const driverIds = shiftDrivers[shiftId] || [];
    return driverIds.map(id => {
      const driver = drivers.find(d => d.id === id);
      return driver ? `${driver.first_name} ${driver.last_name}` : '';
    }).filter(Boolean);
  };

  const filteredShifts = shifts.filter(shift => {
    if (!searchTerm) return true;
    
    const driverNamesForShift = getDriverNames(shift.id).join(' ').toLowerCase();
    const startDate = new Date(shift.startDateTime).toLocaleDateString();
    const shiftName = (shift.name || '').toLowerCase();
    
    return driverNamesForShift.includes(searchTerm.toLowerCase()) ||
           startDate.includes(searchTerm) ||
           shiftName.includes(searchTerm.toLowerCase());
  });

  const ViewToggle = () => (
    <div className="flex items-center bg-gray-100 dark:bg-dark-800 rounded-md">
      <Button
        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('grid')}
        icon={<Grid size={18} />}
      >
        {t('common.grid')}
      </Button>
      <Button
        variant={viewMode === 'list' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('list')}
        icon={<List size={18} />}
      >
        {t('common.list')}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('shifts.title')}
        description={t('shifts.description')}
        rightContent={<ViewToggle />}
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
      ) : shifts.length === 0 ? (
        <EmptyState
          title={t('shifts.noShifts')}
          description={t('shifts.description')}
          icon={<Calendar size={24} />}
        />
      ) : filteredShifts.length === 0 ? (
        <EmptyState
          title={t('common.noResults')}
          description={`${t('common.noResults')} "${searchTerm}"`}
          icon={<Search size={24} />}
        />
      ) : (
        viewMode === 'grid' ? (
          <ShiftGrid
            shifts={filteredShifts}
            getDriverName={getDriverNames}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ) : (
          <ShiftTable
            shifts={filteredShifts}
            getDriverName={getDriverNames}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )
      )}

      <Modal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        title={currentShift ? t('shifts.editShift') : t('shifts.addShift')}
      >
        <ShiftForm
          shift={currentShift}
          onSubmit={handleShiftSubmit}
          onCancel={() => setIsShiftModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
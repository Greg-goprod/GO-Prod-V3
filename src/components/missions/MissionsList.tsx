import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSupabase } from '../../lib/supabaseClient';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';

interface MissionsListProps {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  driverFilter: string;
  vehicleFilter: string;
}

export const MissionsList: React.FC<MissionsListProps> = ({
  searchTerm,
  statusFilter,
  dateFilter,
  driverFilter,
  vehicleFilter
}) => {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('shifts')
          .select(`
            *,
            driver:drivers(id, first_name, last_name)
          `)
          .order('start_datetime', { ascending: true });

        // Apply filters
        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }
        
        if (dateFilter) {
          const startDate = new Date(dateFilter);
          const endDate = new Date(dateFilter);
          endDate.setDate(endDate.getDate() + 1);
          
          query = query.gte('start_datetime', startDate.toISOString())
            .lt('start_datetime', endDate.toISOString());
        }
        
        if (driverFilter) {
          query = query.eq('driver_id', driverFilter);
        }

        if (searchTerm) {
          query = query.or(`
            name.ilike.%${searchTerm}%
          `);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setMissions(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [searchTerm, statusFilter, dateFilter, driverFilter, vehicleFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'assigned': return 'primary';
      case 'in_progress': return 'success';
      case 'completed': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (missions.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6 text-center text-gray-500 dark:text-gray-400">
        {t('missions.noMissionsFound')}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('missions.datetime')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('missions.name')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('missions.driver')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            {missions.map((mission) => (
              <tr key={mission.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {format(new Date(mission.start_datetime), 'Pp', { locale: fr })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {mission.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {mission.driver ? `${mission.driver.first_name} ${mission.driver.last_name}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit size={16} />}
                      aria-label={t('common.edit')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={16} />}
                      aria-label={t('common.delete')}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
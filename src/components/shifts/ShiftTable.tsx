import React, { useState } from 'react';
import { Edit, Trash2, Clock, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Shift } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useTranslation } from 'react-i18next';

interface ShiftTableProps {
  shifts: Shift[];
  getDriverName: (shiftId: string) => string[];
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
  onAssignDrivers: (shiftId: string) => void;
}

export const ShiftTable: React.FC<ShiftTableProps> = ({
  shifts,
  getDriverName,
  onEdit,
  onDelete,
  onAssignDrivers,
}) => {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return format(date, 'PPp', { locale: fr });
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHrs = Math.round(diffMs / (1000 * 60 * 60) * 10) / 10;
    return `${diffHrs} hours`;
  };

  const handleDeleteClick = (shift: Shift) => {
    setShiftToDelete(shift);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (shiftToDelete) {
      onDelete(shiftToDelete.id);
      setShowDeleteConfirm(false);
      setShiftToDelete(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-dark-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Time Period
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Drivers
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            {shifts.map((shift) => (
              <tr key={shift.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Clock size={16} />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDateTime(shift.startDateTime)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        to {formatDateTime(shift.endDateTime)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {getDuration(shift.startDateTime, shift.endDateTime)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {shift.name || '—'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex flex-wrap gap-2">
                      {getDriverName(shift.id).map((name, index) => (
                        <Badge key={index} variant="secondary">
                          {name}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAssignDrivers(shift.id)}
                      icon={<UserCheck size={16} />}
                      className="ml-2"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(shift)}
                      icon={<Edit size={16} />}
                      aria-label={t('common.edit')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(shift)}
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

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t('shifts.deleteTitle')}
      >
        <div className="space-y-4">
          <p className="text-gray-900 dark:text-gray-300">
            {t('shifts.deleteConfirm')} {shiftToDelete ? formatDateTime(shiftToDelete.startDateTime) : ''}? {t('shifts.deleteMessage')}
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
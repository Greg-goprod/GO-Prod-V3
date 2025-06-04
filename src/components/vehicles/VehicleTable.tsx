import React, { useState } from 'react';
import { Edit, Trash2, Car } from 'lucide-react';
import { Vehicle } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useTranslation } from 'react-i18next';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      onDelete(vehicleToDelete.id);
      setShowDeleteConfirm(false);
      setVehicleToDelete(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Unavailable':
        return 'warning';
      case 'Maintenance':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-dark-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Vehicle
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Capacity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                {t('vehicles.statusLabel')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700">
                      <Car size={16} />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {vehicle.brand} {vehicle.model}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {vehicle.type} • {vehicle.color}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">Reg: {vehicle.registrationNumber}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Fuel: {vehicle.fuelType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    <span className="font-medium">{vehicle.passengerCapacity}</span> passengers
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    <span className="font-medium">{vehicle.luggageCapacity}</span> luggage
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(vehicle)}
                      icon={<Edit size={16} />}
                      aria-label={t('common.edit')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(vehicle)}
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
        title={t('vehicles.deleteTitle')}
      >
        <div className="space-y-4">
          <p className="text-gray-900 dark:text-gray-300">
            {t('vehicles.deleteConfirm')} {vehicleToDelete?.brand} {vehicleToDelete?.model}? {t('vehicles.deleteMessage')}
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
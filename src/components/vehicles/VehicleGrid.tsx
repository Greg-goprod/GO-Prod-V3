import React from 'react';
import { useTranslation } from 'react-i18next';
import { MoreVertical, Trash2, Edit } from 'lucide-react';
import { Vehicle } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';

interface VehicleGridProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="relative">
          <div className="absolute top-4 right-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('common.actions')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => onEdit(vehicle)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(vehicle.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-500">
                  {t('vehicles.type')}: {vehicle.type}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{t('vehicles.registration')}</span>
                  <span className="text-sm font-medium">{vehicle.registration_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{t('vehicles.capacity')}</span>
                  <span className="text-sm font-medium">{vehicle.passenger_capacity} {t('vehicles.passengers')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{t('vehicles.fuel')}</span>
                  <span className="text-sm font-medium">{vehicle.fuel_type}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Vehicle, VehicleType, FuelType, VehicleStatus, VehicleCheckLog } from '../../types';
import { FormAccordion } from '../ui/FormAccordion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { Button } from '../ui/Button';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: Omit<Vehicle, 'id'>) => void;
  onCancel: () => void;
}

// Interface pour les données du formulaire
interface VehicleFormData {
  brand: string;
  model: string;
  type: VehicleType;
  color: string;
  passenger_capacity: number;
  luggage_capacity: number;
  engagement_number: string;
  registration_number: string;
  fuel_type: FuelType;
  status: VehicleStatus;
  additional_equipment: string[];
  supplier: string;
  reception?: VehicleCheckLog;
  return?: VehicleCheckLog;
}

const vehicleTypes: VehicleType[] = ['Van', 'Sedan', 'SUV', 'Minibus', 'Limousine', 'Bus'];
const fuelTypes: FuelType[] = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const statusOptions: VehicleStatus[] = ['Available', 'Unavailable', 'Maintenance'];

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<VehicleFormData>({
    brand: '',
    model: '',
    type: 'Sedan',
    color: '',
    passenger_capacity: 5,
    luggage_capacity: 3,
    engagement_number: '',
    registration_number: '',
    fuel_type: 'Gasoline',
    status: 'Available',
    additional_equipment: [],
    supplier: '',
    reception: {
      date: '',
      kilometers: 0,
      defects: '',
      notes: ''
    },
    return: {
      date: '',
      kilometers: 0,
      defects: '',
      notes: ''
    }
  });

  // Initialiser le formulaire avec les données du véhicule existant
  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand,
        model: vehicle.model,
        type: vehicle.type,
        color: vehicle.color,
        passenger_capacity: vehicle.passenger_capacity,
        luggage_capacity: vehicle.luggage_capacity,
        engagement_number: vehicle.engagement_number,
        registration_number: vehicle.registration_number,
        fuel_type: vehicle.fuel_type,
        status: vehicle.status,
        additional_equipment: vehicle.additional_equipment || [],
        supplier: vehicle.supplier || '',
        reception: vehicle.reception || {
          date: '',
          kilometers: 0,
          defects: '',
          notes: ''
        },
        return: vehicle.return || {
          date: '',
          kilometers: 0,
          defects: '',
          notes: ''
        }
      });
    }
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Gestion des chemins imbriqués comme "reception.date"
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof VehicleFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'passenger_capacity' || name === 'luggage_capacity'
          ? parseInt(value, 10)
          : value
      }));
    }
  };

  const handleReceptionDateChange = (date: Date | null) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      newFormData.reception = {
        ...(prev.reception || { kilometers: 0 }),
        date: date ? date.toISOString().split('T')[0] : ''
      };
      return newFormData;
    });
  };

  const handleReturnDateChange = (date: Date | null) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      newFormData.return = {
        ...(prev.return || { kilometers: 0 }),
        date: date ? date.toISOString().split('T')[0] : ''
      };
      return newFormData;
    });
  };

  const parseReceptionDate = (dateStr?: string): Date | null => {
    return dateStr ? new Date(dateStr) : null;
  };

  const parseReturnDate = (dateStr?: string): Date | null => {
    return dateStr ? new Date(dateStr) : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const sections = [
    {
      id: 'vehicle-details',
      title: t('vehicles.vehicleDetails'),
      description: t('vehicles.basicInformation'),
      children: (
        <>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.brand')}<span className="ml-1 text-error-500">*</span></label>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder={t('vehicles.brandPlaceholder')}
              fullWidth
              required
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.model')}<span className="ml-1 text-error-500">*</span></label>
            <Input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder={t('vehicles.modelPlaceholder')}
              fullWidth
              required
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('vehicles.type')}</label>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={vehicleTypes.map(type => ({ 
                value: type, 
                label: t(`vehicles.vehicleTypes.${type.toLowerCase()}`) 
              }))}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('vehicles.color')}</label>
            <Input
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder={t('vehicles.colorPlaceholder')}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('vehicles.status')}</label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions.map(status => ({ value: status, label: t(`vehicles.status.${status.toLowerCase()}`) }))}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.passengerCapacity')}</label>
            <Input
              name="passenger_capacity"
              type="number"
              min={1}
              value={formData.passenger_capacity}
              onChange={handleChange}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.luggageCapacity')}</label>
            <Input
              name="luggage_capacity"
              type="number"
              min={0}
              value={formData.luggage_capacity}
              onChange={handleChange}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
        </>
      )
    },
    {
      id: 'registration-details',
      title: t('vehicles.registrationDetails'),
      description: t('vehicles.sections.technical'),
      children: (
        <>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.registrationNumber')}<span className="ml-1 text-error-500">*</span></label>
            <Input
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder={t('vehicles.registrationPlaceholder')}
              fullWidth
              required
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.engagementNumber')}</label>
            <Input
              name="engagement_number"
              value={formData.engagement_number}
              onChange={handleChange}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.fuelType')}</label>
            <Select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              options={fuelTypes.map(type => ({ 
                value: type, 
                label: t(`vehicles.fuelTypes.${type.toLowerCase().replace('-', '')}`)
              }))}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.supplier')}</label>
            <Input
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder={t('vehicles.supplierPlaceholder')}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
        </>
      )
    },
    {
      id: 'reception-details',
      title: t('vehicles.receptionDetails'),
      description: t('vehicles.sections.reception'),
      children: (
        <>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.receptionDate')}</label>
            <DatePicker
              value={parseReceptionDate(formData.reception?.date)}
              onChange={handleReceptionDateChange}
              className="shadow-sm h-8 py-1 text-sm w-full"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.kilometers')}</label>
            <Input
              name="reception.kilometers"
              type="number"
              min={0}
              value={formData.reception?.kilometers || 0}
              onChange={handleChange}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.defects')}</label>
            <Input
              name="reception.defects"
              value={formData.reception?.defects || ''}
              onChange={handleChange}
              placeholder={t('vehicles.defectsPlaceholder')}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.notes')}</label>
            <Input
              name="reception.notes"
              value={formData.reception?.notes || ''}
              onChange={handleChange}
              placeholder={t('vehicles.notesPlaceholder')}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
        </>
      )
    },
    {
      id: 'return-details',
      title: t('vehicles.returnDetails'),
      description: t('vehicles.sections.return'),
      children: (
        <>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.returnDate')}</label>
            <DatePicker
              value={parseReturnDate(formData.return?.date)}
              onChange={handleReturnDateChange}
              className="shadow-sm h-8 py-1 text-sm w-full"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.kilometers')}</label>
            <Input
              name="return.kilometers"
              type="number"
              min={0}
              value={formData.return?.kilometers || 0}
              onChange={handleChange}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.defects')}</label>
            <Input
              name="return.defects"
              value={formData.return?.defects || ''}
              onChange={handleChange}
              placeholder={t('vehicles.defectsPlaceholder')}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('vehicles.notes')}</label>
            <Input
              name="return.notes"
              value={formData.return?.notes || ''}
              onChange={handleChange}
              placeholder={t('vehicles.notesPlaceholder')}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
        </>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-850 p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormAccordion sections={sections} />
        <div className="flex justify-end space-x-3">
          <Button type="button" onClick={onCancel} variant="outline">{t('common.cancel')}</Button>
          <Button type="submit">{vehicle ? t('common.update') : t('common.create')}</Button>
        </div>
      </form>
    </div>
  );
};

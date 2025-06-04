import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Driver } from '../../types';
import { Button } from '../ui/Button';

interface DriverAssignmentFormProps {
  drivers: Driver[];
  currentDriverIds: string[];
  onSubmit: (driverIds: string[]) => void;
  onCancel: () => void;
}

type FormData = {
  driverIds: string[];
};

export const DriverAssignmentForm: React.FC<DriverAssignmentFormProps> = ({
  drivers,
  currentDriverIds,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      driverIds: currentDriverIds || []
    }
  });

  const processFormData = (data: FormData) => {
    onSubmit(data.driverIds);
  };

  return (
    <form onSubmit={handleSubmit(processFormData)} className="space-y-4">
      <Controller
        name="driverIds"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t('shifts.assignDriver')}
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2 bg-gray-50 dark:bg-dark-700">
              {drivers.map((driver) => (
                <label key={driver.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded">
                  <input
                    type="checkbox"
                    value={driver.id}
                    checked={field.value?.includes(driver.id) || false}
                    onChange={(e) => {
                      const value = e.target.value;
                      const currentValues = field.value || [];
                      const newValues = e.target.checked
                        ? [...currentValues, value]
                        : currentValues.filter(id => id !== value);
                      field.onChange(newValues);
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {driver.firstName} {driver.lastName}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button variant="primary" type="submit">
          {t('common.update')}
        </Button>
      </div>
    </form>
  );
};
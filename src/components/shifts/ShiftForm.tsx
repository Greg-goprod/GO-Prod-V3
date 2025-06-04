import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Shift, ShiftColor } from '../../types';
import { FormAccordion } from '../ui/FormAccordion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { MaterialDateTimeInput } from '../ui/MaterialDateTimePicker';

interface ShiftFormProps {
  shift?: Shift;
  onSubmit: (data: Omit<Shift, 'id' | 'driverIds'>) => void;
  onCancel: () => void;
}

const colorOptions = [
  { value: 'primary', label: 'Blue' },
  { value: 'secondary', label: 'Teal' },
  { value: 'accent', label: 'Orange' },
  { value: 'success', label: 'Green' },
  { value: 'warning', label: 'Yellow' },
  { value: 'error', label: 'Red' },
];

export const ShiftForm: React.FC<ShiftFormProps> = ({
  shift,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  const { control, handleSubmit, formState: { errors } } = useForm<Omit<Shift, 'id' | 'driverIds'>>({
    defaultValues: {
      name: shift?.name || '',
      startDateTime: shift?.startDateTime ? new Date(shift.startDateTime) : new Date(),
      endDateTime: shift?.endDateTime ? new Date(shift.endDateTime) : new Date(),
      color: shift?.color || 'primary'
    }
  });

  const sections = [
    {
      id: 'details',
      title: t('shifts.details'),
      children: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <Controller
              name="name"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    {t('shifts.name')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <Input
                    {...field}
                    error={!!errors.name}
                    placeholder={t('shifts.namePlaceholder')}
                    fullWidth
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.name.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="col-span-4">
            <Controller
              name="color"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    {t('shifts.color')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <Select
                    options={colorOptions}
                    error={!!errors.color}
                    fullWidth
                    {...field}
                  />
                  {errors.color && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.color.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      )
    },
    {
      id: 'timing',
      title: t('shifts.timing'),
      children: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Controller
              name="startDateTime"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field: { value, onChange, ...field } }) => (
                <>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    {t('shifts.startDateTime')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <MaterialDateTimeInput
                    {...field}
                    value={value}
                    onChange={onChange}
                    error={!!errors.startDateTime}
                    fullWidth
                    showTimeSelector={true}
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.startDateTime && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.startDateTime.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="col-span-6">
            <Controller
              name="endDateTime"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field: { value, onChange, ...field } }) => (
                <>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    {t('shifts.endDateTime')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <MaterialDateTimeInput
                    {...field}
                    value={value}
                    onChange={onChange}
                    error={!!errors.endDateTime}
                    fullWidth
                    showTimeSelector={true}
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.endDateTime && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.endDateTime.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-850 p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormAccordion
          sections={sections}
          defaultSection="details"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button 
            type="submit" 
            style={{ backgroundColor: '#7000FF' }}
            className="text-white hover:bg-opacity-90"
          >
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};
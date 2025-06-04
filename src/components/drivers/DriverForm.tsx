import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Driver, TShirtSize, DriverPermit } from '../../types';
import { useSupabase } from '../../lib/supabaseClient';
import { FormAccordion } from '../ui/FormAccordion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { MaterialDateTimeInput } from '../ui/MaterialDateTimePicker';

interface DriverFormProps {
  driver?: Driver;
  onSubmit: (data: Omit<Driver, 'id'>) => void;
  onCancel: () => void;
}

const tShirtSizeOptions = [
  { value: 'XXS', label: 'XXS' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: 'XXXL', label: 'XXXL' },
  { value: 'XXXXL', label: 'XXXXL' }
];

const permitOptions = [
  { value: 'A', label: 'A' },
  { value: 'A1', label: 'A1' },
  { value: 'B', label: 'B' },
  { value: 'B1', label: 'B1' },
  { value: 'BE', label: 'BE' },
  { value: 'C', label: 'C' },
  { value: 'C1', label: 'C1' },
  { value: 'C1E', label: 'C1E' },
  { value: 'CE', label: 'CE' },
  { value: 'D', label: 'D' },
  { value: 'D1', label: 'D1' },
  { value: 'D1E', label: 'D1E' },
  { value: 'DE', label: 'DE' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
  { value: 'M', label: 'M' },
  { value: 'TPP 121', label: 'TPP 121' },
  { value: 'TPP 122', label: 'TPP 122' }
];

export const DriverForm: React.FC<DriverFormProps> = ({
  driver,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  const [languages, setLanguages] = useState<any[]>([]);
  const [hiredYears, setHiredYears] = useState<{ year: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<Omit<Driver, 'id'>>({
    defaultValues: driver ? {
      firstName: driver.firstName,
      lastName: driver.lastName,
      street: driver.street,
      postalCode: driver.postalCode,
      city: driver.city,
      email: driver.email,
      phone: driver.phone,
      birthDate: driver.birthDate,
      languages: driver.languages,
      tShirtSize: driver.tShirtSize,
      hiredSince: driver.hiredSince,
      permits: driver.permits,
      notes: driver.notes
    } : {
      languages: [],
      permits: []
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [languagesResponse, hiredYearsResponse] = await Promise.all([
        supabase.from('languages').select('*').order('name'),
        supabase.from('hired_year').select('year').order('year', { ascending: false })
      ]);

      if (languagesResponse.error) throw languagesResponse.error;
      if (hiredYearsResponse.error) throw hiredYearsResponse.error;

      setLanguages(languagesResponse.data || []);
      setHiredYears(hiredYearsResponse.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('Failed to load form data');
    }
  };

  const sections = [
    {
      id: 'identity',
      title: t('drivers.sections.identity'),
      children: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Controller
              name="firstName"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {t('drivers.firstName')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <Input
                    {...field}
                    error={!!errors.firstName}
                    placeholder={t('drivers.firstNamePlaceholder')}
                    fullWidth
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-error-600">{errors.firstName.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="col-span-6">
            <Controller
              name="lastName"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {t('drivers.lastName')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <Input
                    {...field}
                    error={!!errors.lastName}
                    placeholder={t('drivers.lastNamePlaceholder')}
                    fullWidth
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-error-600">{errors.lastName.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="col-span-6">
            <Controller
              name="birthDate"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field: { value, onChange, ...field } }) => (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {t('drivers.birthDate')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <MaterialDateTimeInput
                    {...field}
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : null)}
                    error={!!errors.birthDate}
                    showTimeSelector={false}
                    fullWidth
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-xs text-error-600">{errors.birthDate.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: t('drivers.sections.contact'),
      children: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Controller
              name="email"
              control={control}
              rules={{
                required: t('common.required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('common.invalidEmail')
                }
              }}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {t('drivers.email')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <Input
                    type="email"
                    {...field}
                    error={!!errors.email}
                    placeholder={t('drivers.emailPlaceholder')}
                    fullWidth
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-error-600">{errors.email.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="col-span-6">
            <Controller
              name="phone"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {t('drivers.phone')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <Input
                    {...field}
                    error={!!errors.phone}
                    placeholder={t('drivers.phonePlaceholder')}
                    fullWidth
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-error-600">{errors.phone.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="col-span-8">
            <Controller
              name="street"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {t('drivers.street')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <Input
                    {...field}
                    error={!!errors.street}
                    placeholder={t('drivers.streetPlaceholder')}
                    fullWidth
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.street && (
                    <p className="mt-1 text-xs text-error-600">{errors.street.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="col-span-4">
            <Controller
              name="postalCode"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {t('drivers.postalCode')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <Input
                    {...field}
                    error={!!errors.postalCode}
                    placeholder={t('drivers.postalCodePlaceholder')}
                    fullWidth
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-xs text-error-600">{errors.postalCode.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="col-span-6">
            <Controller
              name="city"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {t('drivers.city')}<span className="ml-1 text-error-500">*</span>
                  </label>
                  <Input
                    {...field}
                    error={!!errors.city}
                    placeholder={t('drivers.cityPlaceholder')}
                    fullWidth
                    className="shadow-sm h-10 py-1 text-sm"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-error-600">{errors.city.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      )
    },
    {
      id: 'professional',
      title: t('drivers.sections.professional'),
      children: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <Controller
              name="tShirtSize"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <Select
                  label={t('drivers.tShirtSize')}
                  options={tShirtSizeOptions}
                  error={!!errors.tShirtSize}
                  fullWidth
                  {...field}
                />
              )}
            />
          </div>

          <div className="col-span-4">
            <Controller
              name="hiredSince"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <Select
                  label={t('drivers.hiredYear')}
                  options={hiredYears.map(hy => ({
                    value: hy.year.toString(),
                    label: hy.year.toString()
                  }))}
                  error={!!errors.hiredSince}
                  fullWidth
                  {...field}
                  value={field.value?.toString()}
                />
              )}
            />
          </div>

          <div className="col-span-12">
            <Controller
              name="languages"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('drivers.languages')}
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-4 border rounded-md bg-gray-50 dark:bg-dark-800 border-gray-300 dark:border-gray-600">
                    {languages.map((language) => (
                      <label key={language.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={language.name}
                          checked={field.value?.includes(language.name)}
                          onChange={(e) => {
                            const value = e.target.value;
                            const currentValues = Array.isArray(field.value) ? [...field.value] : [];
                            if (e.target.checked) {
                              field.onChange([...currentValues, value]);
                            } else {
                              field.onChange(currentValues.filter(v => v !== value));
                            }
                          }}
                          className="h-4 w-4 text-[#7000FF] focus:ring-[#7000FF] border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {language.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.languages && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.languages.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      )
    },
    {
      id: 'permits',
      title: t('drivers.sections.permits'),
      children: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Controller
              name="permits"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('drivers.permits')}
                  </label>
                  <div className="grid grid-cols-6 gap-2 p-4 border rounded-md bg-gray-50 dark:bg-dark-800 border-gray-300 dark:border-gray-600">
                    {permitOptions.map((permit) => (
                      <label key={permit.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={permit.value}
                          checked={field.value?.includes(permit.value as DriverPermit)}
                          onChange={(e) => {
                            const value = e.target.value as DriverPermit;
                            const currentValues = Array.isArray(field.value) ? [...field.value] : [];
                            if (e.target.checked) {
                              field.onChange([...currentValues, value]);
                            } else {
                              field.onChange(currentValues.filter(v => v !== value));
                            }
                          }}
                          className="h-4 w-4 text-[#7000FF] focus:ring-[#7000FF] border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {permit.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )
    },
    {
      id: 'notes',
      title: t('drivers.sections.notes'),
      children: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {t('drivers.notes')}
                  </label>
                  <textarea
                    {...field}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    rows={4}
                    placeholder={t('drivers.notesPlaceholder')}
                  />
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
        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        <FormAccordion
          sections={sections}
          defaultSection="identity"
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
            {driver ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </div>
  );
};
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Contact, Artist } from '../../types';
import { FormAccordion } from '../ui/FormAccordion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface ContactFormProps {
  contact?: Contact;
  artists: Artist[];
  functions: { id: string; name: string; }[];
  onSubmit: (data: Omit<Contact, 'id'>) => void;
  onCancel: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  artists,
  functions,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors } } = useForm<Omit<Contact, 'id'>>({
    defaultValues: contact || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      function: '',
      functionId: '',
    }
  });

  const sections = [
    {
      id: 'identity',
      title: t('contacts.sections.identity'),
      description: '',
      children: (
        <>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('contacts.firstName')}<span className="ml-1 text-error-500">*</span></label>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: t('common.required') as string }}
              render={({ field }) => (
                <Input
                  {...field}
                  error={Boolean(errors.firstName)}
                  fullWidth
                  className="shadow-sm h-8 py-1 text-sm"
                />
              )}
            />
            {errors.firstName && <p className="mt-1 text-xs text-error-600">{errors.firstName.message}</p>}
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('contacts.lastName')}<span className="ml-1 text-error-500">*</span></label>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: t('common.required') as string }}
              render={({ field }) => (
                <Input
                  {...field}
                  error={Boolean(errors.lastName)}
                  fullWidth
                  className="shadow-sm h-8 py-1 text-sm"
                />
              )}
            />
            {errors.lastName && <p className="mt-1 text-xs text-error-600">{errors.lastName.message}</p>}
          </div>
        </>
      )
    },
    {
      id: 'contact',
      title: t('contacts.sections.contact'),
      description: '',
      children: (
        <>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('contacts.email')}<span className="ml-1 text-error-500">*</span></label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: t('common.required') as string,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('common.invalidEmail') as string
                }
              }}
              render={({ field }) => (
                <Input
                  type="email"
                  {...field}
                  error={Boolean(errors.email)}
                  fullWidth
                  className="shadow-sm h-8 py-1 text-sm"
                />
              )}
            />
            {errors.email && <p className="mt-1 text-xs text-error-600">{errors.email.message}</p>}
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('contacts.phone')}<span className="ml-1 text-error-500">*</span></label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: t('common.required') as string }}
              render={({ field }) => (
                <Input
                  {...field}
                  error={Boolean(errors.phone)}
                  fullWidth
                  className="shadow-sm h-8 py-1 text-sm"
                />
              )}
            />
            {errors.phone && <p className="mt-1 text-xs text-error-600">{errors.phone.message}</p>}
          </div>
        </>
      )
    },
    {
      id: 'function',
      title: t('contacts.sections.function'),
      description: '',
      children: (
        <>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('contacts.function')}<span className="ml-1 text-error-500">*</span></label>
            <Controller
              name="functionId"
              control={control}
              rules={{ required: t('common.required') as string }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={functions.map(f => ({
                    value: f.id,
                    label: f.name
                  }))}
                  error={Boolean(errors.functionId)}
                  fullWidth
                  className="shadow-sm h-8 py-1 text-sm"
                />
              )}
            />
            {errors.functionId && <p className="mt-1 text-xs text-error-600">{errors.functionId.message}</p>}
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('contacts.artist')}</label>
            <Controller
              name="artistId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { value: '', label: t('contacts.noArtist') },
                    ...artists.map(a => ({
                      value: a.id,
                      label: a.name
                    }))
                  ]}
                  fullWidth
                  className="shadow-sm h-8 py-1 text-sm"
                />
              )}
            />
          </div>
        </>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-850 p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormAccordion
          sections={sections}
          defaultSection="identity"
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" type="submit">
            {contact ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </div>
  );
};
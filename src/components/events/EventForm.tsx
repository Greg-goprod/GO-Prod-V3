import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormLayout from '../ui/FormLayout';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import { DateTimePicker } from '../ui/DateTimePicker';
import { Event, EventType, EventStatus } from '../../types';

interface EventFormProps {
  event?: Event;
  onSubmit: (data: Omit<Event, 'id'>) => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation();
  
  const eventTypeOptions = [
    { value: 'Concert', label: t('events.types.concert') },
    { value: 'Festival', label: t('events.types.festival') },
    { value: 'Corporate', label: t('events.types.corporate') },
    { value: 'Private', label: t('events.types.private') },
    { value: 'Other', label: t('events.types.other') }
  ];

  const eventStatusOptions = [
    { value: 'Draft', label: t('events.status.draft') },
    { value: 'Confirmed', label: t('events.status.confirmed') },
    { value: 'Cancelled', label: t('events.status.cancelled') },
    { value: 'Completed', label: t('events.status.completed') }
  ];

  const { control, handleSubmit, formState: { errors } } = useForm<Omit<Event, 'id'>>({
    defaultValues: event ? {
      name: event.name,
      type: event.type,
      status: event.status,
      startDateTime: event.startDateTime ? new Date(event.startDateTime) : undefined,
      endDateTime: event.endDateTime ? new Date(event.endDateTime) : undefined,
      location: event.location,
      contactName: event.contactName,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      notes: event.notes,
      isAllDay: event.isAllDay || false
    } : {
      type: 'Concert' as EventType,
      status: 'Draft' as EventStatus,
      isAllDay: false
    }
  });

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      <FormLayout.Section 
        title={t('events.basicInfo')}
        description={t('events.basicInfoDescription')}
      >
        <FormLayout.Field label={t('events.name')} required span={4}>
          <Controller
            name="name"
            control={control}
            rules={{ required: t('common.required') }}
            render={({ field }) => (
              <Input
                {...field}
                error={!!errors.name}
                placeholder={t('events.namePlaceholder')}
                fullWidth
              />
            )}
          />
        </FormLayout.Field>

        <FormLayout.Field label={t('events.type')} span={2}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                options={eventTypeOptions}
                error={!!errors.type}
                fullWidth
                {...field}
              />
            )}
          />
        </FormLayout.Field>

        <FormLayout.Field label={t('events.status')} span={2}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                options={eventStatusOptions}
                error={!!errors.status}
                fullWidth
                {...field}
              />
            )}
          />
        </FormLayout.Field>

        <FormLayout.Field label={t('events.location')} span={4}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={!!errors.location}
                placeholder={t('events.locationPlaceholder')}
                fullWidth
              />
            )}
          />
        </FormLayout.Field>

        <FormLayout.Field label={t('events.isAllDay')} span={2} labelPosition="left">
          <Controller
            name="isAllDay"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Switch
                {...field}
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
              />
            )}
          />
        </FormLayout.Field>
      </FormLayout.Section>

      <FormLayout.Section 
        title={t('events.schedule')}
        description={t('events.scheduleDescription')}
      >
        <FormLayout.Field label={t('events.startDateTime')} required span={3}>
          <Controller
            name="startDateTime"
            control={control}
            rules={{ required: t('common.required') }}
            render={({ field: { value, onChange, ...field } }) => (
              <DateTimePicker
                {...field}
                value={typeof value === 'string' ? new Date(value) : value}
                onChange={onChange}
                error={!!errors.startDateTime}
                fullWidth
                placeholder={t('events.startDateTimePlaceholder')}
                showTimeSelector={true}
              />
            )}
          />
        </FormLayout.Field>

        <FormLayout.Field label={t('events.endDateTime')} required span={3}>
          <Controller
            name="endDateTime"
            control={control}
            rules={{ required: t('common.required') }}
            render={({ field: { value, onChange, ...field } }) => (
              <DateTimePicker
                {...field}
                value={typeof value === 'string' ? new Date(value) : value}
                onChange={onChange}
                error={!!errors.endDateTime}
                fullWidth
                placeholder={t('events.endDateTimePlaceholder')}
                showTimeSelector={true}
              />
            )}
          />
        </FormLayout.Field>
      </FormLayout.Section>

      <FormLayout.Section 
        title={t('events.contactInfo')}
        description={t('events.contactInfoDescription')}
      >
        <FormLayout.Field label={t('events.contactName')} span={2}>
          <Controller
            name="contactName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={!!errors.contactName}
                placeholder={t('events.contactNamePlaceholder')}
                fullWidth
              />
            )}
          />
        </FormLayout.Field>

        <FormLayout.Field label={t('events.contactEmail')} span={2}>
          <Controller
            name="contactEmail"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                {...field}
                error={!!errors.contactEmail}
                placeholder={t('events.contactEmailPlaceholder')}
                fullWidth
              />
            )}
          />
        </FormLayout.Field>

        <FormLayout.Field label={t('events.contactPhone')} span={2}>
          <Controller
            name="contactPhone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={!!errors.contactPhone}
                placeholder={t('events.contactPhonePlaceholder')}
                fullWidth
              />
            )}
          />
        </FormLayout.Field>
      </FormLayout.Section>

      <FormLayout.Section 
        title={t('events.additionalInfo')}
        description={t('events.additionalInfoDescription')}
      >
        <FormLayout.Field label={t('events.notes')} span={6}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder={t('events.notesPlaceholder')}
              />
            )}
          />
        </FormLayout.Field>
      </FormLayout.Section>

      <FormLayout.Actions>
        <Button variant="outline" type="button" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button variant="primary" type="submit">
          {event ? t('common.update') : t('common.create')}
        </Button>
      </FormLayout.Actions>
    </FormLayout>
  );
};
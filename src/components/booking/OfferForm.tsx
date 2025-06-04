import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormAccordion } from '../ui/FormAccordion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabaseClient';

interface OfferFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export const OfferForm = ({ onSubmit, onCancel }: OfferFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    artist_name: '',
    event_name: '',
    event_location: '',
    stage: '',
    performance_type: '',
    show_duration: '',
    slot_time: '',
    fee_amount: '',
    fee_currency: 'EUR',
    fee_type: 'net',
    legal_notice: '',
    notes_internal: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sections = [
    {
      id: 'artist',
      title: t('booking.sections.artist'),
      children: (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-3">
            <Input
              label={t('booking.artistName')}
              name="artist_name"
              value={formData.artist_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-3">
            <Select
              label={t('booking.stage')}
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select a stage' },
                { value: 'MAINSTAGE', label: 'Main Stage' },
                { value: 'RIVERSTAGE', label: 'River Stage' },
                { value: 'LA GRANGE', label: 'La Grange' }
              ]}
              required
            />
          </div>
        </div>
      )
    },
    {
      id: 'event',
      title: t('booking.sections.event'),
      children: (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-3">
            <Input
              label={t('booking.eventName')}
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-3">
            <Input
              label={t('booking.eventLocation')}
              name="event_location"
              value={formData.event_location}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      )
    },
    {
      id: 'performance',
      title: t('booking.sections.performance'),
      children: (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2">
            <Input
              label={t('booking.performanceType')}
              name="performance_type"
              value={formData.performance_type}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2">
            <Input
              label={t('booking.showDuration')}
              name="show_duration"
              value={formData.show_duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2">
            <Input
              label={t('booking.slotTime')}
              name="slot_time"
              type="time"
              value={formData.slot_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      )
    },
    {
      id: 'fee',
      title: t('booking.sections.fee'),
      children: (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2">
            <Input
              label={t('booking.feeAmount')}
              name="fee_amount"
              type="number"
              value={formData.fee_amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2">
            <Select
              label={t('booking.feeCurrency')}
              name="fee_currency"
              value={formData.fee_currency}
              onChange={handleChange}
              options={[
                { value: 'EUR', label: 'EUR' },
                { value: 'USD', label: 'USD' },
                { value: 'GBP', label: 'GBP' }
              ]}
              required
            />
          </div>
          <div className="col-span-2">
            <Select
              label={t('booking.feeType')}
              name="fee_type"
              value={formData.fee_type}
              onChange={handleChange}
              options={[
                { value: 'net', label: 'Net' },
                { value: 'brut', label: 'Brut' }
              ]}
              required
            />
          </div>
        </div>
      )
    },
    {
      id: 'legal',
      title: t('booking.sections.legal'),
      children: (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-6">
            <Input
              label={t('booking.legalNotice')}
              name="legal_notice"
              as="textarea"
              rows={4}
              value={formData.legal_notice}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-6">
            <Input
              label={t('booking.notesInternal')}
              name="notes_internal"
              as="textarea"
              rows={4}
              value={formData.notes_internal}
              onChange={handleChange}
            />
          </div>
        </div>
      )
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert([formData])
        .select();

      if (error) throw error;

      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormAccordion sections={sections} defaultSection="artist" />
      
      <div className="sticky bottom-0 -mx-3 -mb-2 px-3 py-3 bg-white border-t">
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <Button variant="outline\" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          )}
          <Button variant="primary" type="submit">
            {t('common.create')}
          </Button>
        </div>
      </div>
    </form>
  );
};
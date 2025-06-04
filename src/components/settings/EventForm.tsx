import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { useSupabase } from '../../lib/supabaseClient';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Combobox } from '../ui/Combobox';
import { format, addDays } from 'date-fns';
import { Modal } from '../ui/Modal';
import { ContactForm } from '../contacts/ContactForm';
import clsx from 'clsx';

interface EventFormProps {
  event?: any;
  contacts: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface Stage {
  id: string;
  name: string;
}

interface NewStage {
  name: string;
  type: string;
  location?: string;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  contacts,
  onSubmit,
  onCancel
}) => {
  const { supabase } = useSupabase();
  const [error, setError] = useState<string | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [isNewStageModalOpen, setIsNewStageModalOpen] = useState(false);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [newStage, setNewStage] = useState<NewStage>({ name: '', type: '' });
  const [contactFunctions, setContactFunctions] = useState<any[]>([]);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [currentContactField, setCurrentContactField] = useState<string>('');

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: event || {
      name: '',
      days: [{ date: '', open_time: '', close_time: '' }],
      artist_relations_contact_id: '',
      technical_director_contact_id: '',
      press_media_contact_id: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days'
  });

  useEffect(() => {
    fetchData();
  }, [event]);

  const fetchData = async () => {
    try {
      const [
        { data: stagesData },
        { data: eventStagesData },
        { data: functionsData }
      ] = await Promise.all([
        supabase.from('stages').select('*').order('name'),
        event?.id ? supabase.from('event_stages').select('stage_id').eq('event_id', event.id) : { data: [] },
        supabase.from('contact_functions').select('*').order('name')
      ]);

      setStages(stagesData || []);
      setSelectedStages(eventStagesData?.map(es => es.stage_id) || []);
      setContactFunctions(functionsData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message);
    }
  };

  const handleStageSelect = (stageId: string) => {
    setSelectedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  const handleCreateStage = async () => {
    try {
      if (!newStage.name.trim()) {
        setError('Stage name is required');
        return;
      }

      const { data, error } = await supabase
        .from('stages')
        .insert({ name: newStage.name.trim() })
        .select()
        .single();

      if (error) throw error;

      setStages([...stages, data]);
      setSelectedStages([...selectedStages, data.id]);
      setIsNewStageModalOpen(false);
      setNewStage({ name: '', type: '' });
    } catch (error: any) {
      console.error('Error creating stage:', error);
      setError(error.message);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      const { error } = await supabase
        .from('stages')
        .delete()
        .eq('id', stageId);

      if (error) throw error;

      setStages(stages.filter(stage => stage.id !== stageId));
      setSelectedStages(selectedStages.filter(id => id !== stageId));
    } catch (error: any) {
      console.error('Error deleting stage:', error);
      setError(error.message);
    }
  };

  const handleContactSubmit = async (data: any) => {
    try {
      const { data: newContact, error } = await supabase
        .from('contacts')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          function_id: data.functionId
        })
        .select()
        .single();

      if (error) throw error;

      contacts.push(newContact);
      setValue(currentContactField, newContact.id);
      setIsContactFormOpen(false);
    } catch (error: any) {
      console.error('Error creating contact:', error);
      setError(error.message);
    }
  };

  const handleAddContact = (field: string) => {
    setCurrentContactField(field);
    setIsContactFormOpen(true);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        options.push({ value: `${h}:${m}`, label: `${h}:${m}` });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const contactOptions = contacts.map(contact => ({
    value: contact.id,
    label: `${contact.first_name} ${contact.last_name}`,
    email: contact.email
  }));

  const handleFormSubmit = async (data: any) => {
    try {
      const processedDays = data.days.map((day: any) => {
        const openTime = new Date(`${day.date}T${day.open_time}`);
        const closeTime = new Date(`${day.date}T${day.close_time}`);
        
        const closingDay = closeTime < openTime ? addDays(new Date(day.date), 1) : null;
        
        return {
          ...day,
          closing_day: closingDay?.toISOString().split('T')[0]
        };
      });

      const eventData = {
        ...data,
        days: processedDays
      };

      const eventResult = event?.id
        ? await supabase.from('events').update(eventData).eq('id', event.id)
        : await supabase.from('events').insert(eventData).select().single();

      if (eventResult.error) throw eventResult.error;

      const eventId = event?.id || eventResult.data?.id;

      if (eventId) {
        // Update event stages
        await supabase
          .from('event_stages')
          .delete()
          .eq('event_id', eventId);

        if (selectedStages.length > 0) {
          await supabase
            .from('event_stages')
            .insert(
              selectedStages.map(stageId => ({
                event_id: eventId,
                stage_id: stageId
              }))
            );
        }
      }

      onSubmit(eventData);
    } catch (error: any) {
      console.error('Error saving event:', error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Input
        label="Nom de l'événement"
        {...register('name', { required: 'Event name is required' })}
        error={errors.name?.message}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Jours de l'événement</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ date: '', open_time: '', close_time: '' })}
            icon={<Plus size={16} />}
          >
            Ajouter un jour
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-4 gap-4 items-start">
            <div className="relative">
              <Input
                type="date"
                label={`Jour ${index + 1}`}
                {...register(`days.${index}.date` as const, {
                  required: 'Date is required'
                })}
                error={errors.days?.[index]?.date?.message}
                leftIcon={<Calendar size={16} />}
              />
            </div>

            <Combobox
              label="Ouverture"
              options={timeOptions}
              value={watch(`days.${index}.open_time`)}
              onChange={(value) => setValue(`days.${index}.open_time`, value)}
              error={errors.days?.[index]?.open_time?.message}
            />

            <Combobox
              label="Fermeture"
              options={timeOptions}
              value={watch(`days.${index}.close_time`)}
              onChange={(value) => setValue(`days.${index}.close_time`, value)}
              error={errors.days?.[index]?.close_time?.message}
            />

            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
              icon={<Trash2 size={16} />}
              className="mt-8"
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Scènes</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsNewStageModalOpen(true)}
            icon={<Plus size={16} />}
          >
            Nouvelle scène
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stages.map(stage => (
            <div
              key={stage.id}
              className={clsx(
                'p-3 rounded-md border text-left transition-colors',
                selectedStages.includes(stage.id)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
              )}
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleStageSelect(stage.id)}
                  className="font-medium"
                >
                  {stage.name}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteStage(stage.id)}
                  icon={<Trash2 size={16} />}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contacts</h3>
        <div className="grid grid-cols-1 gap-4">
          <Combobox
            label="ARTIST RELATIONS (PROD)"
            options={[
              ...contactOptions,
              { value: 'new', label: '➕ Add new contact' }
            ]}
            value={watch('artist_relations_contact_id')}
            onChange={(value) => {
              if (value === 'new') {
                handleAddContact('artist_relations_contact_id');
              } else {
                setValue('artist_relations_contact_id', value);
              }
            }}
            placeholder="Rechercher un contact..."
          />

          <Combobox
            label="TECHNICAL DIRECTOR"
            options={[
              ...contactOptions,
              { value: 'new', label: '➕ Add new contact' }
            ]}
            value={watch('technical_director_contact_id')}
            onChange={(value) => {
              if (value === 'new') {
                handleAddContact('technical_director_contact_id');
              } else {
                setValue('technical_director_contact_id', value);
              }
            }}
            placeholder="Rechercher un contact..."
          />

          <Combobox
            label="PRESS/MEDIA"
            options={[
              ...contactOptions,
              { value: 'new', label: '➕ Add new contact' }
            ]}
            value={watch('press_media_contact_id')}
            onChange={(value) => {
              if (value === 'new') {
                handleAddContact('press_media_contact_id');
              } else {
                setValue('press_media_contact_id', value);
              }
            }}
            placeholder="Rechercher un contact..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" type="submit">
          {event ? 'Mettre à jour' : 'Créer'} l'événement
        </Button>
      </div>

      <Modal
        isOpen={isNewStageModalOpen}
        onClose={() => setIsNewStageModalOpen(false)}
        title="Nouvelle scène"
      >
        <div className="space-y-4">
          <Input
            label="Nom de la scène"
            value={newStage.name}
            onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
          />

          <Input
            label="Type"
            value={newStage.type}
            onChange={(e) => setNewStage({ ...newStage, type: e.target.value })}
          />

          <Input
            label="Lieu (optionnel)"
            value={newStage.location || ''}
            onChange={(e) => setNewStage({ ...newStage, location: e.target.value })}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsNewStageModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateStage}
            >
              Créer la scène
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        title="Nouveau contact"
      >
        <ContactForm
          contacts={contacts}
          functions={contactFunctions}
          onSubmit={handleContactSubmit}
          onCancel={() => setIsContactFormOpen(false)}
        />
      </Modal>
    </form>
  );
};
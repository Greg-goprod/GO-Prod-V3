import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Artist, Contact } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { MaterialDateTimeInput } from '../ui/MaterialDateTimePicker';

interface TravelFormProps {
  artists: Artist[];
  contacts: Contact[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const travelTypeOptions = [
  { value: 'PLANE', label: 'Plane' },
  { value: 'TRAIN', label: 'Train' },
  { value: 'CAR', label: 'Car' },
  { value: 'VAN', label: 'Van' },
  { value: 'VAN_TRAILER', label: 'Van with Trailer' },
  { value: 'TOURBUS', label: 'Tour Bus' },
  { value: 'TOURBUS_TRAILER', label: 'Tour Bus with Trailer' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'TRUCK_TRAILER', label: 'Truck with Trailer' },
];

export const TravelForm: React.FC<TravelFormProps> = ({
  artists,
  contacts,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm();
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const travelType = watch('travelType');
  const needsDetails = ['PLANE', 'TRAIN'].includes(travelType);

  // Group artists by performance date and sort alphabetically
  const groupedArtists = useMemo(() => {
    const groups = artists.reduce((acc, artist) => {
      if (!artist.performanceDate) {
        if (!acc['Non programmé']) {
          acc['Non programmé'] = [];
        }
        acc['Non programmé'].push(artist);
        return acc;
      }

      const date = format(new Date(artist.performanceDate), 'dd MMMM yyyy', { locale: fr });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(artist);
      return acc;
    }, {} as Record<string, Artist[]>);

    // Sort artists alphabetically within each group
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    });

    // Sort dates chronologically
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => {
        if (dateA === 'Non programmé') return 1;
        if (dateB === 'Non programmé') return -1;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
  }, [artists]);

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
    setSelectedContact(null);
    setValue('artistId', artist.id);
    setValue('contactId', null);
    setValue('personType', 'ARTIST');
    setIsArtistModalOpen(false);
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setSelectedArtist(null);
    setValue('contactId', contact.id);
    setValue('artistId', null);
    setValue('personType', 'CONTACT');
    setIsContactModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Person Selection Buttons */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('travels.personType')}
        </label>
        <div className="flex space-x-4">
          <Button
            type="button"
            variant={selectedArtist ? 'primary' : 'outline'}
            onClick={() => setIsArtistModalOpen(true)}
            className="flex-1"
          >
            {selectedArtist ? selectedArtist.name : t('artists.title')}
          </Button>
          <Button
            type="button"
            variant={selectedContact ? 'primary' : 'outline'}
            onClick={() => setIsContactModalOpen(true)}
            className="flex-1"
          >
            {selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : t('contacts.title')}
          </Button>
        </div>
      </div>

      {/* Travel Direction and Type */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            {t('travels.direction')}<span className="ml-1 text-error-500">*</span>
          </label>
          <Select
            options={[
              { value: 'true', label: t('travels.arrival') },
              { value: 'false', label: t('travels.departure') }
            ]}
            {...register('isArrival', { required: t('common.required') })}
            error={!!errors.isArrival}
          />
          {errors.isArrival && (
            <p className="mt-1 text-xs text-error-600 dark:text-error-400">
              {errors.isArrival.message?.toString()}
            </p>
          )}
        </div>

        <div className="col-span-6">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            {t('travels.travelType')}<span className="ml-1 text-error-500">*</span>
          </label>
          <Select
            options={travelTypeOptions}
            {...register('travelType', { required: t('common.required') })}
            error={!!errors.travelType}
          />
          {errors.travelType && (
            <p className="mt-1 text-xs text-error-600 dark:text-error-400">
              {errors.travelType.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Date Time Fields */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            {t('travels.scheduledDateTime')}<span className="ml-1 text-error-500">*</span>
          </label>
          <Controller
            name="scheduledDatetime"
            control={control}
            rules={{ required: t('common.required') }}
            render={({ field: { value, onChange, ...field } }) => (
              <MaterialDateTimeInput
                {...field}
                value={value ? new Date(value) : null}
                onChange={(date) => onChange(date ? date.toISOString() : null)}
                error={!!errors.scheduledDatetime}
                fullWidth
                showTimeSelector={true}
                className="shadow-sm h-10 py-1 text-sm"
              />
            )}
          />
          {errors.scheduledDatetime && (
            <p className="mt-1 text-xs text-error-600 dark:text-error-400">
              {errors.scheduledDatetime.message?.toString()}
            </p>
          )}
        </div>

        <div className="col-span-6">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            {t('travels.actualDateTime')}
          </label>
          <Controller
            name="actualDatetime"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <MaterialDateTimeInput
                {...field}
                value={value ? new Date(value) : null}
                onChange={(date) => onChange(date ? date.toISOString() : null)}
                error={false}
                fullWidth
                showTimeSelector={true}
                className="shadow-sm h-10 py-1 text-sm"
              />
            )}
          />
        </div>
      </div>

      {/* Travel Details (for plane/train) */}
      {needsDetails && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium">{t('travels.details').toUpperCase()}</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t(`travels.${travelType.toLowerCase()}.referenceNumber`)}<span className="ml-1 text-error-500">*</span>
            </label>
            <Input
              {...register('referenceNumber', { required: t('common.required') })}
              error={!!errors.referenceNumber}
              fullWidth
            />
            {errors.referenceNumber && (
              <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                {errors.referenceNumber.message?.toString()}
              </p>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t(`travels.${travelType.toLowerCase()}.departureLocation`)}<span className="ml-1 text-error-500">*</span>
              </label>
              <Input
                {...register('departureLocation', { required: t('common.required') })}
                error={!!errors.departureLocation}
                fullWidth
              />
              {errors.departureLocation && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                  {errors.departureLocation.message?.toString()}
                </p>
              )}
            </div>

            <div className="col-span-6">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t(`travels.${travelType.toLowerCase()}.arrivalLocation`)}<span className="ml-1 text-error-500">*</span>
              </label>
              <Input
                {...register('arrivalLocation', { required: t('common.required') })}
                error={!!errors.arrivalLocation}
                fullWidth
              />
              {errors.arrivalLocation && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                  {errors.arrivalLocation.message?.toString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          {t('travels.notes')}
        </label>
        <textarea
          {...register('notes')}
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
          rows={3}
          placeholder={t('travels.notesPlaceholder')}
        />
      </div>

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

      {/* Artist Selection Modal */}
      <Modal
        isOpen={isArtistModalOpen}
        onClose={() => setIsArtistModalOpen(false)}
        title={t('artists.title')}
      >
        <div className="space-y-6">
          {groupedArtists.map(([date, artists]) => (
            <div key={date} className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{date}</h3>
              <div className="grid grid-cols-2 gap-4">
                {artists.map(artist => (
                  <Card
                    key={artist.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleArtistSelect(artist)}
                  >
                    <div className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 flex-shrink-0">
                          <img
                            src={'https://via.placeholder.com/25'}
                            alt={artist.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{artist.name}</h3>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Contact Selection Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={t('contacts.title')}
      >
        <div className="space-y-4">
          {contacts.map(contact => (
            <Card
              key={contact.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleContactSelect(contact)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{contact.function}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </form>
  );
};
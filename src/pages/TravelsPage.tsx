import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Navigation } from 'lucide-react';
import { useSupabase } from '../lib/supabaseClient';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Modal } from '../components/ui/Modal';
import { TravelForm } from '../components/travels/TravelForm';
import { TravelList } from '../components/travels/TravelList';

interface Travel {
  id: string;
  personType: 'ARTIST' | 'CONTACT';
  personId: string;
  isArrival: boolean;
  travelType: string;
  scheduledDatetime: string;
  actualDatetime?: string;
  notes?: string;
  details?: {
    referenceNumber: string;
    departureLocation: string;
    arrivalLocation: string;
  };
  person: {
    name: string;
    type: string;
  };
}

export const TravelsPage: React.FC = () => {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  const [travels, setTravels] = useState<Travel[]>([]);
  const [artists, setArtists] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTravel, setCurrentTravel] = useState<Travel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch artists
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select('*')
        .order('name');

      if (artistsError) throw artistsError;

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('first_name');

      if (contactsError) throw contactsError;

      // Fetch travels with details
      const { data: travelsData, error: travelsError } = await supabase
        .from('travels')
        .select(`
          *,
          travel_details (*),
          artist:artist_id (name),
          contact:contact_id (first_name, last_name)
        `)
        .order('scheduled_datetime', { ascending: false });

      if (travelsError) throw travelsError;

      setArtists(artistsData);
      setContacts(contactsData);
      setTravels(travelsData.map(travel => ({
        id: travel.id,
        personType: travel.artist_id ? 'ARTIST' : 'CONTACT',
        personId: travel.artist_id || travel.contact_id,
        isArrival: travel.is_arrival,
        travelType: travel.travel_type,
        scheduledDatetime: travel.scheduled_datetime,
        actualDatetime: travel.actual_datetime,
        notes: travel.notes,
        details: travel.travel_details?.[0],
        person: {
          name: travel.artist ? travel.artist.name : `${travel.contact.first_name} ${travel.contact.last_name}`,
          type: travel.artist_id ? 'Artist' : 'Contact'
        }
      })));

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const travelData = {
        artist_id: data.personType === 'ARTIST' ? data.artistId : null,
        contact_id: data.personType === 'CONTACT' ? data.contactId : null,
        is_arrival: data.isArrival === 'true',
        travel_type: data.travelType,
        scheduled_datetime: data.scheduledDatetime,
        actual_datetime: data.actualDatetime || null,
        notes: data.notes
      };

      let travelId;
      if (currentTravel) {
        const { error: updateError } = await supabase
          .from('travels')
          .update(travelData)
          .eq('id', currentTravel.id);

        if (updateError) throw updateError;
        travelId = currentTravel.id;
      } else {
        const { data: newTravel, error: insertError } = await supabase
          .from('travels')
          .insert(travelData)
          .select()
          .single();

        if (insertError) throw insertError;
        travelId = newTravel.id;
      }

      // Handle travel details for plane/train
      if (['PLANE', 'TRAIN'].includes(data.travelType)) {
        const detailsData = {
          travel_id: travelId,
          reference_number: data.referenceNumber,
          departure_location: data.departureLocation,
          arrival_location: data.arrivalLocation
        };

        if (currentTravel?.details) {
          const { error: updateDetailsError } = await supabase
            .from('travel_details')
            .update(detailsData)
            .eq('travel_id', travelId);

          if (updateDetailsError) throw updateDetailsError;
        } else {
          const { error: insertDetailsError } = await supabase
            .from('travel_details')
            .insert(detailsData);

          if (insertDetailsError) throw insertDetailsError;
        }
      }

      await fetchData();
      setIsTravelModalOpen(false);
      setCurrentTravel(null);
    } catch (error: any) {
      console.error('Error saving travel:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('travels')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchData();
    } catch (error: any) {
      console.error('Error deleting travel:', error);
      setError(error.message);
    }
  };

  const filteredTravels = travels.filter(travel => {
    const searchString = searchTerm.toLowerCase();
    return (
      travel.person.name.toLowerCase().includes(searchString) ||
      travel.travelType.toLowerCase().includes(searchString) ||
      (travel.details?.referenceNumber.toLowerCase().includes(searchString))
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('travels.title')}
        description={t('travels.description')}
        actionLabel="Add Travel"
        onAction={() => {
          setCurrentTravel(null);
          setIsTravelModalOpen(true);
        }}
      />

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Travel Form */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Add New Travel
            </h2>
          </CardHeader>
          <CardContent>
            <TravelForm
              artists={artists}
              contacts={contacts}
              onSubmit={handleSubmit}
              onCancel={() => setIsTravelModalOpen(false)}
            />
          </CardContent>
        </Card>

        {/* Right Column - Travel List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Travel Schedule
              </h2>
              <Input
                placeholder="Search travels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={18} />}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : travels.length === 0 ? (
              <div className="text-center py-12">
                <Navigation className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No travels</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by adding a new travel record.
                </p>
              </div>
            ) : (
              <TravelList
                travels={filteredTravels}
                onEdit={(travel) => {
                  setCurrentTravel(travel);
                  setIsTravelModalOpen(true);
                }}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isTravelModalOpen}
        onClose={() => {
          setIsTravelModalOpen(false);
          setCurrentTravel(null);
        }}
        title={currentTravel ? 'Edit Travel' : 'Add Travel'}
        size="xl"
      >
        <TravelForm
          artists={artists}
          contacts={contacts}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsTravelModalOpen(false);
            setCurrentTravel(null);
          }}
        />
      </Modal>
    </div>
  );
};
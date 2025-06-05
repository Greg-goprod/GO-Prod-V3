import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, User } from 'lucide-react';
import { Contact, Artist } from '../types';
import { useSupabase } from '../lib/supabaseClient';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { ContactForm } from '../components/contacts/ContactForm';
import { ContactTable } from '../components/contacts/ContactTable';

// Composant principal pour la page des contacts
const ContactsPage: React.FC = () => {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [functions, setFunctions] = useState<{ id: string; name: string; }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Récupération des artistes
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select('*')
        .order('name');

      if (artistsError) throw artistsError;

      // Récupération des fonctions
      const { data: functionsData, error: functionsError } = await supabase
        .from('contact_functions')
        .select('*')
        .order('name');

      if (functionsError) throw functionsError;

      // Récupération des contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select(`
          *,
          contact_functions (name),
          artists (name)
        `)
        .order('created_at', { ascending: false });

      if (contactsError) throw contactsError;

      setArtists(artistsData.map(artist => ({
        id: artist.id,
        name: artist.name,
        photoUrl: artist.photo_url,
        spotifyUrl: artist.spotify_url,
        performanceDate: artist.performance_date,
        scene: artist.scene
      })));

      setFunctions(functionsData);

      setContacts(contactsData.map(contact => ({
        id: contact.id,
        firstName: contact.first_name,
        lastName: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        function: contact.contact_functions.name,
        functionId: contact.function_id,
        artistId: contact.artist_id
      })));

    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentContact(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchData();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression du contact');
    }
  };

  const handleSubmit = async (data: Omit<Contact, 'id'>) => {
    try {
      if (currentContact) {
        const { error: updateError } = await supabase
          .from('contacts')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            function_id: data.functionId,
            artist_id: data.artistId || null
          })
          .eq('id', currentContact.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('contacts')
          .insert({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            function_id: data.functionId,
            artist_id: data.artistId || null
          });

        if (insertError) throw insertError;
      }

      await fetchData();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setError('Erreur lors de l\'enregistrement du contact');
    }
  };

  const filteredContacts = contacts.filter(contact => 
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.function.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getArtistName = (artistId?: string) => {
    if (!artistId) return undefined;
    return artists.find(artist => artist.id === artistId)?.name;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('contacts.title')}
        description={t('contacts.description')}
        actionLabel={t('contacts.addContact')}
        onAction={handleAddClick}
      />

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState
          title={t('contacts.noContacts')}
          description={t('contacts.addFirst')}
          icon={<User size={24} />}
          actionLabel={t('contacts.addContact')}
          onAction={handleAddClick}
        />
      ) : filteredContacts.length === 0 ? (
        <EmptyState
          title={t('common.noResults')}
          description={`${t('common.noResults')} "${searchTerm}"`}
          icon={<Search size={24} />}
        />
      ) : (
        <ContactTable
          contacts={filteredContacts}
          getArtistName={getArtistName}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentContact ? t('contacts.editContact') : t('contacts.addContact')}
      >
        <ContactForm
          contact={currentContact}
          artists={artists}
          functions={functions}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// Export nommé
export { ContactsPage };

// Export par défaut pour faciliter le chargement asynchrone
export default ContactsPage;
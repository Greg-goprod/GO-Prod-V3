import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Users } from 'lucide-react';
import { Artist } from '../types';
import { useSupabase } from '../lib/supabaseClient';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { ViewToggle } from '../components/common/ViewToggle';
import { ArtistForm } from '../components/artists/ArtistForm';
import { ArtistTable } from '../components/artists/ArtistTable';
import { ArtistCard } from '../components/artists/ArtistCard';

export default function ArtistsPage() {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArtist, setCurrentArtist] = useState<Artist | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('name');

      if (error) throw error;

      setArtists(data.map(artist => ({
        id: artist.id,
        name: artist.name,
        spotifyUrl: artist.spotify_url,
        performanceDate: artist.performance_date,
        scene: artist.scene
      })));
    } catch (error: any) {
      console.error('Error fetching artists:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Artist, 'id'>) => {
    try {
      setError(null);
      if (currentArtist) {
        const { error: updateError } = await supabase
          .from('artists')
          .update({
            name: data.name,
            spotify_url: data.spotifyUrl
          })
          .eq('id', currentArtist.id);

        if (updateError) throw updateError;
      } else {
        const { data: newArtist, error: insertError } = await supabase
          .from('artists')
          .insert({
            name: data.name,
            spotify_url: data.spotifyUrl
          })
          .select()
          .single();

        if (insertError) throw insertError;
      }

      await fetchArtists();
      setIsModalOpen(false);
      setCurrentArtist(undefined);
    } catch (error: any) {
      console.error('Error saving artist:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('artists')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchArtists();
    } catch (error: any) {
      console.error('Error deleting artist:', error);
      setError(error.message);
    }
  };

  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('artists.title')}
        description={t('artists.description')}
        actionLabel={t('artists.addArtist')}
        onAction={() => {
          setCurrentArtist(undefined);
          setIsModalOpen(true);
        }}
        rightContent={
          <ViewToggle
            currentView={viewMode}
            onViewChange={setViewMode}
          />
        }
      />

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

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
      ) : artists.length === 0 ? (
        <EmptyState
          title={t('artists.noArtists')}
          description={t('artists.addFirst')}
          icon={<Users size={24} />}
          actionLabel={t('artists.addArtist')}
          onAction={() => {
            setCurrentArtist(undefined);
            setIsModalOpen(true);
          }}
        />
      ) : filteredArtists.length === 0 ? (
        <EmptyState
          title={t('common.noResults')}
          description={`${t('common.noResults')} "${searchTerm}"`}
          icon={<Search size={24} />}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
            />
          ))}
        </div>
      ) : (
        <ArtistTable
          artists={filteredArtists}
          onEdit={(artist) => {
            setCurrentArtist(artist);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentArtist(undefined);
        }}
        title={currentArtist ? t('artists.editArtist') : t('artists.addArtist')}
      >
        <ArtistForm
          artist={currentArtist}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setCurrentArtist(undefined);
          }}
        />
      </Modal>
    </div>
  );
}

export { ArtistsPage };
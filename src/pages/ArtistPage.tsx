import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useSupabase } from '../lib/supabaseClient';
import { fetchLastFmArtistImage } from '../lib/lastfm';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export default function ArtistPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { supabase } = useSupabase();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchArtist();
  }, [id]);

  const fetchArtist = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setArtist(data);
    } catch (error: any) {
      console.error('Error fetching artist:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateImage = async () => {
    if (!artist?.name) {
      setError('Artist name is required');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const imageUrl = await fetchLastFmArtistImage(artist.name);
      if (!imageUrl) {
        throw new Error('No image found on Last.fm');
      }

      const { error } = await supabase
        .from('artists')
        .update({ photo_url: imageUrl })
        .eq('id', artist.id);

      if (error) throw error;

      await fetchArtist();
    } catch (error: any) {
      console.error('Error updating image:', error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="p-6">
        <Alert variant="error">Artist not found</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={artist.name}
        description={t('artists.details')}
      />

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Photo */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
            {artist.photo_url ? (
              <img
                src={artist.photo_url}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No photo available
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              onClick={handleUpdateImage}
              disabled={updating}
              icon={<RefreshCw className={updating ? 'animate-spin' : ''} size={16} />}
            >
              {updating ? 'Updating...' : 'Update from Last.fm'}
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open(artist.spotify_url, '_blank')}
              disabled={!artist.spotify_url}
              icon={<ExternalLink size={16} />}
            >
              Open on Spotify
            </Button>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {artist.performance_date && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Performance Date
                </h3>
                <p className="mt-1 text-sm">
                  {new Date(artist.performance_date).toLocaleDateString()}
                </p>
              </div>
            )}

            {artist.stage && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Stage
                </h3>
                <p className="mt-1 text-sm">
                  {artist.stage}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Social Media
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {artist.instagram_url && (
                <Button
                  variant="outline"
                  onClick={() => window.open(artist.instagram_url, '_blank')}
                >
                  Instagram
                </Button>
              )}
              {artist.facebook_url && (
                <Button
                  variant="outline"
                  onClick={() => window.open(artist.facebook_url, '_blank')}
                >
                  Facebook
                </Button>
              )}
              {artist.twitter_url && (
                <Button
                  variant="outline"
                  onClick={() => window.open(artist.twitter_url, '_blank')}
                >
                  Twitter
                </Button>
              )}
              {artist.youtube_url && (
                <Button
                  variant="outline"
                  onClick={() => window.open(artist.youtube_url, '_blank')}
                >
                  YouTube
                </Button>
              )}
              {artist.tiktok_url && (
                <Button
                  variant="outline"
                  onClick={() => window.open(artist.tiktok_url, '_blank')}
                >
                  TikTok
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
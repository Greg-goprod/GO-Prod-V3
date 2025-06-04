import React from 'react';
import { useTranslation } from 'react-i18next';
import { Artist } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { t } = useTranslation();

  const getSceneBadgeVariant = (scene?: string) => {
    switch (scene) {
      case 'MAINSTAGE':
        return 'primary';
      case 'RIVERSTAGE':
        return 'secondary';
      case 'LA GRANGE':
        return 'accent';
      default:
        return 'default';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{artist.name}</h3>
          {artist.scene && (
            <Badge variant={getSceneBadgeVariant(artist.scene)}>
              {artist.scene}
            </Badge>
          )}
        </div>

        {artist.spotifyUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(artist.spotifyUrl, '_blank')}
            icon={<ExternalLink size={16} />}
          >
            {t('artists.spotify')}
          </Button>
        )}
      </div>
    </Card>
  );
};
import React, { useState } from 'react';
import { ExternalLink, Edit, Trash2, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Artist } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface ArtistTableProps {
  artists: Artist[];
  onEdit: (artist: Artist) => void;
  onDelete: (id: string) => void;
}

type SortField = 'name' | 'performanceDate' | 'scene';
type SortDirection = 'asc' | 'desc';

export const ArtistTable: React.FC<ArtistTableProps> = ({
  artists,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('performanceDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [dateFilter, setDateFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (id: string) => {
    setArtistToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (artistToDelete) {
      onDelete(artistToDelete);
      setShowDeleteConfirm(false);
      setArtistToDelete(null);
    }
  };

  const sortedArtists = [...artists].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name, 'fr')
        : b.name.localeCompare(a.name, 'fr');
    } else if (sortField === 'performanceDate') {
      const dateA = a.performanceDate ? new Date(a.performanceDate).getTime() : 0;
      const dateB = b.performanceDate ? new Date(b.performanceDate).getTime() : 0;
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'scene') {
      const sceneA = a.scene || '';
      const sceneB = b.scene || '';
      return sortDirection === 'asc'
        ? sceneA.localeCompare(sceneB)
        : sceneB.localeCompare(sceneA);
    }
    return 0;
  });

  const filteredArtists = dateFilter
    ? sortedArtists.filter(artist => {
        if (!artist.performanceDate) return false;
        const filterDate = new Date(dateFilter);
        const performanceDate = new Date(artist.performanceDate);
        return (
          performanceDate.getFullYear() === filterDate.getFullYear() &&
          performanceDate.getMonth() === filterDate.getMonth() &&
          performanceDate.getDate() === filterDate.getDate()
        );
      })
    : sortedArtists;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

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
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-64">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            label={t('artists.filterByDate')}
            leftIcon={<Calendar size={16} />}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-dark-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('artists.name')}</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('scene')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('artists.scene')}</span>
                  <SortIcon field="scene" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('performanceDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('artists.performanceDate')}</span>
                  <SortIcon field="performanceDate" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Links
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            {filteredArtists.map((artist) => (
              <tr key={artist.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={artist.photoUrl} 
                        alt={artist.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{artist.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {artist.scene ? (
                    <Badge variant={getSceneBadgeVariant(artist.scene)}>
                      {artist.scene}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {artist.performanceDate ? (
                    <div className="text-sm text-gray-900 dark:text-white">
                      {format(new Date(artist.performanceDate), 'Pp', { locale: fr })}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('artists.notScheduled')}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(artist.spotifyUrl, '_blank')}
                    icon={<ExternalLink size={16} />}
                  >
                    {t('artists.spotify')}
                  </Button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(artist)}
                      icon={<Edit size={16} />}
                      aria-label={t('common.edit')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(artist.id)}
                      icon={<Trash2 size={16} />}
                      aria-label={t('common.delete')}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t('artists.deleteTitle')}
      >
        <div className="space-y-4">
          <p className="text-gray-900 dark:text-gray-300">
            {t('artists.deleteConfirm')} {artistToDelete ? artists.find(a => a.id === artistToDelete)?.name : ''} ? {t('artists.deleteMessage')}
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
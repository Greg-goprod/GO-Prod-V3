import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Artist, Scene } from '../../types';
import { FormAccordion } from '../ui/FormAccordion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

interface ArtistFormProps {
  artist?: Artist;
  onSubmit: (data: Omit<Artist, 'id'>) => void;
  onCancel: () => void;
}

type FormData = {
  name: string;
  spotifyUrl: string;
  performanceDate?: string;
  scene?: Scene;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
};

const sceneOptions: Scene[] = ['MAINSTAGE', 'RIVERSTAGE', 'LA GRANGE'];

export const ArtistForm: React.FC<ArtistFormProps> = ({
  artist,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: artist?.name || '',
      spotifyUrl: artist?.spotifyUrl || '',
      performanceDate: artist?.performanceDate || '',
      scene: artist?.scene,
      instagramUrl: artist?.instagramUrl || '',
      facebookUrl: artist?.facebookUrl || '',
      tiktokUrl: artist?.tiktokUrl || '',
      twitterUrl: artist?.twitterUrl || '',
      youtubeUrl: artist?.youtubeUrl || ''
    }
  });

  const handleDateChange = (date: Date | null) => {
    setValue('performanceDate', date ? date.toISOString().split('T')[0] : undefined);
  };

  const parseDate = (dateStr?: string): Date | null => {
    return dateStr ? new Date(dateStr) : null;
  };

  const sections = [
    {
      id: 'basic',
      title: t('artists.sections.basic'),
      description: '',
      children: (
        <>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('artists.artistName')}</label>
            <Input
              {...register('name', { required: t('common.required') as string })}
              error={Boolean(errors.name)}
              placeholder={t('artists.artistNamePlaceholder')}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
            {errors.name && <p className="mt-1 text-xs text-error-600">{errors.name.message}</p>}
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('artists.spotifyProfile')}</label>
            <Input
              {...register('spotifyUrl', {
                required: t('common.required') as string,
                pattern: {
                  value: /^https:\/\/open\.spotify\.com\/artist\/.+/i,
                  message: t('artists.invalidSpotifyUrl') as string
                }
              })}
              error={Boolean(errors.spotifyUrl)}
              placeholder="https://open.spotify.com/artist/..."
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
            {errors.spotifyUrl && <p className="mt-1 text-xs text-error-600">{errors.spotifyUrl.message}</p>}
          </div>
        </>
      )
    },
    {
      id: 'performance',
      title: t('artists.sections.performance'),
      description: '',
      children: (
        <>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('artists.performanceDate')}</label>
            <DatePicker
              value={parseDate(watch('performanceDate'))}
              onChange={handleDateChange}
              className="shadow-sm h-8 py-1 text-sm w-full"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('artists.scene')}</label>
            <Select
              {...register('scene')}
              options={sceneOptions.map(scene => ({ 
                value: scene, 
                label: t(`artists.scenes.${scene.toLowerCase()}`)
              }))}
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
        </>
      )
    },
    {
      id: 'social',
      title: t('artists.sections.socialMedia'),
      description: '',
      children: (
        <>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('artists.instagramProfile')}</label>
            <Input
              {...register('instagramUrl')}
              placeholder="https://instagram.com/..."
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('artists.facebookProfile')}</label>
            <Input
              {...register('facebookUrl')}
              placeholder="https://facebook.com/..."
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('artists.twitterProfile')}</label>
            <Input
              {...register('twitterUrl')}
              placeholder="https://twitter.com/..."
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('artists.tiktokProfile')}</label>
            <Input
              {...register('tiktokUrl')}
              placeholder="https://tiktok.com/@..."
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">{t('artists.youtubeChannel')}</label>
            <Input
              {...register('youtubeUrl')}
              placeholder="https://youtube.com/..."
              fullWidth
              className="shadow-sm h-8 py-1 text-sm"
            />
          </div>
        </>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-850 p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormAccordion 
          sections={sections}
          defaultSection="basic"
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" type="submit">
            {artist ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </div>
  );
};
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface OfferTemplate {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateFormProps {
  onSubmit: (data: Partial<OfferTemplate>) => void;
  onCancel: () => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      content: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Titre du modèle"
          {...register('title', { required: true })}
          placeholder="Entrez le titre du modèle"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <textarea
            {...register('content', { required: true })}
            rows={12}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Entrez le contenu du modèle..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary">
          Créer le modèle
        </Button>
      </div>
    </form>
  );
};
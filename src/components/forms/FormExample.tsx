
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

type UserFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const FormExample: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserFormValues>();

  const onSubmit = (data: UserFormValues) => {
    console.log('Formulaire soumis:', data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto bg-white dark:bg-minimalViolet-dark-background
                 border border-gray-200 dark:border-dark-600
                 shadow-sm dark:shadow-none rounded-lg p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-minimalViolet-light-primary dark:text-minimalViolet-dark-primary">
        Créer un compte
      </h2>

      <div className="form-section space-y-4">
        <Input
          label="Nom"
          {...register('name', { required: 'Ce champ est requis.' })}
          error={errors.name?.message}
          placeholder="Jean Dupont"
        />
        <Input
          label="Email"
          type="email"
          {...register('email', {
            required: 'L’email est requis.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Format d’email invalide.',
            },
          })}
          error={errors.email?.message}
          placeholder="jean@example.com"
        />
        <Input
          label="Mot de passe"
          type="password"
          {...register('password', {
            required: 'Mot de passe requis.',
            minLength: {
              value: 6,
              message: 'Au moins 6 caractères.',
            },
          })}
          error={errors.password?.message}
        />
        <Input
          label="Confirmation"
          type="password"
          {...register('confirmPassword', {
            validate: value =>
              value === watch('password') || 'Les mots de passe ne correspondent pas.',
          })}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" type="button">Annuler</Button>
        <Button type="submit">Valider</Button>
      </div>
    </form>
  );
};

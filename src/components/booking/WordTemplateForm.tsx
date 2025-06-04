import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import { useSupabase } from '../../lib/supabaseClient';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface WordTemplate {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  createdBy: string;
  createdAt: string;
}

interface WordTemplateFormProps {
  onSubmit: (data: Partial<WordTemplate>) => void;
  onCancel: () => void;
}

export const WordTemplateForm: React.FC<WordTemplateFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const { supabase } = useSupabase();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: ''
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setError('Only .docx files are allowed');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const processForm = async (data: any) => {
    try {
      setUploading(true);
      setError(null);

      if (!file) {
        setError('Please select a file');
        return;
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('word-templates')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('word-templates')
        .getPublicUrl(filePath);

      onSubmit({
        ...data,
        fileUrl: publicUrl
      });
    } catch (error: any) {
      console.error('Error uploading template:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processForm)} className="space-y-6">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Input
        label="Title"
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
      />

      <Input
        label="Description"
        {...register('description')}
        as="textarea"
        rows={3}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Template File (.docx)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="hidden"
            id="template-file"
          />
          <label
            htmlFor="template-file"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload size={16} className="mr-2" />
            Choose File
          </label>
          {file && (
            <span className="text-sm text-gray-600">
              {file.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Template'}
        </Button>
      </div>
    </form>
  );
};
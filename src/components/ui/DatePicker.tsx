import React, { forwardRef, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { MaterialDateTimeInput } from './MaterialDateTimePicker';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  error?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value, onChange, error, fullWidth = false, size = 'md', placeholder = 'Sélectionner une date', ...props }, ref) => {
    return (
      <MaterialDateTimeInput
        value={value}
        onChange={onChange}
        error={error}
        fullWidth={fullWidth}
        size={size}
        placeholder={placeholder}
        showTimeSelector={false}
        className={className}
        {...props}
      />
    );
  }
);

DatePicker.displayName = 'DatePicker'; 
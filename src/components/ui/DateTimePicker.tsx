import React, { forwardRef } from 'react';
import { MaterialDateTimeInput } from './MaterialDateTimePicker';

export interface DateTimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  error?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  showTimeSelector?: boolean;
  timeFormat?: '12h' | '24h';
  label?: string;
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(({
  value,
  onChange,
  error,
  fullWidth = false,
  size = 'md',
  placeholder = 'Sélectionner date et heure',
  showTimeSelector = true,
  label,
  className,
  ...props
}, ref) => {
  return (
    <MaterialDateTimeInput
      value={value}
      onChange={onChange}
      error={error}
      fullWidth={fullWidth}
      size={size}
      placeholder={placeholder}
      showTimeSelector={showTimeSelector}
      label={label}
      className={className}
      {...props}
    />
  );
});

DateTimePicker.displayName = 'DateTimePicker';
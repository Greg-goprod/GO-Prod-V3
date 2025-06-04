import React, { forwardRef, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { ComponentSize, InputVariant } from '../../lib/design-tokens';
import { Button } from './Button';
import { Calendar } from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  error?: boolean;
  fullWidth?: boolean;
  size?: ComponentSize;
  variant?: InputVariant;
  placeholder?: string;
  label?: string;
  helperText?: string;
}

/**
 * Composant DatePicker standardisé
 * Permet à l'utilisateur de sélectionner une date
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ 
    className, 
    value, 
    onChange, 
    error, 
    fullWidth = false, 
    size = 'md', 
    variant = 'default',
    placeholder = 'Sélectionner une date', 
    label,
    helperText,
    ...props 
  }, ref) => {
    const [date, setDate] = useState<Date | null>(value || null);
    const [open, setOpen] = useState(false);

    // Déterminer les styles de taille
    const sizeStyles = {
      xs: 'h-7 text-xs px-2',
      sm: 'h-8 text-sm px-3',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4',
      xl: 'h-14 text-lg px-5',
    };

    // Gérer le changement de date
    const handleDateChange = (newDate: Date | null) => {
      setDate(newDate);
      onChange?.(newDate);
      setOpen(false);
    };

    return (
      <div className={cn('flex flex-col space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size={size}
              className={cn(
                'justify-start text-left font-normal',
                !date && 'text-gray-400 dark:text-gray-500',
                sizeStyles[size],
                fullWidth && 'w-full',
                error && 'border-error-500 dark:border-error-500',
                className
              )}
              ref={ref as any}
              {...props}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, 'dd/MM/yyyy', { locale: fr })
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        {helperText && (
          <p className={cn(
            "text-xs",
            error ? "text-error-600 dark:text-error-500" : "text-gray-500 dark:text-gray-400"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker'; 
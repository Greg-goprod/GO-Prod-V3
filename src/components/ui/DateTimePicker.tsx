import React, { forwardRef, useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { ComponentSize, InputVariant } from '../../lib/design-tokens';
import { Button } from './Button';
import { Calendar } from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Select } from './Select';

export interface DateTimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  error?: boolean;
  fullWidth?: boolean;
  size?: ComponentSize;
  variant?: InputVariant;
  placeholder?: string;
  timeFormat?: '12h' | '24h';
  label?: string;
  helperText?: string;
}

/**
 * Composant DateTimePicker standardisé
 * Permet à l'utilisateur de sélectionner une date et une heure
 */
export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(({
  value,
  onChange,
  error,
  fullWidth = false,
  size = 'md',
  variant = 'default',
  placeholder = 'Sélectionner date et heure',
  timeFormat = '24h',
  label,
  helperText,
  className,
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
    if (newDate) {
      const updatedDate = date ? new Date(date) : new Date();
      updatedDate.setFullYear(newDate.getFullYear());
      updatedDate.setMonth(newDate.getMonth());
      updatedDate.setDate(newDate.getDate());
      
      setDate(updatedDate);
      onChange?.(updatedDate);
    } else {
      setDate(null);
      onChange?.(null);
    }
  };

  // Gérer le changement d'heure
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>, type: 'hour' | 'minute') => {
    const value = parseInt(e.target.value, 10);
    if (date) {
      const newDate = new Date(date);
      
      if (type === 'hour') {
        newDate.setHours(value);
      } else {
        newDate.setMinutes(value);
      }
      
      setDate(newDate);
      onChange?.(newDate);
    } else {
      // Si aucune date n'est sélectionnée, créer une nouvelle date avec l'heure sélectionnée
      const newDate = new Date();
      if (type === 'hour') {
        newDate.setHours(value);
      } else {
        newDate.setMinutes(value);
      }
      
      setDate(newDate);
      onChange?.(newDate);
    }
  };

  // Générer les options d'heures (format 12h ou 24h)
  const generateHourOptions = () => {
    const options = [];
    const maxHour = timeFormat === '12h' ? 12 : 23;
    const minHour = timeFormat === '12h' ? 1 : 0;
    
    for (let i = minHour; i <= maxHour; i++) {
      options.push({
        value: i.toString(),
        label: i.toString().padStart(2, '0')
      });
    }
    
    return options;
  };

  // Générer les options de minutes (par pas de 5)
  const generateMinuteOptions = () => {
    const options = [];
    
    for (let i = 0; i < 60; i += 5) {
      options.push({
        value: i.toString(),
        label: i.toString().padStart(2, '0')
      });
    }
    
    return options;
  };
  
  // Générer les options AM/PM pour le format 12h
  const periodOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
  ];

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
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, 'dd/MM/yyyy HH:mm', { locale: fr })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Date et heure
              </p>
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleDateChange}
            initialFocus
          />
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  options={generateHourOptions()}
                  value={date ? date.getHours().toString() : ''}
                  onChange={(e) => handleTimeChange(e, 'hour')}
                  size="sm"
                  aria-label="Heure"
                />
              </div>
              <span className="text-gray-500 dark:text-gray-400">:</span>
              <div className="flex-1">
                <Select
                  options={generateMinuteOptions()}
                  value={date ? (Math.floor(date.getMinutes() / 5) * 5).toString() : ''}
                  onChange={(e) => handleTimeChange(e, 'minute')}
                  size="sm"
                  aria-label="Minutes"
                />
              </div>
              
              {timeFormat === '12h' && (
                <div className="flex-1">
                  <Select
                    options={periodOptions}
                    value={date && date.getHours() >= 12 ? 'PM' : 'AM'}
                    onChange={(e) => {
                      if (date) {
                        const newDate = new Date(date);
                        const currentHours = newDate.getHours();
                        const isPM = e.target.value === 'PM';
                        
                        if (isPM && currentHours < 12) {
                          newDate.setHours(currentHours + 12);
                        } else if (!isPM && currentHours >= 12) {
                          newDate.setHours(currentHours - 12);
                        }
                        
                        setDate(newDate);
                        onChange?.(newDate);
                      }
                    }}
                    size="sm"
                    aria-label="AM/PM"
                  />
                </div>
              )}
            </div>
          </div>
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
});

DateTimePicker.displayName = 'DateTimePicker';
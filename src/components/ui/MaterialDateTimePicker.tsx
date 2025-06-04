import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { frFR } from '@mui/x-date-pickers/locales';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Modal, Box, Button } from '@mui/material';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MaterialDateTimePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  open: boolean;
  onClose: () => void;
  onAccept: (date: Date | null) => void;
}

interface DateTimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  error?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  label?: string;
  showTimeSelector?: boolean;
  className?: string;
}

// Thème personnalisé pour correspondre au visuel souhaité
const theme = createTheme({
  palette: {
    primary: {
      main: '#7000FF', // Violet
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          color: '#000',
          backgroundColor: '#fff',
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#7000FF',
            color: '#fff',
          },
        },
      },
    },
    MuiClock: {
      styleOverrides: {
        pin: {
          backgroundColor: '#7000FF',
        },
        clock: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiClockPointer: {
      styleOverrides: {
        root: {
          backgroundColor: '#7000FF',
        },
        thumb: {
          backgroundColor: '#7000FF',
          borderColor: '#7000FF',
        },
      },
    },
    MuiClockNumber: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#7000FF',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

// Composant Modal du DateTimePicker
export const MaterialDateTimePicker: React.FC<MaterialDateTimePickerProps> = ({
  value = new Date(),
  onChange,
  open,
  onClose,
  onAccept,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || new Date());

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const handleAccept = () => {
    onAccept(selectedDate);
    onClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={fr}
        localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="date-time-picker-modal"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 320,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <StaticDateTimePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={handleDateChange}
              ampm={false} // Format 24h
              renderInput={() => <div />}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
              <Button 
                sx={{ color: '#7000FF' }} 
                onClick={onClose}
              >
                ANNULER
              </Button>
              <Button 
                sx={{ color: '#7000FF' }} 
                onClick={handleAccept}
              >
                OK
              </Button>
            </Box>
          </Box>
        </Modal>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

// Composant d'entrée du DateTimePicker
export const MaterialDateTimeInput: React.FC<DateTimeInputProps> = ({
  value,
  onChange,
  error,
  fullWidth = false,
  size = 'md',
  placeholder = 'Sélectionner date et heure',
  label,
  showTimeSelector = true,
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = (date: Date | null) => {
    setSelectedDate(date);
    onChange?.(date);
  };

  // Formatage selon le format européen
  const formattedDateTime = selectedDate
    ? format(selectedDate, showTimeSelector ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy', { locale: fr })
    : '';

  return (
    <div className={cn('relative', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={formattedDateTime}
          readOnly
          onClick={handleOpen}
          placeholder={placeholder}
          className={cn(
            'block rounded-md shadow-sm transition duration-200',
            'border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-dark-800',
            'text-gray-900 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            error && 'border-error-500 dark:border-error-500',
            'pr-10', // Espace pour l'icône
            size === 'sm' && 'px-3 py-1.5 text-sm',
            size === 'md' && 'px-4 py-2 text-base',
            size === 'lg' && 'px-5 py-2.5 text-lg',
            fullWidth && 'w-full',
            'cursor-pointer',
            className
          )}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
          <CalendarIcon size={18} />
        </div>
      </div>

      <MaterialDateTimePicker
        value={selectedDate}
        onChange={setSelectedDate}
        open={open}
        onClose={handleClose}
        onAccept={handleAccept}
      />
    </div>
  );
}; 
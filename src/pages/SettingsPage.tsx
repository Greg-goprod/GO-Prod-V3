import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Moon, Sun, Plus, X, UserCheck, Contact, Settings as SettingsIcon,
  Globe, Users, Car, Calendar, Navigation, Briefcase, Edit, Trash2, Clock
} from 'lucide-react';
import { useStore } from '../store';
import { useSupabase } from '../lib/supabaseClient';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Modal } from '../components/ui/Modal';
import { EventForm } from '../components/settings/EventForm';
import { ExcelImport } from '../components/settings/ExcelImport';

const languageOptions = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' }
];

type SettingsSection = 'general' | 'events' | 'schedules' | 'artists' | 'contacts' | 'drivers' | 'vehicles' | 'shifts' | 'missions' | 'travels';

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, isDarkMode, toggleDarkMode } = useStore();
  const { supabase } = useSupabase();
  const [languages, setLanguages] = useState<any[]>([]);
  const [contactFunctions, setContactFunctions] = useState<{ id: string; name: string; }[]>([]);
  const [newLanguage, setNewLanguage] = useState('');
  const [newFunction, setNewFunction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<SettingsSection>('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(undefined);
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newEquipment, setNewEquipment] = useState('');
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);

  const driverColumns = [
    'first_name',
    'last_name',
    'street',
    'postal_code',
    'city',
    'email',
    'phone',
    'birth_date',
    'hired_year'
  ];

  const vehicleColumns = [
    'brand',
    'model',
    'color',
    'passenger_capacity',
    'luggage_capacity',
    'engagement_number',
    'registration_number',
    'supplier'
  ];

  useEffect(() => {
    fetchData();
  }, [currentSection]);

  useEffect(() => {
    if (currentSection === 'schedules') {
      fetchSchedules();
    }
  }, [currentSection]);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('day');
      
      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleScheduleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .insert([data]);
      
      if (error) throw error;
      
      await fetchSchedules();
      setIsScheduleModalOpen(false);
      setSuccess('Schedule added successfully');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      switch (currentSection) {
        case 'vehicles':
          const { data: equipmentData, error: equipmentError } = await supabase.rpc('get_enum_values', {
            enum_name: 'additional_equipment'
          });
          if (equipmentError) throw equipmentError;
          setEquipmentList(equipmentData?.map(item => item.value) || []);
          break;

        case 'drivers':
          const { data: languagesData, error: languagesError } = await supabase
            .from('languages')
            .select('*')
            .order('name');
          if (languagesError) throw languagesError;
          setLanguages(languagesData || []);
          break;

        case 'contacts':
          const { data: functionsData, error: functionsError } = await supabase
            .from('contact_functions')
            .select('*')
            .order('name');
          if (functionsError) throw functionsError;
          setContactFunctions(functionsData || []);
          break;

        case 'events':
          const [{ data: eventsData }, { data: contactsData }] = await Promise.all([
            supabase.from('events').select('*'),
            supabase.from('contacts').select('*').order('first_name')
          ]);
          setEvents(eventsData || []);
          setContacts(contactsData || []);
          break;
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
  };

  const handleAddEquipment = async () => {
    try {
      if (!newEquipment.trim()) {
        setError('Equipment name is required');
        return;
      }

      const formattedEquipment = newEquipment.trim().toUpperCase().replace(/\s+/g, '_');
      const { error: addError } = await supabase.rpc('add_enum_value', {
        enum_name: 'additional_equipment',
        new_value: formattedEquipment
      });

      if (addError) throw addError;

      setNewEquipment('');
      setSuccess('Equipment added successfully');
      fetchData();
    } catch (error: any) {
      console.error('Error adding equipment:', error);
      setError(error.message);
    }
  };

  const handleAddLanguage = async () => {
    try {
      if (!newLanguage.trim()) {
        setError('Language name is required');
        return;
      }

      const { error: insertError } = await supabase
        .from('languages')
        .insert({ name: newLanguage.trim() });

      if (insertError) throw insertError;

      setNewLanguage('');
      setSuccess('Language added successfully');
      fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteLanguage = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('languages')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSuccess('Language deleted successfully');
      fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleAddFunction = async () => {
    try {
      if (!newFunction.trim()) {
        setError('Function name is required');
        return;
      }

      const { error: insertError } = await supabase
        .from('contact_functions')
        .insert({ name: newFunction.trim() });

      if (insertError) throw insertError;

      setNewFunction('');
      setSuccess('Function added successfully');
      fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteFunction = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('contact_functions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSuccess('Function deleted successfully');
      fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDriverImport = async (data: any[]) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .insert(data);
      
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      throw new Error(`Failed to import drivers: ${error.message}`);
    }
  };

  const handleVehicleImport = async (data: any[]) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .insert(data);
      
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      throw new Error(`Failed to import vehicles: ${error.message}`);
    }
  };

  const navigationItems: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: t('settings.general.title'), icon: <SettingsIcon size={16} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={16} /> },
    { id: 'schedules', label: 'Schedules', icon: <Clock size={16} /> },
    { id: 'artists', label: t('navigation.artists'), icon: <Users size={16} /> },
    { id: 'contacts', label: t('navigation.contacts'), icon: <Contact size={16} /> },
    { id: 'drivers', label: t('navigation.drivers'), icon: <UserCheck size={16} /> },
    { id: 'vehicles', label: t('navigation.vehicles'), icon: <Car size={16} /> },
    { id: 'shifts', label: t('navigation.shifts'), icon: <Calendar size={16} /> },
    { id: 'missions', label: t('navigation.missions'), icon: <Briefcase size={16} /> },
    { id: 'travels', label: t('navigation.travels'), icon: <Navigation size={16} /> },
  ];

  const renderSchedulesSection = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Schedules</h2>
          <Button
            variant="primary"
            onClick={() => setIsScheduleModalOpen(true)}
            icon={<Plus size={18} />}
          >
            Add Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
            >
              <div>
                <p className="font-medium">{schedule.day}</p>
                <p className="text-sm text-gray-500">
                  {schedule.start_time} - {schedule.end_time}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {/* Handle edit */}}
                  icon={<Edit size={16} />}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {/* Handle delete */}}
                  icon={<Trash2 size={16} />}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 'schedules':
        return renderSchedulesSection();
      case 'drivers':
        return (
          <div className="space-y-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <h2 className="text-lg font-medium">Available Languages</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new language"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      onClick={handleAddLanguage}
                      icon={<Plus size={18} />}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-dark-700 rounded-md"
                      >
                        <span className="text-sm">{lang.name}</span>
                        <button
                          onClick={() => handleDeleteLanguage(lang.id)}
                          className="text-gray-500 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium">Import Drivers from Excel</h2>
              </CardHeader>
              <CardContent>
                <ExcelImport
                  allowedColumns={driverColumns}
                  templateName="drivers"
                  onImport={handleDriverImport}
                  sampleRow={{
                    first_name: 'John',
                    last_name: 'Doe',
                    street: '123 Main St',
                    postal_code: '12345',
                    city: 'New York',
                    email: 'john@example.com',
                    phone: '+1234567890',
                    birth_date: '1990-01-01',
                    hired_year: 2020
                  }}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'vehicles':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium">Vehicle Additional Equipment</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new equipment"
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      onClick={handleAddEquipment}
                      icon={<Plus size={18} />}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {equipmentList.map((equipment) => (
                      <div
                        key={equipment}
                        className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-dark-700 rounded-md"
                      >
                        <span className="text-sm">
                          {equipment.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium">Import Vehicles from Excel</h2>
              </CardHeader>
              <CardContent>
                <ExcelImport
                  allowedColumns={vehicleColumns}
                  templateName="vehicles"
                  onImport={handleVehicleImport}
                  sampleRow={{
                    brand: 'Toyota',
                    model: 'Camry',
                    color: 'Silver',
                    passenger_capacity: 5,
                    luggage_capacity: 3,
                    engagement_number: 'V001',
                    registration_number: 'ABC123',
                    supplier: 'Example Supplier'
                  }}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'general':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <h2 className="text-lg font-medium">{t('settings.theme.title')}</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('settings.theme.darkMode')}
                  </span>
                  <Button
                    variant="outline"
                    onClick={toggleDarkMode}
                    icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  >
                    {isDarkMode ? t('settings.theme.lightMode') : t('settings.theme.darkMode')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium">{t('settings.language.title')}</h2>
              </CardHeader>
              <CardContent>
                <Select
                  label={t('settings.language.description')}
                  options={languageOptions}
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'contacts':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <h2 className="text-lg font-medium">Contact Functions</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new function"
                      value={newFunction}
                      onChange={(e) => setNewFunction(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      onClick={handleAddFunction}
                      icon={<Plus size={18} />}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {contactFunctions.map((func) => (
                      <div
                        key={func.id}
                        className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-dark-700 rounded-md"
                      >
                        <span className="text-sm">{func.name}</span>
                        <button
                          onClick={() => handleDeleteFunction(func.id)}
                          className="text-gray-500 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'events':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Event Management</h2>
                <Button
                  variant="primary"
                  onClick={() => {
                    setCurrentEvent(undefined);
                    setIsEventModalOpen(true);
                  }}
                  icon={<Plus size={18} />}
                >
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by creating your first event.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {events.map((event: any) => (
                    <Card key={event.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {event.name}
                            </h3>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentEvent(event);
                                setIsEventModalOpen(true);
                              }}
                              icon={<Edit size={16} />}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* Handle delete */}}
                              icon={<Trash2 size={16} />}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">
                {navigationItems.find(item => item.id === currentSection)?.label} Settings
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                {t('settings.sections.coming_soon')}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('settings.title')}
        description={t('settings.description')}
      />

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="border-b border-gray-200 dark:border-dark-700">
        <nav className="-mb-px flex space-x-8">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`
                flex items-center px-1 py-4 border-b-2 text-sm font-medium
                ${currentSection === item.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        {renderSection()}
      </div>

      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Add Schedule"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleScheduleSubmit({
            day: formData.get('day'),
            start_time: formData.get('start_time'),
            end_time: formData.get('end_time')
          });
        }} className="space-y-4">
          <Select
            label="Day"
            name="day"
            options={[
              { value: 'Monday', label: 'Monday' },
              { value: 'Tuesday', label: 'Tuesday' },
              { value: 'Wednesday', label: 'Wednesday' },
              { value: 'Thursday', label: 'Thursday' },
              { value: 'Friday', label: 'Friday' },
              { value: 'Saturday', label: 'Saturday' },
              { value: 'Sunday', label: 'Sunday' }
            ]}
            required
          />
          
          <Input
            type="time"
            label="Start Time"
            name="start_time"
            required
          />
          
          <Input
            type="time"
            label="End Time"
            name="end_time"
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsScheduleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Schedule
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setCurrentEvent(undefined);
        }}
        title={currentEvent ? 'Edit Event' : 'Add Event'}
        size="xl"
      >
        <EventForm
          event={currentEvent}
          contacts={contacts}
          onSubmit={async (data) => {
            try {
              if (currentEvent) {
                await supabase
                  .from('events')
                  .update(data)
                  .eq('id', currentEvent.id);
              } else {
                await supabase
                  .from('events')
                  .insert(data);
              }
              
              fetchData();
              setIsEventModalOpen(false);
              setCurrentEvent(undefined);
            } catch (error: any) {
              console.error('Error saving event:', error);
              setError(error.message);
            }
          }}
          onCancel={() => {
            setIsEventModalOpen(false);
            setCurrentEvent(undefined);
          }}
        />
      </Modal>
    </div>
  );
};
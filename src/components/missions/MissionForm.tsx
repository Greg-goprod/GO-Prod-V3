import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabase } from '../../lib/supabaseClient';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface MissionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const MissionForm: React.FC<MissionFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  
  // Form state
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [driverId, setDriverId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [passengerId, setPassengerId] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [luggageCount, setLuggageCount] = useState(0);
  const [notes, setNotes] = useState('');
  
  // Options for dropdowns
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [passengers, setPassengers] = useState<any[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available drivers - removed status filter since the column doesn't exist
        const { data: driversData } = await supabase
          .from('drivers')
          .select('id, first_name, last_name')
          .order('first_name');
        
        // Fetch available vehicles
        const { data: vehiclesData } = await supabase
          .from('vehicles')
          .select('id, brand, model, registration_number')
          .eq('status', 'AVAILABLE')
          .order('brand');
        
        // Fetch passengers (from contacts or a dedicated table)
        const { data: passengersData } = await supabase
          .from('contacts')
          .select('id, first_name, last_name')
          .order('first_name');

        if (driversData) setDrivers(driversData);
        if (vehiclesData) setVehicles(vehiclesData);
        if (passengersData) setPassengers(passengersData);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!pickupAddress || !dropoffAddress || !pickupTime || !driverId || !vehicleId) {
        throw new Error(t('missions.errors.requiredFields'));
      }

      const missionData = {
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        pickup_time: pickupTime,
        driver_id: driverId,
        vehicle_id: vehicleId,
        passenger_id: passengerId || null,
        passenger_count: passengerCount,
        luggage_count: luggageCount,
        notes,
        status: 'pending'
      };

      const { error: insertError } = await supabase
        .from('missions')
        .insert([missionData]);

      if (insertError) throw insertError;

      await onSubmit(missionData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('missions.pickupAddress')}
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
        />
        
        <Input
          label={t('missions.dropoffAddress')}
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="datetime-local"
          label={t('missions.pickupTime')}
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          required
        />
        
        <Select
          label={t('missions.passenger')}
          value={passengerId}
          onChange={(e) => setPassengerId(e.target.value)}
          options={[
            { value: '', label: t('missions.selectPassenger') },
            ...passengers.map(p => ({
              value: p.id,
              label: `${p.first_name} ${p.last_name}`
            }))
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t('missions.driver')}
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          options={[
            { value: '', label: t('missions.selectDriver') },
            ...drivers.map(d => ({
              value: d.id,
              label: `${d.first_name} ${d.last_name}`
            }))
          ]}
          required
        />
        
        <Select
          label={t('missions.vehicle')}
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          options={[
            { value: '', label: t('missions.selectVehicle') },
            ...vehicles.map(v => ({
              value: v.id,
              label: `${v.brand} ${v.model} (${v.registration_number})`
            }))
          ]}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          label={t('missions.passengerCount')}
          value={passengerCount}
          onChange={(e) => setPassengerCount(parseInt(e.target.value))}
          min={1}
          required
        />
        
        <Input
          type="number"
          label={t('missions.luggageCount')}
          value={luggageCount}
          onChange={(e) => setLuggageCount(parseInt(e.target.value))}
          min={0}
        />
      </div>

      <Input
        label={t('missions.notes')}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        as="textarea"
        rows={4}
      />

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          type="submit"
          disabled={loading}
        >
          {loading ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
};
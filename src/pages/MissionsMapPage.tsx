import React, { useEffect, useState } from 'react';
import { useSupabase } from '../lib/supabaseClient';

export default function MissionsMapPage() {
  const { supabase } = useSupabase();
  const [missions, setMissions] = useState([]);
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const fetchMissions = async () => {
      const { data } = await supabase
        .from('missions')
        .select(`
          *,
          driver:drivers(*),
          vehicle:vehicles(*)
        `)
        .eq('status', 'in_progress');
      
      if (data) {
        setMissions(data);
      }
    };

    fetchMissions();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('missions_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'missions'
      }, () => {
        fetchMissions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white flex items-center justify-between">
        <h1 className="font-bold text-lg">Carte des missions</h1>
        <div className="text-sm">
          {missions.length} mission(s) en cours
        </div>
      </header>
      <main className="flex-1 relative">
        <iframe
          title="Carte Google Maps"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=46.81,7.15&zoom=9`}
        />
      </main>
    </div>
  );
}
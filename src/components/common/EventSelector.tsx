import React, { useEffect, useState, useCallback } from 'react';
import { useSupabase } from '../../lib/supabaseClient';
import { useStore } from '../../store';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';

interface EventDay {
  id: string;
  event_id: string;
  date: string;
  open_time?: string | null;
  close_time?: string | null;
}

interface Event {
  id: string;
  name: string;
  days: EventDay[];
}

export const EventSelector: React.FC = () => {
  const { supabase } = useSupabase();
  const { currentEvent, setCurrentEvent } = useStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      // Fetch events and event days separately
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*');

      if (eventsError) throw eventsError;

      const { data: eventDaysData, error: eventDaysError } = await supabase
        .from('event_days')
        .select('*');

      if (eventDaysError) throw eventDaysError;

      // Process event days data to ensure proper type conversion
      const processedEventDays = eventDaysData?.map((day: any) => ({
        id: String(day.id),
        event_id: String(day.event_id),
        date: String(day.date),
        open_time: day.open_time ? String(day.open_time) : null,
        close_time: day.close_time ? String(day.close_time) : null
      }));

      // Combine events with their processed days
      const eventsWithDays = eventsData?.map((event: any) => ({
        id: String(event.id),
        name: String(event.name),
        days: processedEventDays?.filter((day: EventDay) => day.event_id === event.id) || []
      })) || [];

      setEvents(eventsWithDays);

      // If there's no current event selected but we have events, select the first one
      // Use JSON parse/stringify to create a clean copy of the object
      if (!currentEvent && eventsWithDays.length > 0) {
        setCurrentEvent(JSON.parse(JSON.stringify(eventsWithDays[0])));
      } else if (eventsWithDays.length === 0) {
        // If no events exist, ensure currentEvent is null
        setCurrentEvent(null);
      }
    } catch (error: any) {
      console.error('Error fetching events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentEvent, setCurrentEvent]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading) {
    return <div className="animate-pulse h-10 w-64 bg-gray-200 dark:bg-dark-700 rounded-md"></div>;
  }

  if (error) {
    return (
      <Alert variant="error">
        Failed to load events: {error}
      </Alert>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No events created - Operating in global mode
      </div>
    );
  }

  return (
    <Select
      value={currentEvent?.id || ''}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEvent = events.find(event => event.id === e.target.value);
        // Create a clean copy of the selected event to prevent object conversion issues
        setCurrentEvent(selectedEvent ? JSON.parse(JSON.stringify(selectedEvent)) : null);
      }}
      options={[
        { value: '', label: 'Select an event...' },
        ...events.map(event => ({
          value: event.id,
          label: event.name
        }))
      ]}
      className="w-64"
    />
  );
};
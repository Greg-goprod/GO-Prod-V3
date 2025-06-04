import { useStore } from '../store';

export const useEventFilter = () => {
  const { currentEvent } = useStore();

  const getEventFilter = () => {
    if (!currentEvent) {
      return {};
    }
    return { event_id: currentEvent.id };
  };

  return { getEventFilter };
};
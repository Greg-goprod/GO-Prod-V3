import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2, Plane, Train, Car, Truck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Travel {
  id: string;
  personType: 'ARTIST' | 'CONTACT';
  personId: string;
  isArrival: boolean;
  travelType: string;
  scheduledDatetime: string;
  actualDatetime?: string;
  notes?: string;
  details?: {
    referenceNumber: string;
    departureLocation: string;
    arrivalLocation: string;
  };
  person: {
    name: string;
    type: string;
  };
}

interface TravelListProps {
  travels: Travel[];
  onEdit: (travel: Travel) => void;
  onDelete: (id: string) => void;
}

const TravelIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'PLANE':
      return <Plane size={16} />;
    case 'TRAIN':
      return <Train size={16} />;
    case 'CAR':
      return <Car size={16} />;
    default:
      return <Truck size={16} />;
  }
};

export const TravelList: React.FC<TravelListProps> = ({
  travels,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {travels.map((travel) => (
        <div
          key={travel.id}
          className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={travel.isArrival ? 'success' : 'warning'}>
                  {travel.isArrival ? 'Arrival' : 'Departure'}
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <TravelIcon type={travel.travelType} />
                  <span>{travel.travelType.replace('_', ' ')}</span>
                </Badge>
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {travel.person.name}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  ({travel.person.type})
                </span>
              </h3>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div>
                  Scheduled: {format(new Date(travel.scheduledDatetime), 'PPp', { locale: fr })}
                </div>
                {travel.actualDatetime && (
                  <div>
                    Actual: {format(new Date(travel.actualDatetime), 'PPp', { locale: fr })}
                  </div>
                )}
              </div>

              {travel.details && (
                <div className="mt-2 text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {travel.details.referenceNumber}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {travel.details.departureLocation} → {travel.details.arrivalLocation}
                  </div>
                </div>
              )}

              {travel.notes && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {travel.notes}
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(travel)}
                icon={<Edit size={16} />}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(travel.id)}
                icon={<Trash2 size={16} />}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
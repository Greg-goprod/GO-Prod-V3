import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2, Clock, UserCheck } from 'lucide-react';
import { Shift } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface ShiftGridProps {
  shifts: Shift[];
  getDriverName: (shiftId: string) => string[];
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
}

const getColorClass = (color?: string) => {
  switch (color) {
    case 'primary':
      return 'border-l-4 border-l-primary-500';
    case 'secondary':
      return 'border-l-4 border-l-secondary-500';
    case 'accent':
      return 'border-l-4 border-l-accent-500';
    case 'success':
      return 'border-l-4 border-l-success-500';
    case 'warning':
      return 'border-l-4 border-l-warning-500';
    case 'error':
      return 'border-l-4 border-l-error-500';
    default:
      return 'border-l-4 border-l-gray-500';
  }
};

const ShiftGrid: React.FC<ShiftGridProps> = ({
  shifts,
  getDriverName,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shifts.map((shift) => (
        <Card
          key={shift.id}
          className={`${getColorClass(shift.color)} overflow-hidden`}
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {shift.name || 'Untitled Shift'}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={16} className="mr-1" />
                  <span>
                    {format(new Date(shift.startDateTime), 'PPp', { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={16} className="mr-1" />
                  <span>
                    {format(new Date(shift.endDateTime), 'PPp', { locale: fr })}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(shift)}
                  icon={<Edit size={16} />}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(shift.id)}
                  icon={<Trash2 size={16} />}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <UserCheck size={16} className="text-gray-500 dark:text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {getDriverName(shift.id).map((name, index) => (
                    <Badge key={index} variant="secondary">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ShiftGrid;
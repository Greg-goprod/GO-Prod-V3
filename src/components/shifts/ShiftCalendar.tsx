import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Shift } from '../../types';
import { Button } from '../ui/Button';
import { Edit, Trash2 } from 'lucide-react';

interface ShiftCalendarProps {
  shifts: Shift[];
  getDriverName: (shiftId: string) => string[];
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

// Fixed dimensions
const HOUR_LABEL_WIDTH = 100;
const ROW_HEIGHT = 80;
const HOUR_WIDTH = 65; // Fixed width for each hour column
const TOTAL_WIDTH = HOUR_LABEL_WIDTH + (HOUR_WIDTH * 24);

export const ShiftCalendar: React.FC<ShiftCalendarProps> = ({
  shifts,
  getDriverName,
  onEdit,
  onDelete
}) => {
  const getShiftStyle = (shift: Shift) => {
    const startDate = new Date(shift.startDateTime);
    const endDate = new Date(shift.endDateTime);
    const day = format(startDate, 'EEEE', { locale: fr }).toLowerCase();
    const dayIndex = DAYS.indexOf(day);

    const startHour = startDate.getHours() + (startDate.getMinutes() / 60);
    const endHour = endDate.getHours() + (endDate.getMinutes() / 60);
    
    const left = HOUR_LABEL_WIDTH + (startHour * HOUR_WIDTH);
    const width = (endHour - startHour) * HOUR_WIDTH;
    const top = (dayIndex * ROW_HEIGHT) + 40; // 40px for header

    const colorClasses = {
      primary: 'bg-primary-100 border-primary-500 text-primary-900 dark:text-gray-200',
      secondary: 'bg-secondary-100 border-secondary-500 text-secondary-900 dark:text-gray-200',
      accent: 'bg-accent-100 border-accent-500 text-accent-900 dark:text-gray-200',
      success: 'bg-success-100 border-success-500 text-success-900 dark:text-gray-200',
      warning: 'bg-warning-100 border-warning-500 text-warning-900 dark:text-gray-200',
      error: 'bg-error-100 border-error-500 text-error-900 dark:text-gray-200'
    };

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${ROW_HEIGHT - 1}px`, // -1 for border
      className: `absolute ${colorClasses[shift.color || 'primary']} border rounded-md shadow-sm p-1 overflow-hidden`
    };
  };

  return (
    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-dark-800">
      <div style={{ width: `${TOTAL_WIDTH}px` }}>
        {/* Header row with hours */}
        <div className="flex border-b" style={{ height: '40px' }}>
          <div style={{ width: `${HOUR_LABEL_WIDTH}px` }} className="shrink-0 px-2 py-3 font-medium bg-gray-50 dark:bg-dark-700">
            Jour
          </div>
          <div className="flex flex-1">
            {HOURS.map((hour) => (
              <div 
                key={hour}
                className="flex border-l-2 border-gray-300 dark:border-dark-600"
                style={{ width: `${HOUR_WIDTH}px` }}
              >
                <div className="w-full text-center py-3 font-medium bg-gray-50 dark:bg-dark-700">
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="relative">
          {/* Background grid */}
          {DAYS.map((day, dayIndex) => (
            <div 
              key={day} 
              className="flex border-b last:border-b-0"
              style={{ height: `${ROW_HEIGHT}px` }}
            >
              <div 
                style={{ width: `${HOUR_LABEL_WIDTH}px` }}
                className="shrink-0 px-2 py-4 font-medium bg-gray-50 dark:bg-dark-700"
              >
                {day}
              </div>
              <div className="flex flex-1">
                {HOURS.map((hour) => (
                  <div
                    key={`${day}-${hour}`}
                    className="border-l-2 border-gray-300 dark:border-dark-600"
                    style={{ width: `${HOUR_WIDTH}px`, height: `${ROW_HEIGHT}px` }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Shifts */}
          {shifts.map((shift) => {
            const style = getShiftStyle(shift);
            const drivers = getDriverName(shift.id);

            return (
              <div
                key={shift.id}
                style={{
                  left: style.left,
                  top: style.top,
                  width: style.width,
                  height: style.height,
                }}
                className={style.className}
              >
                <div className="flex justify-between items-start h-full">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{shift.name}</div>
                    <div className="text-xs truncate">{drivers.join(', ')}</div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(shift)}
                      icon={<Edit size={14} />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(shift.id)}
                      icon={<Trash2 size={14} />}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
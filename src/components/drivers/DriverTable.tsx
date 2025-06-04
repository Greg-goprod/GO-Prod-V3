import React from 'react';
import { Edit, Trash2, UserCheck } from 'lucide-react';
import { Driver } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface DriverTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-dark-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
        <thead className="bg-gray-50 dark:bg-dark-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Driver
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Languages
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Permits
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
          {drivers.map((driver) => (
            <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-700">
                    <UserCheck size={16} />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {driver.firstName} {driver.lastName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      Since {driver.hiredSince} • {driver.tShirtSize}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-300">{driver.email}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{driver.phone}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  {driver.city}, {driver.postalCode}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {driver.languages.map((language) => (
                    <Badge key={language} variant="secondary" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {driver.permits.map((permit) => (
                    <Badge key={permit} variant="default" className="text-xs">
                      {permit}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(driver)}
                    icon={<Edit size={16} />}
                    aria-label="Edit"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(driver.id)}
                    icon={<Trash2 size={16} />}
                    aria-label="Delete"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
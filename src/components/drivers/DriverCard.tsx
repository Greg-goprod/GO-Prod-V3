import React, { useState } from 'react';
import { Mail, Phone, UserCheck, Edit, Trash2 } from 'lucide-react';
import { Driver } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useTranslation } from 'react-i18next';

interface DriverCardProps {
  driver: Driver;
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePhoneClick = () => {
    window.open(`https://wa.me/${driver.phone.replace(/\D/g, '')}`, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${driver.email}`;
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(driver.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Card className="h-24">
        <div className="flex h-full">
          <div className="p-2">
            <div className="w-[75px] h-[75px] rounded-full overflow-hidden bg-secondary-100">
              {driver.photoUrl ? (
                <img
                  src={driver.photoUrl}
                  alt={`${driver.firstName} ${driver.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/75';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-secondary-700">
                  <UserCheck size={32} />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between flex-1 py-2 pr-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {driver.firstName} {driver.lastName}
                </h3>
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Phone size={14} className="mr-1" />
                  {driver.phone}
                </button>
                <button
                  onClick={handleEmailClick}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Mail size={14} className="mr-1" />
                  {driver.email}
                </button>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(driver)}
                  icon={<Edit size={16} />}
                  aria-label={t('common.edit')}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  icon={<Trash2 size={16} />}
                  aria-label={t('common.delete')}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t('drivers.deleteTitle')}
      >
        <div className="space-y-4">
          <p className="text-gray-900 dark:text-gray-300">
            {t('drivers.deleteConfirm')} {driver.firstName} {driver.lastName}? {t('drivers.deleteMessage')}
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
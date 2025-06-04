import React, { useState } from 'react';
import { Edit, Trash2, User } from 'lucide-react';
import { Contact } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useTranslation } from 'react-i18next';

interface ContactTableProps {
  contacts: Contact[];
  getArtistName: (artistId?: string) => string | undefined;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  getArtistName,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      onDelete(contactToDelete.id);
      setShowDeleteConfirm(false);
      setContactToDelete(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-dark-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Function
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Artist
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      <User size={16} />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contact.firstName} {contact.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{contact.function}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">{contact.email}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{contact.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contact.artistId ? (
                    <Badge variant="primary">
                      {getArtistName(contact.artistId)}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-300">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(contact)}
                      icon={<Edit size={16} />}
                      aria-label={t('common.edit')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(contact)}
                      icon={<Trash2 size={16} />}
                      aria-label={t('common.delete')}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t('contacts.deleteTitle')}
      >
        <div className="space-y-4">
          <p className="text-gray-900 dark:text-gray-300">
            {t('contacts.deleteConfirm')} {contactToDelete?.firstName} {contactToDelete?.lastName}? {t('contacts.deleteMessage')}
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
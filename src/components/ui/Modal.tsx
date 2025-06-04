import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div
        ref={modalRef}
        className={`bg-white dark:bg-dark-800 rounded-lg shadow-xl overflow-hidden w-full mx-4 animate-slideUp ${sizeClasses[size]}`}
      >
        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-1"
            aria-label="Close"
          >
            <X size={16} />
          </Button>
        </div>
        <div className="px-3 py-2">{children}</div>
        {footer && (
          <div className="px-3 py-2 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">{footer}</div>
        )}
      </div>
    </div>
  );
};
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';
import { effects } from '../../lib/design-tokens';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  preventOutsideClose?: boolean;
  preventEscapeClose?: boolean;
  hideCloseButton?: boolean;
}

/**
 * Composant Modal standardisé
 * Alternative au Dialog, avec une API plus simple
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  preventOutsideClose = false,
  preventEscapeClose = false,
  hideCloseButton = false,
  className,
  ...props
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Gestion des événements clavier et clic
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventEscapeClose) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && 
          !modalRef.current.contains(e.target as Node) && 
          !preventOutsideClose) {
        onClose();
      }
    };

    // Verrouiller le scroll du body quand la modal est ouverte
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
  }, [isOpen, onClose, preventEscapeClose, preventOutsideClose]);

  if (!isOpen) return null;

  // Classes de taille pour la modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0"
      aria-modal="true" 
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={cn(
          // Base styles
          'bg-white dark:bg-dark-800 rounded-lg overflow-hidden w-full mx-4',
          'animate-in zoom-in-95 slide-in-from-bottom-4',
          'flex flex-col',
          effects.boxShadow.lg,
          
          // Size classes
          sizeClasses[size],
          
          // Custom classes
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-dark-700">
          <h3 
            id="modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h3>
          
          {!hideCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-1 h-auto"
              aria-label="Fermer"
            >
              <X size={18} />
            </Button>
          )}
        </div>
        
        {/* Content */}
        <div className="px-4 py-4 overflow-auto flex-1">{children}</div>
        
        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-850">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { effects } from '../../lib/design-tokens';

export interface FormAccordionSection {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface FormAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: FormAccordionSection[];
  defaultSection?: string;
  collapsible?: boolean;
  multiple?: boolean;
}

/**
 * Composant FormAccordion standardisé
 * Utilisé pour organiser les formulaires en sections dépliables
 */
export const FormAccordion = ({
  sections,
  defaultSection,
  collapsible = true,
  multiple = false,
  className,
  ...props
}: FormAccordionProps) => {
  const [openSections, setOpenSections] = useState<string[]>(
    defaultSection 
      ? [defaultSection] 
      : sections.length > 0 && !collapsible 
        ? [sections[0].id] 
        : []
  );

  const toggleSection = (sectionId: string) => {
    if (openSections.includes(sectionId)) {
      // Si collapsible est false et c'est la seule section ouverte, ne pas la fermer
      if (!collapsible && openSections.length === 1) {
        return;
      }
      setOpenSections(openSections.filter(id => id !== sectionId));
    } else {
      if (multiple) {
        setOpenSections([...openSections, sectionId]);
      } else {
        setOpenSections([sectionId]);
      }
    }
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {sections.map((section) => (
        <div 
          key={section.id} 
          className={cn(
            "border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden",
            "bg-white dark:bg-dark-800",
            effects.boxShadow.sm,
            section.disabled && "opacity-60 cursor-not-allowed"
          )}
        >
          <button
            type="button"
            onClick={() => !section.disabled && toggleSection(section.id)}
            className={cn(
              "flex items-center justify-between w-full px-4 py-3 text-left",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset",
              !section.disabled && "hover:bg-gray-50 dark:hover:bg-dark-750"
            )}
            disabled={section.disabled}
            aria-expanded={openSections.includes(section.id)}
            aria-controls={`content-${section.id}`}
          >
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {section.title}
              </h3>
              {section.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {section.description}
                </p>
              )}
            </div>
            <ChevronDown 
              className={cn(
                "h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0",
                "transition-transform duration-200",
                openSections.includes(section.id) && "transform rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
          
          <div
            id={`content-${section.id}`}
            className={cn(
              "transition-all duration-200 overflow-hidden",
              !openSections.includes(section.id) && "hidden"
            )}
          >
            <div className="px-4 py-4 border-t border-gray-200 dark:border-dark-700">
              <div className="grid grid-cols-12 gap-4">
                {section.children}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
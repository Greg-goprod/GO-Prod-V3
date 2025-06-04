import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FormAccordionProps {
  sections: {
    id: string;
    title: string;
    description?: string;
    children: React.ReactNode;
  }[];
  defaultSection?: string;
}

export const FormAccordion: React.FC<FormAccordionProps> = ({
  sections,
  defaultSection
}) => {
  const [openSections, setOpenSections] = useState<string[]>(
    defaultSection ? [defaultSection] : sections.length > 0 ? [sections[0].id] : []
  );

  const toggleSection = (sectionId: string) => {
    if (openSections.includes(sectionId)) {
      setOpenSections(openSections.filter(id => id !== sectionId));
    } else {
      setOpenSections([...openSections, sectionId]);
    }
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="border rounded-lg overflow-hidden bg-white dark:bg-dark-800 shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection(section.id)}
            className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {section.title.toUpperCase()}
              </h3>
            </div>
            <ChevronDown 
              className={cn(
                "h-5 w-5 text-gray-500 transition-transform duration-200",
                openSections.includes(section.id) && "transform rotate-180"
              )}
            />
          </button>
          {openSections.includes(section.id) && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-700">
              <div className="grid grid-cols-12 gap-4">
                {section.children}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
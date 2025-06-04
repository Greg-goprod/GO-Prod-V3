import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Clock, Wrench, Building, Coffee, Navigation, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductionPage: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Timetable',
      description: 'Planning des performances',
      icon: Clock,
      path: '/timetable'
    },
    {
      title: 'Technique',
      description: 'Gestion technique',
      icon: Wrench,
      path: '/technique'
    },
    {
      title: 'Ground',
      description: 'Gestion du ground',
      icon: Building,
      path: '/ground'
    },
    {
      title: 'Hospitality',
      description: 'Gestion de l\'hospitality',
      icon: Coffee,
      path: '/hospitality'
    },
    {
      title: 'Voyages',
      description: 'Gestion des voyages',
      icon: Navigation,
      path: '/travels'
    },
    {
      title: 'Party Crew',
      description: 'Gestion du party crew',
      icon: PartyPopper,
      path: '/partycrew'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="PRODUCTION"
        description="Gestion de la production"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.path}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(section.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {section.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
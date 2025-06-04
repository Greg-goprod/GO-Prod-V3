import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { BookOpen, FileText, DollarSign, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdministrationPage: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Booking',
      description: 'Gestion des réservations',
      icon: BookOpen,
      path: '/booking'
    },
    {
      title: 'Contrats',
      description: 'Gestion des contrats',
      icon: FileText,
      path: '/contracts'
    },
    {
      title: 'Finances',
      description: 'Gestion financière',
      icon: DollarSign,
      path: '/finances'
    },
    {
      title: 'Ventes',
      description: 'Gestion des ventes',
      icon: ShoppingCart,
      path: '/sales'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="ADMINISTRATION"
        description="Gestion administrative"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
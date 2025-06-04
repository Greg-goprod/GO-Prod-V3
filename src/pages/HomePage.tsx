import React from 'react';
import { useStore } from '../store';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const HomePage: React.FC = () => {
  const { currentEvent } = useStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentEvent ? currentEvent.name : "Tableau de bord"}
        description={currentEvent ? "Vue d'ensemble de l'événement" : "Mode global - Toutes les données sont visibles"}
      />
      
      {currentEvent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Dates</h3>
              <div className="space-y-2">
                {currentEvent.days?.map((day: any) => (
                  <div key={day.id} className="flex justify-between items-center">
                    <span>{format(new Date(day.date), 'EEEE d MMMM yyyy', { locale: fr })}</span>
                    <span className="text-gray-500">
                      {day.open_time && day.close_time ? (
                        `${day.open_time} - ${day.close_time}`
                      ) : 'Horaires à définir'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add more dashboard cards here */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Mode Global</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aucun événement n'a encore été créé. L'application fonctionne en mode global, affichant toutes les données sans filtre d'événement.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
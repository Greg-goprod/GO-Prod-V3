import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Offer {
  id: string;
  artistName: string;
  eventName: string;
  stage: string;
  status: 'a_faire' | 'envoyee' | 'validee' | 'refusee';
  performanceDate: string;
}

export const OfferKanban: React.FC = () => {
  const columns = [
    { id: 'a_faire', title: 'To Do', color: 'bg-gray-100' },
    { id: 'envoyee', title: 'Sent', color: 'bg-blue-50' },
    { id: 'validee', title: 'Validated', color: 'bg-green-50' },
    { id: 'refusee', title: 'Refused', color: 'bg-red-50' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {columns.map(column => (
        <div key={column.id} className={`${column.color} p-4 rounded-lg`}>
          <h3 className="font-semibold mb-4">{column.title}</h3>
          <div className="space-y-3">
            {/* Placeholder for DnD implementation */}
            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Artist Name</h4>
                  <Badge variant="outline">Main Stage</Badge>
                </div>
                <p className="text-sm text-gray-600">Event Name</p>
                <p className="text-xs text-gray-500 mt-2">July 15, 2025</p>
              </div>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Données fictives pour l'exemple
const artistData = {
  id: 1,
  name: "Artiste Exemple",
  status: "Confirmé",
  technicalRider: "https://example.com/rider.pdf",
  hospitalityRider: "https://example.com/hospitality.pdf",
  technicalNeeds: [
    { id: 1, category: "Sonorisation", item: "Console numérique 32 voies", quantity: 1, notes: "Préférence pour Midas M32" },
    { id: 2, category: "Sonorisation", item: "Microphone SM58", quantity: 4, notes: "" },
    { id: 3, category: "Sonorisation", item: "Microphone SM57", quantity: 3, notes: "" },
    { id: 4, category: "Lumière", item: "Lyre Wash LED", quantity: 8, notes: "Minimum 4 circuits DMX" },
    { id: 5, category: "Scène", item: "Praticable 2x1m", quantity: 4, notes: "Hauteur 40cm" },
  ],
  hospitalityNeeds: [
    { id: 1, category: "Catering", item: "Repas chauds", quantity: 6, notes: "Dont 1 végétarien" },
    { id: 2, category: "Catering", item: "Eau minérale", quantity: 12, notes: "Bouteilles de 50cl" },
    { id: 3, category: "Catering", item: "Bières locales", quantity: 12, notes: "" },
    { id: 4, category: "Logement", item: "Chambre single", quantity: 2, notes: "" },
    { id: 5, category: "Logement", item: "Chambre twin", quantity: 2, notes: "" },
    { id: 6, category: "Transport", item: "Navette aéroport", quantity: 1, notes: "Pour 6 personnes" },
  ]
};

interface Need {
  id: number;
  category: string;
  item: string;
  quantity: number;
  notes: string;
}

const RiderCategory: React.FC<{
  title: string;
  needs: Need[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isEditable?: boolean;
}> = ({ title, needs, onEdit, onDelete, isEditable = false }) => {
  // Grouper les besoins par catégorie
  const groupedNeeds = needs.reduce((acc, need) => {
    acc[need.category] = acc[need.category] || [];
    acc[need.category].push(need);
    return acc;
  }, {} as Record<string, Need[]>);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      
      {Object.keys(groupedNeeds).length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucun élément dans cette catégorie</p>
      ) : (
        Object.entries(groupedNeeds).map(([category, categoryNeeds]) => (
          <div key={category} className="mb-6 last:mb-0">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">{category}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantité</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                    {isEditable && (
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {categoryNeeds.map((need) => (
                    <tr key={need.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{need.item}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{need.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{need.notes}</td>
                      {isEditable && (
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => onEdit?.(need.id)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => onDelete?.(need.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Supprimer
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const ArtistRidersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(artistData);
  const [activeTab, setActiveTab] = useState<'technical' | 'hospitality'>('technical');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulation de chargement des données
  useEffect(() => {
    setLoading(true);
    // Dans un cas réel, vous feriez un appel API ici
    setTimeout(() => {
      // Pour simuler un chargement asynchrone
      setArtist(artistData);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-700 dark:text-red-300 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(`/artists/${id}`)}
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Riders de {artist.name}</h1>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Rider Technique</h3>
            <a 
              href={artist.technicalRider} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le PDF
            </a>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Rider Hospitalité</h3>
            <a 
              href={artist.hospitalityRider} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le PDF
            </a>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'technical'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('technical')}
          >
            Besoins Techniques
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'hospitality'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('hospitality')}
          >
            Besoins Hospitalité
          </button>
        </div>
      </div>
      
      {activeTab === 'technical' ? (
        <RiderCategory 
          title="Besoins techniques" 
          needs={artist.technicalNeeds} 
        />
      ) : (
        <RiderCategory 
          title="Besoins d'hospitalité" 
          needs={artist.hospitalityNeeds} 
        />
      )}
    </div>
  );
};

export default ArtistRidersPage; 
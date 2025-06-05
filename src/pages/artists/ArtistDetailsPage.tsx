import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Données fictives pour l'exemple
const artistData = {
  id: 1,
  name: "Artiste Exemple",
  genre: "Rock",
  origin: "France",
  status: "Confirmé",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor pharetra magna, vitae porttitor ipsum rutrum ut.",
  contactPerson: "John Doe",
  contactEmail: "john.doe@example.com",
  contactPhone: "+33 6 12 34 56 78",
  socialLinks: {
    website: "https://example.com",
    instagram: "https://instagram.com/example",
    facebook: "https://facebook.com/example",
    twitter: "https://twitter.com/example"
  },
  technicalRider: "https://example.com/rider.pdf",
  hospitalityRider: "https://example.com/hospitality.pdf",
  fee: "10000 €",
  members: [
    { name: "Membre 1", role: "Chant" },
    { name: "Membre 2", role: "Guitare" },
    { name: "Membre 3", role: "Basse" },
    { name: "Membre 4", role: "Batterie" }
  ]
};

const ArtistDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(artistData);
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
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{artist.name}</h1>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/artists/${id}/edit`}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Modifier
          </Link>
          <Link
            to={`/artists/${id}/riders`}
            className="px-4 py-2 bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Riders
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne d'informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-400 dark:text-gray-500">{artist.name.charAt(0)}</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{artist.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{artist.genre} · {artist.origin}</p>
                </div>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full self-start ${
                  artist.status === 'Confirmé' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-20 dark:text-green-400' 
                    : artist.status === 'En négociation'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-20 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-20 dark:text-red-400'
                }`}>
                  {artist.status}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{artist.description}</p>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-3">Membres</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {artist.members.map((member, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 dark:bg-opacity-50 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Colonne d'informations complémentaires */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Personne à contacter</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{artist.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{artist.contactEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{artist.contactPhone}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Liens</h3>
            <div className="space-y-3">
              {Object.entries(artist.socialLinks).map(([platform, url], index) => (
                <a 
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <span className="capitalize">{platform}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informations</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cachet</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{artist.fee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Riders techniques</p>
                <a 
                  href={artist.technicalRider}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Télécharger
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Riders hospitalité</p>
                <a 
                  href={artist.hospitalityRider}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Télécharger
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export par défaut
export default ArtistDetailsPage;

// Export nommé pour la compatibilité
export { ArtistDetailsPage }; 
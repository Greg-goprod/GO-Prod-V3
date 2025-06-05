import React from 'react';

/**
 * Page principale pour la gestion de l'hospitalité
 */
const HospitalityPage: React.FC = () => {
  return (
    <div className="hospitality-page">
      <h1>Hospitalité</h1>
      <p>Cette page permet de gérer tous les aspects liés à l'hospitalité des artistes et invités.</p>
      
      <div className="hospitality-dashboard">
        {/* Contenu à venir */}
      </div>
    </div>
  );
};

// Export par défaut
export default HospitalityPage;

// Export nommé pour la compatibilité
export { HospitalityPage }; 
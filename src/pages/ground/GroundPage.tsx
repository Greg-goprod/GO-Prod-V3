import React from 'react';

/**
 * Page principale pour la gestion du terrain et des infrastructures
 */
const GroundPage: React.FC = () => {
  return (
    <div className="ground-page">
      <h1>Gestion du terrain</h1>
      <p>Cette page permet de gérer tous les aspects liés au terrain et aux infrastructures.</p>
      
      <div className="ground-dashboard">
        {/* Contenu à venir */}
      </div>
    </div>
  );
};

// Export par défaut
export default GroundPage;

// Export nommé pour la compatibilité
export { GroundPage }; 
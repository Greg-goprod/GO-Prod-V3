import React from 'react';

/**
 * Page principale pour la gestion de la production
 */
const ProductionPage: React.FC = () => {
  return (
    <div className="production-page">
      <h1>Production</h1>
      <p>Cette page permet de gérer tous les aspects liés à la production de l'événement.</p>
      
      <div className="production-dashboard">
        {/* Contenu à venir */}
      </div>
    </div>
  );
};

// Export par défaut
export default ProductionPage;

// Export nommé pour la compatibilité
export { ProductionPage }; 
import React from 'react';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { useStore } from '../../store';

/**
 * Page de paramètres de l'application
 */
const SettingsPage: React.FC = () => {
  const isDarkMode = useStore(state => state.isDarkMode);
  const toggleDarkMode = useStore(state => state.toggleDarkMode);

  return (
    <div className="settings-container">
      <h1>Paramètres</h1>
      <p>Gérez les paramètres de l'application et vos préférences personnelles.</p>
      
      <div className="settings-sections">
        <div className="settings-section">
          <h2>Préférences utilisateur</h2>
          <div className="settings-card">
            <h3>Apparence</h3>
            <p>Personnalisez l'apparence de l'application</p>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Paramètres du compte</h2>
          <div className="settings-card">
            <h3>Profil</h3>
            <p>Modifiez vos informations personnelles</p>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Personnalisation</h2>
          <div className="settings-card">
            <h3>Notifications</h3>
            <p>Gérez vos préférences de notification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export par défaut
export default SettingsPage;

// Export nommé pour la compatibilité
export { SettingsPage }; 
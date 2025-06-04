/// <reference types="cypress" />

describe('Navigation', () => {
  beforeEach(() => {
    // Supposons que nous avons une commande personnalisée pour se connecter
    // Si ce n'est pas le cas, décommentez le code suivant et supprimez cy.login()
    // cy.visit('/login');
    // cy.get('input[type="email"]').type(Cypress.env('testUser').email);
    // cy.get('input[type="password"]').type(Cypress.env('testUser').password);
    // cy.get('button[type="submit"]').click();
    
    // Utiliser notre commande personnalisée
    cy.visit('/');
    // cy.login(); // Décommentez si la commande personnalisée est disponible
  });

  it('navigue correctement vers les artistes', () => {
    cy.contains('Artistes').click();
    cy.url().should('include', '/artists');
    cy.get('h1').should('contain', 'Artistes');
  });

  it('navigue correctement vers la production', () => {
    cy.contains('Production').click();
    cy.url().should('include', '/production');
    cy.get('h1').should('contain', 'Production');
  });

  it('navigue correctement vers le planning', () => {
    cy.contains('Planning').click();
    cy.url().should('include', '/timetable');
    cy.get('h1').should('contain', 'Planning');
  });

  it('peut basculer entre les vues liste et grille', () => {
    cy.visit('/artists');
    
    // Vérifier l'existence du bouton de changement de vue
    cy.get('button[aria-label="Vue en liste"]').should('exist');
    cy.get('button[aria-label="Vue en grille"]').should('exist');
    
    // Basculer vers la vue liste
    cy.get('button[aria-label="Vue en liste"]').click();
    cy.get('.artists-list-view').should('exist');
    
    // Basculer vers la vue grille
    cy.get('button[aria-label="Vue en grille"]').click();
    cy.get('.artists-grid-view').should('exist');
  });

  it('affiche correctement le menu utilisateur', () => {
    // Cliquer sur l'avatar utilisateur
    cy.get('button[aria-label="Menu utilisateur"]').click();
    
    // Vérifier que le menu s'affiche
    cy.get('[role="menu"]').should('be.visible');
    cy.contains('Profil').should('exist');
    cy.contains('Paramètres').should('exist');
    cy.contains('Se déconnecter').should('exist');
    
    // Fermer le menu en cliquant ailleurs
    cy.get('body').click(0, 0);
    cy.get('[role="menu"]').should('not.exist');
  });

  it('peut basculer entre le mode clair et sombre', () => {
    // Cliquer sur le bouton de changement de thème
    cy.get('button[aria-label="Changer de thème"]').click();
    
    // Vérifier que la classe 'dark' est appliquée au HTML
    cy.get('html').should('have.class', 'dark');
    
    // Cliquer à nouveau pour revenir au mode clair
    cy.get('button[aria-label="Changer de thème"]').click();
    cy.get('html').should('not.have.class', 'dark');
  });
}); 
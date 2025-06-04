/// <reference types="cypress" />

// Commande pour se connecter
Cypress.Commands.add('login', (email = Cypress.env('testUser').email, password = Cypress.env('testUser').password) => {
  cy.visit('/login');
  cy.findByLabelText(/adresse e-mail/i).type(email);
  cy.findByLabelText(/mot de passe/i).type(password);
  cy.findByRole('button', { name: /se connecter/i }).click();
  cy.url().should('not.include', '/login');
});

// Commande pour se déconnecter
Cypress.Commands.add('logout', () => {
  cy.findByRole('button', { name: /profil/i }).click();
  cy.findByRole('menuitem', { name: /se déconnecter/i }).click();
  cy.url().should('include', '/login');
});

// Commande pour vérifier l'état de la sidebar
Cypress.Commands.add('checkSidebarItem', (name, isActive = false) => {
  cy.findByRole('navigation')
    .findByText(name)
    .parent()
    .should(isActive ? 'have.class' : 'not.have.class', 'bg-primary-100');
});

// Commande pour naviguer dans la sidebar
Cypress.Commands.add('navigateTo', (section) => {
  cy.findByRole('navigation')
    .findByText(section)
    .click();
  cy.url().should('include', section.toLowerCase().replace(/\s+/g, '-'));
});

// Commande pour attendre que les chargements soient terminés
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[aria-label="Chargement"]').should('not.exist');
});

// Commande pour basculer le thème sombre
Cypress.Commands.add('toggleDarkMode', () => {
  cy.findByRole('button', { name: /changer le thème/i }).click();
});

// Déclaration des types pour TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      checkSidebarItem(name: string, isActive?: boolean): Chainable<void>;
      navigateTo(section: string): Chainable<void>;
      waitForLoading(): Chainable<void>;
      toggleDarkMode(): Chainable<void>;
    }
  }
} 
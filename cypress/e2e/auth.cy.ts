describe('Authentification', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('affiche la page de connexion correctement', () => {
    cy.get('h2').contains('Connexion');
    cy.get('form').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('affiche une erreur avec des identifiants invalides', () => {
    cy.get('input[type="email"]').type('incorrect@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Attendre un peu pour que l'erreur apparaisse
    cy.wait(1000);
    
    // Vérifier que le message d'erreur s'affiche
    cy.get('div.bg-red-50').should('exist');
  });

  it('redirige vers la page d\'accueil après une connexion réussie', () => {
    // Note: Ce test nécessite un compte de test valide
    cy.get('input[type="email"]').type(Cypress.env('testUser').email);
    cy.get('input[type="password"]').type(Cypress.env('testUser').password);
    cy.get('button[type="submit"]').click();
    
    // Vérifier la redirection vers la page d'accueil
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('permet de naviguer vers la page d\'inscription', () => {
    cy.contains('créer un nouveau compte').click();
    cy.url().should('include', '/register');
  });

  it('permet de naviguer vers la page de réinitialisation de mot de passe', () => {
    cy.contains('Mot de passe oublié').click();
    cy.url().should('include', '/forgot-password');
  });
}); 
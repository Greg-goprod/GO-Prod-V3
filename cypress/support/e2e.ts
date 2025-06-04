// Import commands.js using ES2015 syntax:
import './commands';

// Import Testing Library commands
import '@testing-library/cypress/add-commands';

// Disable uncaught exception handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false prevents Cypress from failing the test
  return false;
});

// Preserve cookies between tests
beforeEach(() => {
  cy.session('user-session', () => {
    // Perform setup here if needed, like logging in
  });
});

// Custom console log handling
Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error').as('consoleError');
  cy.spy(win.console, 'warn').as('consoleWarn');
}); 
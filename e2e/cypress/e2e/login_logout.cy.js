describe('login', () => {
  it('logs out and requires authentication again', () => {
    cy.visit('/')
    cy.url().should('contain', 'login')

    cy.get('#email').type('user2@test.com');
    cy.get('#password').type('password123');
    cy.get('.apl-button-expanded').click();

    cy.contains('Willkommen!')

    cy.contains('button', 'Ausloggen').click();
    cy.location('pathname').should('eq', '/login');
    cy.get('#email').should('be.visible');

    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
    cy.get('#email').should('be.visible');
  })
})

describe('login', () => {
  it('passes', () => {
    cy.visit('/')
    cy.url().should('contain', 'login')

    cy.get('#email').type('user2@example.com');
    cy.get('#password').type('password123');
    cy.get('.apl-button-expanded').click();

    cy.contains('Willkommen!')

    cy.get('.apl-button-fixed').click();
  })
})
describe('login', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('contain', 'login')

    cy.get('#email').type('test@example.com');
    cy.get('#password').type('Password1!');
    cy.get('.apl-button-expanded').click();
    cy.get('.apl-button-fixed').click();
  })
})
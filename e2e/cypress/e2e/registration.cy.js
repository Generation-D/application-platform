describe('registration', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('contain', 'login')

    cy.contains('button', 'Registrieren').click()

    const password = 'Password1!'

    cy.get("#email").type("test@example.com")
    cy.get("#password").type(password)
    cy.get("#confirm-password").type(password)
    cy.get('#confirm-legal').check()

    cy.get('.apl-button-expanded').click()

    cy.contains('Wir haben dir eine Email geschickt!')
  })
})
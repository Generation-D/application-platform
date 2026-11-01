describe("registration", () => {
  it("passes", () => {
    cy.visit("/");
    cy.url().should("contain", "login");

    cy.contains("button", "Registrieren").click();

    const password = Cypress.expose("password");

    cy.get("#email").type("test@example.com");
    cy.get("#password").type(password);
    cy.get("#confirm-password").type(password);
    cy.get("#confirm-legal").check();

    cy.get(".apl-button-expanded").click();

    cy.contains("Wir haben dir eine Email geschickt!");
  });
});

import 'cypress-file-upload';

describe('template spec', () => {
  /* ==== Test Created with Cypress Studio ==== */
  it('fill_question_types', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('Password1!');
    cy.get('.apl-button-expanded').click();
    cy.get('.apl-button-fixed-short').click();
    cy.get('#ba337f5e-d6cf-451e-bb60-7b39da650f3a').type('Testuser');
    cy.get(':nth-child(2) > .mt-1 > .shadow').click();
    cy.get(':nth-child(2) > .mt-1 > .shadow').click();
    cy.get('#e43220b2-a3b4-4cdc-81be-bee848951ab0').check();
    cy.get('#\\39 d16a723-d58c-4a01-b8f9-fa4ca1c6bfaf').check();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('input[type="file"]#0af45c12-d6b2-43a6-b8cc-203c74942001').attachFile('files/file_example_PNG_1MB.png');
    cy.get(':nth-child(5) > :nth-child(2) > form > .mt-4 > .apl-button-fixed').click();
    cy.get(':nth-child(6) > :nth-child(2) > form > .mt-1 > div.w-full > .w-full').click();
    cy.get('input[type="file"]#f67d20ca-c91f-4bb0-aa10-fbf3f9ebd6fd').attachFile('files/file_example_PDF_1MB.pdf');
    cy.get(':nth-child(6) > :nth-child(2) > form > .mt-4 > .apl-button-fixed').click();
    cy.get(':nth-child(7) > :nth-child(2) > form > .mt-1 > div.w-full > .w-full > .flex').click();
    cy.get('input[type="file"]#4c272030-53aa-45c6-812a-92049b217733').attachFile('files/file_example_MP4_1280_10MG.mp4');
    cy.get('.mt-4 > .apl-button-fixed').click();
    cy.get('.items-start > :nth-child(4)').click();
    /* ==== End Cypress Studio ==== */
    cy.get('.bg-green-600').should('have.attr', 'style').and('include', 'width: 100%');
  });
})
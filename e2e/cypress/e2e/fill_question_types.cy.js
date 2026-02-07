import 'cypress-file-upload';

describe('template spec', () => {
  it('fill_question_types', function() {
    cy.visit('/login');
    cy.get('#email').type('user1@example.com');
    cy.get('#password').type('password123');
    cy.get('.apl-button-expanded').click();
    cy.get('.apl-button-fixed-short').click();
    
    // Fill short text question: "What is your name?"
    cy.contains('label', 'What is your name?')
      .next('div.mt-1')
      .find('input')
      .type('Testuser');
    
    // Fill long text question: "What is your mission?"
    cy.contains('label', 'What is your mission?')
      .next('div.mt-1')
      .find('textarea')
      .type('Test mission text');
    
    // Select multiple choice options: "Choose one to three options."
    cy.contains('label', 'Choose one to three options.')
      .next('div.mt-1')
      .within(() => {
        cy.contains('1. Keine Armut').click();
        cy.contains('2. Kein Hunger').click();
      });
    
    // Handle conditional question: "Chose either yes or no"
    cy.contains('label', 'Chose either yes or no')
      .next('div.mt-1')
      .within(() => {
        cy.contains('Nein').click();
      });
    
    // Upload image: "Upload an image (max. 2MB)"
    cy.contains('label', 'Upload an image (max. 2MB)')
      .next('div.mt-1')
      .find('form')
      .find('input[type="file"]')
      .attachFile('files/file_example_PNG_1MB.png');
    cy.get(':nth-child(5) > :nth-child(2) > form > .mt-4 > .apl-button-fixed').click();
    
    // Upload PDF: "Upload a pdf (max. 25MB)"
    cy.contains('label', 'Upload a pdf (max. 25MB)')
      .next('div.mt-1')
      .find('form')
      .find('input[type="file"]')
      .attachFile('files/file_example_PDF_1MB.pdf');
    cy.get(':nth-child(6) > :nth-child(2) > form > .mt-4 > .apl-button-fixed').click();
    
    // Upload video: "Uplaod a video (max. 50MB)"
    cy.contains('label', 'Uplaod a video (max. 50MB)')
      .next('div.mt-1')
      .find('form')
      .find('input[type="file"]')
      .attachFile('files/file_example_MP4_1280_10MB.mp4');
    cy.get('.mt-4 > .apl-button-fixed').click();
    
    cy.get('.items-start > :nth-child(4)').click();
    
    // Add debugging and wait for progress calculation
    cy.log('Checking progress bar state...');
    cy.get('.bg-green-600', { timeout: 10000 }).should('have.attr', 'style').and('include', 'width: 100%');
  });
})

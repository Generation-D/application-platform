import "cypress-file-upload";

function uploadFile(questionLabel, fixturePath) {
  cy.contains("label", questionLabel)
    .next("div.mt-1")
    .find("form")
    .within(() => {
      cy.get('input[type="file"]').attachFile(fixturePath);
      cy.get(".apl-button-fixed").click();
      cy.contains(".text-green-600", "war erfolgreich", { timeout: 30000 });
    });
}

describe("template spec", () => {
  it("fill_question_types", function () {
    cy.visit("/login");
    cy.get("#email").type("user1@test.com");
    cy.get("#password").type("password123");
    cy.get(".apl-button-expanded").click();
    cy.get(".apl-button-fixed-short").click();

    // Fill short text question: "What is your name?"
    cy.contains("label", "What is your name?")
      .next("div.mt-1")
      .find("input")
      .type("Testuser");

    // Fill long text question: "What is your mission?"
    cy.contains("label", "What is your mission?")
      .next("div.mt-1")
      .find("textarea")
      .type("Test mission text");

    // Select multiple choice options: "Choose one to three options."
    cy.contains("label", "Choose one to three options.")
      .next("div.mt-1")
      .within(() => {
        cy.contains("1. Keine Armut").click();
        cy.contains("2. Kein Hunger").click();
      });

    // Handle conditional question: "Chose either yes or no"
    cy.contains("label", "Chose either yes or no")
      .next("div.mt-1")
      .within(() => {
        cy.contains("Nein").click();
      });

    // Uploads are scoped to their own question and must report success, so a
    // failed upload (e.g. Supabase unreachable from the browser) fails here.
    uploadFile("Upload an image (max. 2MB)", "files/file_example_PNG_1MB.png");
    uploadFile("Upload a pdf (max. 25MB)", "files/file_example_PDF_1MB.pdf");
    uploadFile(
      "Uplaod a video (max. 50MB)",
      "files/file_example_MP4_1280_10MB.mp4",
    );

    cy.get(".items-start > :nth-child(4)").click();

    // Add debugging and wait for progress calculation
    cy.log("Checking progress bar state...");
    cy.get(".bg-green-600", { timeout: 10000 })
      .should("have.attr", "style")
      .and("include", "width: 100%");
  });
});

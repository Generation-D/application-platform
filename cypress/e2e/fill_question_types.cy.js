import "cypress-file-upload";

// Questions show a spinner while they load their saved answer, and reload when
// a conditional choice changes. Interacting before that finishes lets the late
// load overwrite the input, so every step waits for the form to be idle.
function waitUntilLoaded() {
  cy.get('[aria-label="Loading..."]').should("not.exist");
}

function question(questionLabel) {
  waitUntilLoaded();
  return cy.contains("label", questionLabel).next("div.mt-1");
}

function fillText(questionLabel, field, text) {
  question(questionLabel).find(field).type(text).blur();
}

function choose(questionLabel, optionText) {
  question(questionLabel).within(() => {
    cy.contains("label", optionText).click();
    cy.contains("label", optionText)
      .parent()
      .find("input")
      .should("be.checked");
  });
}

function uploadFile(questionLabel, fixturePath) {
  question(questionLabel)
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
    fillText("What is your name?", "input", "Testuser");

    // Fill long text question: "What is your mission?"
    fillText("What is your mission?", "textarea", "Test mission text");

    // Select multiple choice options: "Choose one to three options."
    choose("Choose one to three options.", "1. Keine Armut");
    choose("Choose one to three options.", "2. Kein Hunger");

    // Handle conditional question: "Chose either yes or no"
    choose("Chose either yes or no", "Nein");

    // Uploads are scoped to their own question and must report success, so a
    // failed upload (e.g. Supabase unreachable from the browser) fails here.
    uploadFile("Upload an image (max. 2MB)", "files/file_example_PNG_1MB.png");
    uploadFile("Upload a pdf (max. 25MB)", "files/file_example_PDF_1MB.pdf");
    uploadFile(
      "Uplaod a video (max. 50MB)",
      "files/file_example_MP4_1280_10MB.mp4",
    );

    waitUntilLoaded();
    cy.get(".items-start > :nth-child(4)").click();

    // Add debugging and wait for progress calculation
    cy.log("Checking progress bar state...");
    cy.get(".bg-green-600", { timeout: 10000 })
      .should("have.attr", "style")
      .and("include", "width: 100%");
  });
});

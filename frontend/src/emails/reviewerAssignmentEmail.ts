export interface ReviewerEmailApplication {
  teamName: string;
}

export interface ReviewerAssignmentEmailData {
  phaseLabel: string;
  confirmationDeadline: string;
  confirmationUrl: string;
  ratingDeadline: string;
  instructionsUrl: string;
  ratingUrl: string;
  reviewUrl: string;
  phaseNote: string;
  applications: ReviewerEmailApplication[];
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeHttpUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Nicht unterstützter Link: ${value}`);
  }
  return escapeHtml(url.toString());
}

export function createReviewerAssignmentEmail({
  phaseLabel,
  confirmationDeadline,
  confirmationUrl,
  ratingDeadline,
  instructionsUrl,
  ratingUrl,
  reviewUrl,
  phaseNote,
  applications,
}: ReviewerAssignmentEmailData) {
  const applicationItems = applications
    .sort((left, right) => left.teamName.localeCompare(right.teamName))
    .map((application) => `<li>${escapeHtml(application.teamName)}</li>`)
    .join("");

  return `
    <p>Hallo,</p>
    <p>danke, dass Du Generation-D bei der Bewertungsrunde <strong>${escapeHtml(phaseLabel)}</strong> unterstützt!</p>
    <p>Bitte bestätige den Erhalt dieser Nachricht bis <strong>${escapeHtml(confirmationDeadline)}</strong>:<br><a href="${safeHttpUrl(confirmationUrl)}">Empfang bestätigen</a></p>
    <p><strong>Anleitung:</strong><br><a href="${safeHttpUrl(instructionsUrl)}">${safeHttpUrl(instructionsUrl)}</a></p>
    <p><strong>Bewertungsformular:</strong><br><a href="${safeHttpUrl(ratingUrl)}">${safeHttpUrl(ratingUrl)}</a></p>
    <p><strong>Deine Bewerbungen im Portal:</strong><br><a href="${safeHttpUrl(reviewUrl)}">${safeHttpUrl(reviewUrl)}</a></p>
    <p>Bitte schließe Deine Bewertungen bis <strong>${escapeHtml(ratingDeadline)}</strong> ab.</p>
    <p><strong>Deine zu bewertenden Teams:</strong></p>
    <ul>${applicationItems}</ul>
    <p><strong>Hinweis für diese Phase:</strong><br>${escapeHtml(phaseNote)}</p>
    <p>Falls Du Fragen hast oder Probleme auftreten, melde Dich gerne jederzeit bei uns.</p>
    <p>Viele Grüße<br>Euer Generation-D Team</p>
  `;
}

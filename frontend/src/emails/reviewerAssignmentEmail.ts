export interface ReviewerEmailApplication {
  label: string;
  url: string;
}

export function createReviewerSubject(prefix: string, roundLabel: string) {
  const cleanPrefix = prefix.trim().replace(/\s+Bewertungsrunde$/i, "");
  return `${cleanPrefix} Bewertungsrunde ${roundLabel}`;
}

export interface ReviewerAssignmentEmailData {
  phaseLabel: string;
  confirmationDeadline: string;
  confirmationUrl: string;
  ratingDeadline: string;
  instructionsUrl: string;
  ratingUrl: string;
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

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function renderLinkOrText(value: string, linkLabel: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Keine Angabe";
  if (!isHttpUrl(trimmed)) return escapeHtml(trimmed);
  return `<a href="${safeHttpUrl(trimmed)}">${escapeHtml(linkLabel)}</a>`;
}

export function createReviewerAssignmentEmail({
  phaseLabel,
  confirmationDeadline,
  confirmationUrl,
  ratingDeadline,
  instructionsUrl,
  ratingUrl,
  phaseNote,
  applications,
}: ReviewerAssignmentEmailData) {
  const applicationItems = applications
    .sort((left, right) => left.label.localeCompare(right.label))
    .map(
      (application) =>
        `<li><strong>${escapeHtml(application.label)}</strong>: <a href="${safeHttpUrl(application.url)}">Bewerbung öffnen</a></li>`,
    )
    .join("");

  return `
    <p>Hallo,</p>
    <p>danke, dass Du Generation-D bei der Bewertungsrunde <strong>${escapeHtml(phaseLabel)}</strong> unterstützt!</p>
    <p>Bitte bestätige den Erhalt dieser Nachricht bis <strong>${escapeHtml(confirmationDeadline)}</strong>:<br>${renderLinkOrText(confirmationUrl, "Empfang bestätigen")}</p>
    <p>Bitte schließe Deine Bewertungen bis <strong>${escapeHtml(ratingDeadline)}</strong> ab.</p>
    <p><strong>Deine zu bewertenden Teams:</strong></p>
    <ul>${applicationItems}</ul>
    <p>Bitte melde Dich für die Links im Portal an. Interne Bewerter nutzen ihren Generation-D-Slack-Zugang; die Zustelladresse dieser E-Mail muss nicht identisch sein.</p>
    <p><strong>Anleitung:</strong><br>${renderLinkOrText(instructionsUrl, instructionsUrl)}</p>
    <p><strong>Bewertungsformular:</strong><br>${renderLinkOrText(ratingUrl, ratingUrl)}</p>
    <p><strong>Hinweis für diese Phase:</strong><br>${escapeHtml(phaseNote)}</p>
    <p>Falls Du Fragen hast oder Probleme auftreten, melde Dich gerne jederzeit bei uns.</p>
    <p>Viele Grüße<br>Euer CMD &amp; IT Team</p>
  `;
}

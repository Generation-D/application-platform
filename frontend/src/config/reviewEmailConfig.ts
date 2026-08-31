export interface ReviewEmailDefaults {
  subject: string;
  confirmationDeadline: string;
  confirmationUrl: string;
  ratingDeadline: string;
  instructionsUrl: string;
  ratingUrl: string;
  phaseNote: string;
}

/**
 * Adjust these defaults once per competition year. Admins can still change
 * them for a single send on the preview page.
 */
export const reviewEmailDefaults: ReviewEmailDefaults = {
  subject: "[Generation-D] Bewertungsrunde",
  confirmationDeadline: "26.03.2026, 23:59 Uhr",
  confirmationUrl:
    "https://airtable.com/applJfvdubKSjA6sh/pagcmQICeaUnWo2Nc/form",
  ratingDeadline: "07.04.2026, 23:59 Uhr",
  instructionsUrl:
    "https://drive.google.com/file/d/1INO07NK5r__TzvVUJQayzfF8UKI-Sbq8/view?usp=sharing",
  ratingUrl: "https://airtable.com/applJfvdubKSjA6sh/pagLOnHMhpF53Df27/form",
  phaseNote:
    "Wenn Du Mitglieder eines Teams bereits kennst, melde Dich bitte baldmöglichst bei uns, damit wir das Team neu zuweisen können.",
};

export interface ReviewEmailDefaults {
  subject: string;
  confirmationDeadline: string;
  confirmationUrl: string;
  ratingDeadline: string;
  instructionsUrl: string;
  ratingUrl: string;
  phaseNote: string;
}

/** Edit these public mail headers here. The SMTP account must be allowed to use this From address. */
export const reviewEmailSender = {
  name: "no-reply",
  email: "no-reply@generation-d.org",
  replyTo: ["it@generation-d.org", "cmd@generation-d.org"],
};

/**
 * Adjust these defaults once per competition year. Admins can still change
 * them for a single send on the preview page.
 */
export const reviewEmailDefaults: ReviewEmailDefaults = {
  subject: "[Generation-D] Bewertungsrunde",
  confirmationDeadline: "26.03.2026, 23:59 Uhr",
  confirmationUrl:
    "",
  ratingDeadline: "07.04.2026, 23:59 Uhr",
  instructionsUrl:
    "",
  ratingUrl: "",
  phaseNote:
    "Wenn Du Mitglieder eines Teams bereits kennst, melde Dich bitte baldmöglichst bei uns, damit wir das Team neu zuweisen können.",
};

export interface ReviewEmailDefaults {
  subject: string;
  confirmationDeadline: string;
  confirmationUrl: string;
  ratingDeadline: string;
  instructionsUrl: string;
  ratingUrl: string;
  phaseNote: string;
}

/** Edit these mail headers here. Production reviewer mails also CC the Reply-To addresses. */
export const reviewEmailItAddress = "it@generation-d.org";

export const reviewEmailSender = {
  name: "no-reply",
  email: "no-reply@generation-d.org",
  replyTo: [reviewEmailItAddress, "cmd@generation-d.org"],
};

/**
 * Adjust these defaults once per competition year. Admins can change the
 * deadlines, references and phase note for a single send on the admin page.
 */
export const reviewEmailDefaults: ReviewEmailDefaults = {
  subject: "[Generation-D]",
  confirmationDeadline: "",
  confirmationUrl: "",
  ratingDeadline: "",
  instructionsUrl: "",
  ratingUrl: "",
  phaseNote:
    "Wenn Du Mitglieder eines Teams bereits kennst, melde Dich bitte baldmöglichst bei uns, damit wir das Team neu zuweisen können.",
};

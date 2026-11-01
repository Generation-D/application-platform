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
export const reviewEmailCmdAddress = "cmd@generation-d.org";

export interface ReviewEmailCcSelection {
  it: boolean;
  cmd: boolean;
}

export function selectedReviewEmailCc(selection: ReviewEmailCcSelection) {
  return [
    ...(selection.it ? [reviewEmailItAddress] : []),
    ...(selection.cmd ? [reviewEmailCmdAddress] : []),
  ];
}

export function requiredProductionReviewCc(selection: ReviewEmailCcSelection) {
  if (!selection.it || !selection.cmd) {
    throw new Error(
      "Für den produktiven Versand müssen IT und CMD beide in CC aktiviert sein.",
    );
  }
  return selectedReviewEmailCc(selection);
}

export const reviewEmailSender = {
  name: "no-reply",
  email: "no-reply@generation-d.org",
  replyTo: [reviewEmailItAddress, reviewEmailCmdAddress],
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

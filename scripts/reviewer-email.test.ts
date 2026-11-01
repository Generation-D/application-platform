import { describe, it, expect } from "vitest";

import {
  reviewEmailCmdAddress,
  reviewEmailItAddress,
  reviewEmailSender,
  requiredProductionReviewCc,
  selectedReviewEmailCc,
} from "../src/config/reviewEmailConfig";
import {
  createReviewerAssignmentEmail,
  createReviewerSubject,
  escapeHtml,
  isHttpUrl,
} from "../src/emails/reviewerAssignmentEmail";

it("renders reviewer assignments and escapes application labels", () => {
  const html = createReviewerAssignmentEmail({
    phaseLabel: "1. Kurzbewerbung",
    confirmationDeadline: "01.01.2027",
    confirmationUrl: "https://example.org/confirm",
    ratingDeadline: "02.01.2027",
    instructionsUrl: "https://example.org/instructions",
    ratingUrl: "https://example.org/rating",
    phaseNote: "Bitte Interessenkonflikte melden.",
    applications: [
      { label: "Bewerbung <script>", url: "https://example.org/review/123" },
    ],
  });

  expect(html).toMatch(/Bewerbung &lt;script&gt;/);
  expect(html).toMatch(/Bewertungsrunde <strong>1\. Kurzbewerbung<\/strong>/);
  expect(html).not.toMatch(/Bewerbung <script>/);
  expect(html).toMatch(
    /href="https:\/\/example\.org\/review\/123">Bewerbung öffnen<\/a>/,
  );
  expect(html).not.toMatch(/Alle Bewerbungen im Portal ansehen/);
  expect(
    (html.match(/https:\/\/example\.org\/review\/123/g) ?? []).length,
  ).toBe(1);
  expect(html).toMatch(/Euer CMD &amp; IT Team/);
  expect(
    createReviewerSubject("[Generation-D]", "1. Kurzbewerbung"),
  ).toBe("[Generation-D] Bewertungsrunde 1. Kurzbewerbung");
  expect(
    createReviewerSubject("[Generation-D] Bewertungsrunde", "1. Kurzbewerbung"),
  ).toBe("[Generation-D] Bewertungsrunde 1. Kurzbewerbung");
});

it("renders free-text references safely instead of creating unsafe links", () => {
  const html = createReviewerAssignmentEmail({
    phaseLabel: "Phase 1",
    confirmationDeadline: "01.01.2027",
    confirmationUrl: "Bitte per Antwort bestätigen <script>",
    ratingDeadline: "02.01.2027",
    instructionsUrl: "Siehe Slack-Kanal #review",
    ratingUrl: "javascript:alert(1)",
    phaseNote: "Hinweis",
    applications: [
      { label: "Bewerbung", url: "https://example.org/review/123" },
    ],
  });
  expect(html).toMatch(/Bitte per Antwort bestätigen &lt;script&gt;/);
  expect(html).toMatch(/Siehe Slack-Kanal #review/);
  expect(html).toMatch(/javascript:alert\(1\)/);
  expect(html).not.toMatch(/href="javascript:/);
  expect(isHttpUrl("per E-Mail antworten")).toBe(false);
  expect(isHttpUrl("https://example.org/confirm")).toBe(true);
});

it("rejects non-http application links", () => {
  expect(() =>
    createReviewerAssignmentEmail({
      phaseLabel: "Phase 1",
      confirmationDeadline: "01.01.2027",
      confirmationUrl: "https://example.org/confirm",
      ratingDeadline: "02.01.2027",
      instructionsUrl: "https://example.org/instructions",
      ratingUrl: "https://example.org/rating",
      phaseNote: "Hinweis",
      applications: [{ label: "Bewerbung", url: "javascript:alert(1)" }],
    }),
  ).toThrow();
});

it("escapes the reviewer address in the test email heading", () => {
  expect(
    escapeHtml('reviewer@example.org"><img src=x onerror=alert(1)>'),
  ).toBe("reviewer@example.org&quot;&gt;&lt;img src=x onerror=alert(1)&gt;");
});

it("production copies go to both IT and CMD inboxes", () => {
  expect(reviewEmailItAddress).toBe("it@generation-d.org");
  expect(reviewEmailCmdAddress).toBe("cmd@generation-d.org");
  expect(reviewEmailSender.replyTo).toEqual([
    reviewEmailItAddress,
    reviewEmailCmdAddress,
  ]);
  expect(selectedReviewEmailCc({ it: true, cmd: false })).toEqual([
    reviewEmailItAddress,
  ]);
  expect(selectedReviewEmailCc({ it: false, cmd: true })).toEqual([
    reviewEmailCmdAddress,
  ]);
  expect(selectedReviewEmailCc({ it: false, cmd: false })).toEqual([]);
  expect(selectedReviewEmailCc({ it: true, cmd: true })).toEqual([
    reviewEmailItAddress,
    reviewEmailCmdAddress,
  ]);
  expect(() => requiredProductionReviewCc({ it: true, cmd: false })).toThrow();
  expect(() => requiredProductionReviewCc({ it: false, cmd: true })).toThrow();
  expect(requiredProductionReviewCc({ it: true, cmd: true })).toEqual([
    reviewEmailItAddress,
    reviewEmailCmdAddress,
  ]);
});

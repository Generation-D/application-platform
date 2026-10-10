import assert from "node:assert/strict";
import test from "node:test";

import {
  reviewEmailItAddress,
  reviewEmailSender,
} from "../src/config/reviewEmailConfig";
import {
  createReviewerAssignmentEmail,
  createReviewerSubject,
  isHttpUrl,
} from "../src/emails/reviewerAssignmentEmail";

test("renders reviewer assignments and escapes application labels", () => {
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

  assert.match(html, /Bewerbung &lt;script&gt;/);
  assert.match(html, /Bewertungsrunde <strong>1\. Kurzbewerbung<\/strong>/);
  assert.doesNotMatch(html, /Bewerbung <script>/);
  assert.match(
    html,
    /href="https:\/\/example\.org\/review\/123">Bewerbung öffnen<\/a>/,
  );
  assert.doesNotMatch(html, /Alle Bewerbungen im Portal ansehen/);
  assert.equal(
    (html.match(/https:\/\/example\.org\/review\/123/g) ?? []).length,
    1,
  );
  assert.match(html, /Euer CMD &amp; IT Team/);
  assert.equal(
    createReviewerSubject("[Generation-D]", "1. Kurzbewerbung"),
    "[Generation-D] Bewertungsrunde 1. Kurzbewerbung",
  );
  assert.equal(
    createReviewerSubject("[Generation-D] Bewertungsrunde", "1. Kurzbewerbung"),
    "[Generation-D] Bewertungsrunde 1. Kurzbewerbung",
  );
});

test("renders free-text references safely instead of creating unsafe links", () => {
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
  assert.match(html, /Bitte per Antwort bestätigen &lt;script&gt;/);
  assert.match(html, /Siehe Slack-Kanal #review/);
  assert.match(html, /javascript:alert\(1\)/);
  assert.doesNotMatch(html, /href="javascript:/);
  assert.ok(!isHttpUrl("per E-Mail antworten"));
  assert.ok(isHttpUrl("https://example.org/confirm"));
});

test("rejects non-http application links", () => {
  assert.throws(() =>
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
  );
});

test("production copies go to both IT and CMD inboxes", () => {
  assert.equal(reviewEmailItAddress, "it@generation-d.org");
  assert.deepEqual(reviewEmailSender.replyTo, [
    reviewEmailItAddress,
    "cmd@generation-d.org",
  ]);
});

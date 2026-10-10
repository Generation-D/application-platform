import assert from "node:assert/strict";
import test from "node:test";

import { reviewEmailOverviewRecipient } from "../src/config/reviewEmailConfig";
import {
  createMatchingOverviewEmail,
  createReviewerAssignmentEmail,
} from "../src/emails/reviewerAssignmentEmail";

test("renders reviewer assignments and escapes application labels", () => {
  const html = createReviewerAssignmentEmail({
    phaseLabel: "Phase 1",
    confirmationDeadline: "01.01.2027",
    confirmationUrl: "https://example.org/confirm",
    ratingDeadline: "02.01.2027",
    instructionsUrl: "https://example.org/instructions",
    ratingUrl: "https://example.org/rating",
    reviewUrl: "https://example.org/review",
    phaseNote: "Bitte Interessenkonflikte melden.",
    applications: [
      { label: "Bewerbung <script>", url: "https://example.org/review/123" },
    ],
  });

  assert.match(html, /Bewerbung &lt;script&gt;/);
  assert.doesNotMatch(html, /Bewerbung <script>/);
  assert.match(
    html,
    /href="https:\/\/example\.org\/review\/123">Bewerbung öffnen<\/a>/,
  );
  assert.ok(
    html.indexOf("Deine zu bewertenden Teams") <
      html.indexOf("Alle Bewerbungen im Portal ansehen"),
  );
});

test("rejects non-http links", () => {
  assert.throws(() =>
    createReviewerAssignmentEmail({
      phaseLabel: "Phase 1",
      confirmationDeadline: "01.01.2027",
      confirmationUrl: "javascript:alert(1)",
      ratingDeadline: "02.01.2027",
      instructionsUrl: "https://example.org/instructions",
      ratingUrl: "https://example.org/rating",
      reviewUrl: "https://example.org/review",
      phaseNote: "Hinweis",
      applications: [
        { label: "Bewerbung", url: "https://example.org/review/123" },
      ],
    }),
  );
});

test("overview contains recipient, SMTP status and a copy of the mail", () => {
  const html = createMatchingOverviewEmail("Phase 1", [
    {
      recipient: "private@example.org",
      status: "angenommen",
      applicationCount: 2,
      html: "<p>Mailkopie</p>",
    },
  ]);
  assert.match(html, /private@example\.org/);
  assert.match(html, /angenommen/);
  assert.match(html, /2 Bewerbungen/);
  assert.match(html, /<p>Mailkopie<\/p>/);
});

test("matching overview goes to the IT inbox", () => {
  assert.equal(reviewEmailOverviewRecipient, "it@generation-d.org");
});

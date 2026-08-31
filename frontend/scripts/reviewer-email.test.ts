import assert from "node:assert/strict";
import test from "node:test";

import { createReviewerAssignmentEmail } from "../src/emails/reviewerAssignmentEmail";

test("renders reviewer assignments and escapes team names", () => {
  const html = createReviewerAssignmentEmail({
    phaseLabel: "Phase 1",
    confirmationDeadline: "01.01.2027",
    confirmationUrl: "https://example.org/confirm",
    ratingDeadline: "02.01.2027",
    instructionsUrl: "https://example.org/instructions",
    ratingUrl: "https://example.org/rating",
    reviewUrl: "https://example.org/review",
    phaseNote: "Bitte Interessenkonflikte melden.",
    applications: [{ teamName: "Team <script>" }],
  });

  assert.match(html, /Team &lt;script&gt;/);
  assert.doesNotMatch(html, /Team <script>/);
  assert.match(html, /https:\/\/example\.org\/review/);
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
      applications: [{ teamName: "Team" }],
    }),
  );
});

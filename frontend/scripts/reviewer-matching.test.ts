import assert from "node:assert/strict";
import test from "node:test";

import {
  assignReviewers,
  MatchingApplication,
  MatchingReviewer,
} from "../src/utils/reviewerMatching";

const applications: MatchingApplication[] = [
  {
    applicationId: "application-2",
    applicantUserId: "applicant-2",
    teamName: "Team 2",
    email: "team2@example.org",
  },
  {
    applicationId: "application-1",
    applicantUserId: "applicant-1",
    teamName: "Team 1",
    email: "team1@example.org",
  },
];

const reviewers: MatchingReviewer[] = [
  {
    userId: "reviewer-new",
    name: "New Reviewer",
    email: "new@example.org",
    isExperienced: false,
    maxApplications: 2,
  },
  {
    userId: "reviewer-experienced-2",
    name: "Experienced Reviewer 2",
    email: "experienced2@example.org",
    isExperienced: true,
    maxApplications: 1,
  },
  {
    userId: "reviewer-experienced-1",
    name: "Experienced Reviewer 1",
    email: "experienced1@example.org",
    isExperienced: true,
    maxApplications: 1,
  },
];

test("assigns the requested number and one experienced reviewer per application", () => {
  const assignments = assignReviewers(applications, reviewers, 2);

  assert.equal(assignments.length, 4);
  for (const application of applications) {
    const applicationAssignments = assignments.filter(
      (assignment) => assignment.applicationId === application.applicationId,
    );
    assert.equal(applicationAssignments.length, 2);
    assert.equal(
      applicationAssignments.some(
        (assignment) => assignment.reviewerIsExperienced,
      ),
      true,
    );
  }
});

test("is deterministic regardless of application input order", () => {
  assert.deepEqual(
    assignReviewers(applications, reviewers, 2),
    assignReviewers([...applications].reverse(), reviewers, 2),
  );
});

test("rejects insufficient experienced capacity", () => {
  assert.throws(
    () =>
      assignReviewers(
        applications,
        reviewers.map((reviewer) => ({ ...reviewer, isExperienced: false })),
        2,
      ),
    /erfahrene Bewerter/,
  );
});

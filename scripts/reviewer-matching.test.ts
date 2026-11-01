import { it, expect } from "vitest";

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
    name: "New Reviewer",
    email: "new@example.org",
    isExperienced: false,
    maxApplications: 2,
  },
  {
    name: "Experienced Reviewer 2",
    email: "experienced2@example.org",
    isExperienced: true,
    maxApplications: 1,
  },
  {
    name: "Experienced Reviewer 1",
    email: "experienced1@example.org",
    isExperienced: true,
    maxApplications: 1,
  },
];

it("assigns the requested number and one experienced reviewer per application", () => {
  const assignments = assignReviewers(applications, reviewers, 2);

  expect(assignments.length).toBe(4);
  for (const application of applications) {
    const applicationAssignments = assignments.filter(
      (assignment) => assignment.applicationId === application.applicationId,
    );
    expect(applicationAssignments.length).toBe(2);
    expect(
      applicationAssignments.some(
        (assignment) => assignment.reviewerIsExperienced,
      ),
    ).toBe(true);
  }
});

it("preserves the former script's input-order tie breaking", () => {
  const assignments = assignReviewers(applications, reviewers, 2);
  expect(
    assignments.map((assignment) => [
      assignment.applicationId,
      assignment.reviewerEmail,
    ]),
  ).toEqual([
    ["application-2", "experienced2@example.org"],
    ["application-2", "new@example.org"],
    ["application-1", "experienced1@example.org"],
    ["application-1", "new@example.org"],
  ]);
});

it("rejects insufficient experienced capacity", () => {
  expect(() =>
    assignReviewers(
      applications,
      reviewers.map((reviewer) => ({ ...reviewer, isExperienced: false })),
      2,
    ),
  ).toThrow(/erfahrene Bewerter/);
});
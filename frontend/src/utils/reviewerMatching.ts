export interface MatchingApplication {
  applicationId: string;
  applicantUserId: string;
  teamName: string;
  email: string;
}

export interface MatchingReviewer {
  userId: string;
  name: string;
  email: string;
  isExperienced: boolean;
  maxApplications: number;
}

export interface ReviewerAssignment {
  applicationId: string;
  applicantUserId: string;
  teamName: string;
  applicantEmail: string;
  reviewerUserId: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerIsExperienced: boolean;
}

function byCurrentLoad(assignmentsByReviewer: Map<string, string[]>) {
  return (left: MatchingReviewer, right: MatchingReviewer) => {
    return (
      assignmentsByReviewer.get(left.userId)!.length -
      assignmentsByReviewer.get(right.userId)!.length
    );
  };
}

/**
 * Matches the former Python process for the same ordered inputs.
 * Each application receives one experienced reviewer first. Remaining places
 * are filled with the currently least-loaded eligible reviewer. Stable sorting
 * preserves CSV order when reviewers have equal load, like Python's sorted().
 */
export function assignReviewers(
  applications: MatchingApplication[],
  reviewers: MatchingReviewer[],
  reviewersPerApplication: number,
): ReviewerAssignment[] {
  if (
    !Number.isInteger(reviewersPerApplication) ||
    reviewersPerApplication < 1
  ) {
    throw new Error(
      "Die Anzahl der Bewerter pro Startup muss mindestens 1 sein.",
    );
  }
  if (applications.length === 0) {
    throw new Error(
      "Für diese Phase wurden keine teilnahmeberechtigten Startups gefunden.",
    );
  }
  if (reviewers.length < reviewersPerApplication) {
    throw new Error(
      "Es stehen nicht genügend unterschiedliche Bewerter zur Verfügung.",
    );
  }

  const reviewerIds = new Set<string>();
  for (const reviewer of reviewers) {
    if (reviewerIds.has(reviewer.userId)) {
      throw new Error(`Bewerter ${reviewer.email} kommt mehrfach vor.`);
    }
    if (
      !Number.isInteger(reviewer.maxApplications) ||
      reviewer.maxApplications < 0
    ) {
      throw new Error(`Die Kapazität von ${reviewer.email} ist ungültig.`);
    }
    reviewerIds.add(reviewer.userId);
  }

  const requiredAssignments = applications.length * reviewersPerApplication;
  const totalCapacity = reviewers.reduce(
    (sum, reviewer) => sum + reviewer.maxApplications,
    0,
  );
  if (totalCapacity < requiredAssignments) {
    throw new Error(
      `Es werden ${requiredAssignments} Zuweisungen benötigt, aber die Gesamtkapazität beträgt nur ${totalCapacity}.`,
    );
  }

  const experiencedCapacity = reviewers
    .filter((reviewer) => reviewer.isExperienced)
    .reduce((sum, reviewer) => sum + reviewer.maxApplications, 0);
  if (experiencedCapacity < applications.length) {
    throw new Error(
      `Für ${applications.length} Startups werden erfahrene Bewerter benötigt, deren Kapazität beträgt aber nur ${experiencedCapacity}.`,
    );
  }

  const assignmentsByReviewer = new Map(
    reviewers.map((reviewer) => [reviewer.userId, [] as string[]]),
  );
  const reviewersByApplication = new Map(
    applications.map((application) => [
      application.applicationId,
      [] as MatchingReviewer[],
    ]),
  );

  for (const application of applications) {
    const experiencedReviewer = reviewers
      .filter(
        (reviewer) =>
          reviewer.isExperienced &&
          assignmentsByReviewer.get(reviewer.userId)!.length <
            reviewer.maxApplications,
      )
      .sort(byCurrentLoad(assignmentsByReviewer))[0];

    if (!experiencedReviewer) {
      throw new Error(
        `Für ${application.teamName} konnte kein erfahrener Bewerter gefunden werden.`,
      );
    }

    reviewersByApplication
      .get(application.applicationId)!
      .push(experiencedReviewer);
    assignmentsByReviewer
      .get(experiencedReviewer.userId)!
      .push(application.applicationId);
  }

  for (const application of applications) {
    const assignedReviewers = reviewersByApplication.get(
      application.applicationId,
    )!;

    while (assignedReviewers.length < reviewersPerApplication) {
      const nextReviewer = reviewers
        .filter(
          (reviewer) =>
            !assignedReviewers.some(
              (assignedReviewer) => assignedReviewer.userId === reviewer.userId,
            ) &&
            assignmentsByReviewer.get(reviewer.userId)!.length <
              reviewer.maxApplications,
        )
        .sort(byCurrentLoad(assignmentsByReviewer))[0];

      if (!nextReviewer) {
        throw new Error(
          `Für ${application.teamName} konnten nicht genügend Bewerter gefunden werden.`,
        );
      }

      assignedReviewers.push(nextReviewer);
      assignmentsByReviewer
        .get(nextReviewer.userId)!
        .push(application.applicationId);
    }
  }

  return applications.flatMap((application) =>
    reviewersByApplication.get(application.applicationId)!.map((reviewer) => ({
      applicationId: application.applicationId,
      applicantUserId: application.applicantUserId,
      teamName: application.teamName,
      applicantEmail: application.email,
      reviewerUserId: reviewer.userId,
      reviewerName: reviewer.name,
      reviewerEmail: reviewer.email,
      reviewerIsExperienced: reviewer.isExperienced,
    })),
  );
}

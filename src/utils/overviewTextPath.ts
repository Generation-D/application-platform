interface OverviewPhase {
  phaseid: string;
  phasename: string;
  phaseorder: number;
  enddate: string;
  finished_evaluation: string | null;
}

interface OverviewOutcome {
  outcome: boolean;
  phase: OverviewPhase;
}

export function overviewTextPath(
  currentPhase: OverviewPhase,
  outcomes: OverviewOutcome[],
  currentTime: Date,
) {
  if (currentPhase.phaseorder === -1) return "welcome.md";

  const failedPreviousPhase = outcomes
    .filter(
      ({ outcome, phase }) =>
        !outcome &&
        phase.finished_evaluation !== null &&
        phase.phaseorder < currentPhase.phaseorder,
    )
    .sort((left, right) => right.phase.phaseorder - left.phase.phaseorder)[0];
  if (failedPreviousPhase) {
    return `${failedPreviousPhase.phase.phasename}/failed.md`;
  }

  const phasePath = currentPhase.phasename;
  if (currentPhase.finished_evaluation !== null) {
    const decision = outcomes.find(
      ({ phase }) => phase.phaseid === currentPhase.phaseid,
    );
    if (!decision) return "error.md";
    return `${phasePath}/${decision.outcome ? "passed" : "failed"}.md`;
  }

  return `${phasePath}/${new Date(currentPhase.enddate) >= currentTime ? "ongoing" : "evaluating"}.md`;
}

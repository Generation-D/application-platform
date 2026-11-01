import { it, expect } from "vitest";

import { overviewTextPath } from "../src/utils/overviewTextPath";

const phase = {
  phaseid: "phase-1-id",
  phasename: "phase-1",
  phaseorder: 0,
  enddate: "2026-03-22T23:59:59Z",
  finished_evaluation: null as string | null,
};
const afterDeadline = new Date("2026-03-23T12:00:00Z");

it("publishing a completed phase replaces evaluation text with the saved decision", () => {
  const passed = { outcome: true, phase };
  const failed = { outcome: false, phase };
  expect(overviewTextPath(phase, [passed], afterDeadline)).toBe(
    "phase-1/evaluating.md",
  );

  const completed = { ...phase, finished_evaluation: "2026-03-23T12:00:00Z" };
  expect(
    overviewTextPath(
      completed,
      [{ ...passed, phase: completed }],
      afterDeadline,
    ),
  ).toBe("phase-1/passed.md");
  expect(
    overviewTextPath(
      completed,
      [{ ...failed, phase: completed }],
      afterDeadline,
    ),
  ).toBe("phase-1/failed.md");
  expect(
    overviewTextPath(
      completed,
      [{ ...passed, phase: completed }],
      new Date("2026-03-20T12:00:00Z"),
    ),
  ).toBe("phase-1/passed.md");
});

it("a failed earlier round stays visible in the next round", () => {
  const nextPhase = {
    ...phase,
    phaseid: "phase-2-id",
    phasename: "phase-2",
    phaseorder: 1,
  };
  const completed = { ...phase, finished_evaluation: "2026-03-23T12:00:00Z" };
  expect(
    overviewTextPath(
      nextPhase,
      [{ outcome: false, phase: completed }],
      afterDeadline,
    ),
  ).toBe("phase-1/failed.md");
});

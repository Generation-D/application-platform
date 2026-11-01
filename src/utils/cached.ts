import { cache } from "react";

import { fetch_phase_by_name, fetch_question_table } from "@/actions/phase";

export const revalidate = 3600;

export const cached_fetch_phase_by_name = cache(async (phaseName: string) => {
  const phaseData = await fetch_phase_by_name(phaseName);
  return phaseData;
});

export const cached_fetch_phase_questions = cache(async (phaseId: string) => {
  const phaseQuestions = await fetch_question_table(phaseId);
  return phaseQuestions;
});

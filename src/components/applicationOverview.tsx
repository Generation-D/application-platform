"use client";

import React, { useCallback, useEffect } from "react";

import { ExtendedAnswerType } from "@/actions/answers/answers";
import { PhaseOutcome } from "@/actions/phase";
import { INIT_PLACEHOLDER, UpdateAnswer } from "@/store/slices/answerSlice";
import { PhaseData } from "@/store/slices/phaseSlice";
import { useAppDispatch } from "@/store/store";

import PhaseOverview from "./phaseOverview";
import { Question } from "./questions";

const ApplicationOverview: React.FC<{
  phasesData: PhaseData[];
  phasesQuestions: Record<string, Question[]>;
  phaseAnswers: ExtendedAnswerType[];
  phasesOutcome: PhaseOutcome[];
}> = ({ phasesData, phasesQuestions, phaseAnswers, phasesOutcome }) => {
  const dispatch = useAppDispatch();

  const updateAnswerState = useCallback(
    (questionid: string, answerid?: string, answervalue?: string | null) => {
      dispatch(
        UpdateAnswer({
          questionid: questionid,
          answervalue: answervalue || INIT_PLACEHOLDER,
          answerid: answerid || "",
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    phaseAnswers.forEach((answer) => {
      updateAnswerState(
        answer.questionid,
        answer.answerid,
        answer?.answervalue,
      );
    });
  }, [phaseAnswers, updateAnswerState]);

  const phaseOverviewData = createPhaseOverviewData(
    phasesData,
    phasesQuestions,
    phasesOutcome,
  );

  return (
    <>
      {phaseOverviewData.map(
        ({
          phase,
          mandatoryPhaseQuestionIds,
          phaseQuestions,
          phaseOutcome,
          failedPhase,
        }) => {
          return (
            <PhaseOverview
              key={phase.phaseid}
              phaseId={phase.phaseid}
              phaseName={phase.phasename}
              phaseLabel={phase.phaselabel}
              phaseOrder={phase.phaseorder}
              phaseStart={phase.startdate}
              phaseEnd={phase.enddate}
              mandatoryQuestionIds={mandatoryPhaseQuestionIds}
              phaseQuestions={phaseQuestions}
              phaseOutcome={phaseOutcome}
              failedPhase={failedPhase}
            />
          );
        },
      )}
    </>
  );
};

export function createPhaseOverviewData(
  phasesData: PhaseData[],
  phasesQuestions: Record<string, Question[]>,
  phasesOutcome: PhaseOutcome[],
) {
  let failedPhase = false;

  return phasesData
    .toSorted((a, b) => a.phaseorder - b.phaseorder)
    .map((phase) => {
      const phaseQuestions = phasesQuestions[phase.phaseid];
      const mandatoryPhaseQuestionIds = phaseQuestions
        .filter((q) => q.mandatory)
        .map((q) => q.questionid);
      const phaseOutcome = phasesOutcome.find(
        (thisPhase) => thisPhase.phase.phaseid == phase.phaseid,
      );
      if (phaseOutcome !== undefined && !phaseOutcome.outcome) {
        failedPhase = true;
      }
      return {
        phase,
        mandatoryPhaseQuestionIds,
        phaseQuestions,
        phaseOutcome,
        failedPhase,
      };
    });
}

export default ApplicationOverview;

"use client";

import React, { useCallback } from "react";

import { ExtendedAnswerType } from "@/actions/answers/answers";
import { UpdateAnswer, INIT_PLACEHOLDER } from "@/store/slices/answerSlice";
import { PhaseData } from "@/store/slices/phaseSlice";
import { useAppDispatch } from "@/store/store";
import { calcPhaseStatus, transformReadableDateTime } from "@/utils/helpers";
import {
  CalendarDaysIcon,
  DocumentCheckIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProgressBar } from "./progressbar";
import { Question } from "./questions";
import { createPhaseOverviewData } from "./applicationOverview";

const ViewerApplicationOverview: React.FC<{
  phasesData: PhaseData[];
  phasesQuestions: Record<string, Question[]>;
  phaseAnswers: ExtendedAnswerType[];
  applicationid: string;
}> = ({ phasesData, phasesQuestions, phaseAnswers, applicationid }) => {
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
    [],
  );

  return (
    <>
      {phaseOverviewData.map(
        ({ phase, mandatoryPhaseQuestionIds, phaseQuestions }) => {
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
              applicationid={applicationid}
            />
          );
        },
      )}
    </>
  );
};

const PhaseOverview: React.FC<{
  phaseId: string;
  phaseName: string;
  phaseLabel: string;
  phaseOrder: number;
  phaseStart: string;
  phaseEnd: string;
  mandatoryQuestionIds: string[];
  phaseQuestions: Question[];
  applicationid: string;
}> = ({
  phaseId,
  phaseName,
  phaseLabel,
  phaseOrder,
  phaseStart,
  phaseEnd,
  mandatoryQuestionIds,
  phaseQuestions,
  applicationid,
}) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/review/applications/${applicationid}/${phaseName}`);
  };
  const phaseStatus = calcPhaseStatus(phaseStart, phaseEnd);
  const statusIcon = () => {
    switch (phaseStatus) {
      case "UPCOMING":
        return <CalendarDaysIcon className="h-6 w-6 text-secondary" />;
      case "ENDED":
        return <DocumentCheckIcon className="h-6 w-6 text-secondary" />;
      default:
        return <PencilSquareIcon className="h-6 w-6 text-secondary" />;
    }
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto p-8 rounded-lg shadow-md  ${
        phaseStatus === "UPCOMING" ? "bg-[#B8B8B8] opacity-30" : "bg-white"
      }`}
    >
      <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col justify-start gap-1">
          <div className="flex items-center">
            {statusIcon()}
            <h2 className="rounded font-bold ml-2">
              Phase {phaseOrder + 1}: {phaseLabel}
            </h2>
          </div>
          <h4 className="rounded">
            <div className="flex-row-2 gap-x-2">
              <div>Beginn: {transformReadableDateTime(phaseStart)} Uhr</div>
              <div>Ende: {transformReadableDateTime(phaseEnd)} Uhr</div>
            </div>
          </h4>
        </div>
        <div className="p-4 rounded">
          <ProgressBar
            progressbarId={`${phaseId}-overview`}
            mandatoryQuestionIds={mandatoryQuestionIds}
            phaseQuestions={phaseQuestions}
            endDate={phaseEnd}
          />
        </div>
        <button
          type="button"
          className="apl-button-fixed-short"
          onClick={handleRedirect}
        >
          Phase einsehen
        </button>
      </div>
    </div>
  );
};

export default ViewerApplicationOverview;

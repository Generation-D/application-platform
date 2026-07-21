"use client";

import React, { useCallback } from "react";

import { ExtendedAnswerType } from "@/actions/answers/answers";
import { PhaseOutcome } from "@/actions/phase";
import { UpdateAnswer, INIT_PLACEHOLDER } from "@/store/slices/answerSlice";
import { PhaseData } from "@/store/slices/phaseSlice";
import { useAppDispatch } from "@/store/store";
import {
  calcPhaseStatus,
  transformReadableDateTime,
  transformReadableDate,
} from "@/utils/helpers";
import {
  NoSymbolIcon,
  CalendarDaysIcon,
  DocumentCheckIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProgressBar } from "./progressbar";
import { Question } from "./questions";

const ViewerApplicationOverview: React.FC<{
  phasesData: PhaseData[];
  phasesQuestions: Record<string, Question[]>;
  phaseAnswers: ExtendedAnswerType[];
  phasesOutcome: PhaseOutcome[];
  applicationid: string;
}> = ({
  phasesData,
  phasesQuestions,
  phaseAnswers,
  phasesOutcome,
  applicationid,
}) => {
  const dispatch = useAppDispatch();

  const updateAnswerState = useCallback((
    questionid: string,
    answerid?: string,
    answervalue?: string | null,
  ) => {
    dispatch(
      UpdateAnswer({
        questionid: questionid,
        answervalue: answervalue || INIT_PLACEHOLDER,
        answerid: answerid || "",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    phaseAnswers.forEach((answer) => {
      updateAnswerState(
        answer.questionid,
        answer.answerid,
        answer?.answervalue,
      );
    });
  }, [phaseAnswers, updateAnswerState]);

  
  let failedPhase: boolean = false;
  return (
    <>
      {phasesData
        .sort((a, b) => a.phaseorder - b.phaseorder)
        .map((phase) => {
          const phaseQuestions = phasesQuestions[phase.phaseid];
          const mandatoryPhaseQuestionIds = phaseQuestions
            .filter((q) => q.mandatory)
            .map((q) => q.questionid);
          const phaseOutcome = phasesOutcome.find(
            (thisPhase) => thisPhase.phase.phaseid == phase.phaseid,
          );
          if (phaseOutcome !== undefined && !phaseOutcome.outcome) {
            // TODO: 
            // eslint-disable-next-line react-hooks/immutability
            failedPhase = true;
          }
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
              applicationid={applicationid}
            />
          );
        })}
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
  phaseOutcome: PhaseOutcome | undefined;
  failedPhase: boolean;
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
  phaseOutcome,
  failedPhase,
  applicationid,
}) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/review/applications/${applicationid}/${phaseName}`);
  };
  const phaseStatus = calcPhaseStatus(phaseStart, phaseEnd);
  const previousFailed = phaseOutcome == undefined && failedPhase;
  const statusIcon = (previousFailed: boolean = false) => {
    switch (previousFailed ? "STOP" : phaseStatus) {
      case "STOP":
        return <NoSymbolIcon className="h-6 w-6 text-secondary" />;
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
            {statusIcon(previousFailed)}
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
          {phaseStatus != "UPCOMING" && !previousFailed ? (
            <ProgressBar
              progressbarId={`${phaseId}-overview`}
              mandatoryQuestionIds={mandatoryQuestionIds}
              phaseQuestions={phaseQuestions}
              endDate={phaseEnd}
            />
          ) : phaseStatus == "UPCOMING" ? (
            `Phase startet am ${transformReadableDate(phaseStart)}`
          ) : (
            previousFailed && "Vorherige Phase leider nicht bestanden!"
          )}
        </div>
        {phaseStatus == "UPCOMING" ? (
          <button
            type="button"
            className="rounded px-1 py-2 text-[#B8B8B8] max-h-14 bg-[#4D4D4D] cursor-default"
          >
            Phase bevorstehend
          </button>
        ) : (
          <button
            type="button"
            aria-disabled={true}
            className="apl-button-fixed-short"
            onClick={() => handleRedirect()}
          >
            Phase einsehen
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewerApplicationOverview;

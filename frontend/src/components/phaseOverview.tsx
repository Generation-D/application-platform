"use client";

import React from "react";

import {
  CalendarDaysIcon,
  DocumentCheckIcon,
  NoSymbolIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

import { PhaseOutcome } from "@/actions/phase";
import {
  calcPhaseStatus,
  transformReadableDate,
  transformReadableDateTime,
} from "@/utils/helpers";

import { ProgressBar } from "./progressbar";
import { Question } from "./questions";

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
}) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/application/${phaseName}`);
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
      className={`w-full max-w-screen-xl mx-auto p-8 rounded-lg shadow-md  ${
        phaseStatus === "UPCOMING" ? "bg-[#B8B8B8] opacity-30" : "bg-white"
      }`}
    >
      <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 md:grid-cols-1 md:grid-rows-2">
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
        {previousFailed ? (
          <button
            type="button"
            className="rounded px-1 py-2 text-[#B8B8B8] max-h-14 bg-[#4D4D4D] cursor-default"
          >
            Phase nicht bearbeitbar
          </button>
        ) : phaseStatus == "UPCOMING" ? (
          <button
            type="button"
            className="rounded px-1 py-2 text-[#B8B8B8] max-h-14 bg-[#4D4D4D] cursor-default"
          >
            Phase bevorstehend
          </button>
        ) : phaseStatus == "ENDED" ? (
          <button
            type="button"
            aria-disabled={true}
            className="apl-button-fixed-short"
            onClick={() => handleRedirect()}
          >
            Phase einsehen
          </button>
        ) : (
          <button
            type="button"
            aria-disabled={true}
            className="apl-button-fixed-short"
            onClick={() => handleRedirect()}
          >
            Phase bearbeiten
          </button>
        )}
      </div>
    </div>
  );
};

export default PhaseOverview;

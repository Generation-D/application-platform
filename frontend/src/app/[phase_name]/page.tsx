import { RedirectType, redirect } from "next/navigation";

import { fetchAllAnswersOfApplication } from "@/actions/answers/answers";
import { fetch_phases_status, fetch_sections_by_phase } from "@/actions/phase";
import {
  SectionQuestionsMap,
  SectionView,
} from "@/components/layout/sectionViewer";
import { MissingQuestions } from "@/components/missingQuestions";
import OverviewButton from "@/components/overviewButton";
import { ProgressBar } from "@/components/progressbar";
import Questionnaire, { Question } from "@/components/questions";
import { SectionData } from "@/store/slices/phaseSlice";
import {
  cached_fetch_phase_by_name,
  cached_fetch_phase_questions,
} from "@/utils/cached";
import { createCurrentTimestamp } from "@/utils/helpers";

export default async function Page({
  params,
}: {
  params: { phase_name: string };
}) {
  const phaseName = params.phase_name;
  const phaseData = await cached_fetch_phase_by_name(phaseName);
  const phasesOutcome = await fetch_phases_status();
  let failedPhase: boolean = false;
  phasesOutcome.forEach((thisPhase) => {
    if (thisPhase.phase.phaseorder < phaseData.phaseorder) {
      if (!thisPhase.outcome) {
        failedPhase = true;
      }
    }
  });
  const phaseOutcome = phasesOutcome.find(
    (thisPhase) => thisPhase.phase.phaseid == phaseData.phaseid,
  );
  if (phaseOutcome == undefined && failedPhase) {
    return redirect("/", RedirectType.replace);
  }
  const currentDate = new Date(createCurrentTimestamp());
  const startDate = new Date(phaseData.startdate);
  const endDate = new Date(phaseData.enddate);

  if (currentDate < startDate) {
    return redirect("/", RedirectType.replace);
  }

  const isEditable = currentDate >= startDate && currentDate <= endDate;

  const phase_questions = await cached_fetch_phase_questions(phaseData.phaseid);
  let phase_sections = [] as SectionData[];
  let mapQuestions = {} as SectionQuestionsMap;
  if (phaseData.sectionsenabled) {
    phase_sections = await fetch_sections_by_phase(phaseData.phaseid);
    mapQuestions = phase_sections.reduce((map, section) => {
      map[section.sectionid] = phase_questions.filter(
        (question) => question.sectionid === section.sectionid,
      );
      return map;
    }, {} as SectionQuestionsMap);
  }

  const phase_answers = await fetchAllAnswersOfApplication();
  const mandatoryQuestionIds = phase_questions
    .filter((q: Question) => q.mandatory)
    .map((q: Question) => q.questionid);
  const progressBarComponent = (
    <ProgressBar
      progressbarId={phaseData.phaseid}
      mandatoryQuestionIds={mandatoryQuestionIds}
      phaseQuestions={phase_questions}
      endDate={phaseData.enddate}
    />
  );
  return (
    <div className="w-full flex flex-col justify-center items-center">
        <OverviewButton />
        <div className="w-full flex flex-col justify-center max-w-screen-xl">
          <h2 className="p-4 rounded text-secondary">
            <b>
                Bewerbungs-Phase {phaseData.phaseorder + 1}:{" "} {phaseData.phaselabel}
            </b>
          </h2>
          {!isEditable && (
            <div>
              <strong>
                Die Phase ist bereits um, du kannst deine Eingaben nur noch einsehen!
              </strong>
            </div>
          )}
          {progressBarComponent}
          <div className="space-y-4 max-w-screen-xl flex justify-center">
            {phaseData.sectionsenabled ? (
              <SectionView
                phaseData={phaseData}
                mapQuestions={mapQuestions}
                phaseAnswers={phase_answers}
                phaseSections={phase_sections}
                iseditable={isEditable}
              />
            ) : (
              <Questionnaire
                phaseData={phaseData}
                phaseQuestions={phase_questions}
                phaseAnswers={phase_answers}
                iseditable={isEditable}
                selectedSection={null}
                selectedCondChoice={null}
              />
            )}
          </div>
          {progressBarComponent}
          <MissingQuestions phaseQuestions={phase_questions} />
        </div>
        <OverviewButton />
      </div>
  );
}

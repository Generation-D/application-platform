import { RedirectType, redirect } from "next/navigation";

import { fetchAllAnswersOfApplication } from "@/actions/answers/answers";
import { fetch_answer_table } from "@/actions/phase";
import Apl_Header from "@/components/header";
import OverviewButton from "@/components/overviewButton";
import { ProgressBar } from "@/components/progressbar";
import Questionnaire from "@/components/questions";
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
  console.log("");
  console.log("Phasename: " + phaseName);

  const phaseData = await cached_fetch_phase_by_name(phaseName);
  const currentDate = new Date(createCurrentTimestamp());
  const startDate = new Date(phaseData.startdate);
  const endDate = new Date(phaseData.enddate);

  if (currentDate < startDate) {
    console.log("Phase didn't start yet");
    return redirect("/", RedirectType.replace);
  }

  const isEditable = currentDate >= startDate && currentDate <= endDate;
  const phase_questions = await cached_fetch_phase_questions(phaseData.phaseid);

  const phase_answers = await fetchAllAnswersOfApplication();
  const mandatoryQuestionIds = phase_questions
    .filter((q) => q.mandatory)
    .map((q) => q.questionid);
  const already_answered = await fetch_answer_table(mandatoryQuestionIds);
  return (
    <span className="w-full">
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <OverviewButton />
        <div>
          <h2 className="p-4 rounded text-secondary">
            <b>
              Bewerbungs-Phase {phaseData.phaseorder + 1}: {phaseData.phaselabel}
            </b>
          </h2>
          {!isEditable && (
            <div>
              <strong>
                Die Phase ist bereits um, du kannst deine Eingaben nur noch
                einlesen!
              </strong>
            </div>
          )}
          <ProgressBar
            progressbarId={`${phaseData.phaseid}-top`}
            mandatoryQuestionIds={mandatoryQuestionIds}
            numAnswers={already_answered}
            endDate={phaseData.enddate}
          />
          <div className="space-y-4 max-w-screen-xl">
            <Questionnaire
              phaseData={phaseData}
              phaseQuestions={phase_questions}
              phaseAnswers={phase_answers}
              iseditable={isEditable}
            />
          </div>
          <ProgressBar
            progressbarId={`${phaseData.phaseid}-bottom`}
            mandatoryQuestionIds={mandatoryQuestionIds}
            numAnswers={already_answered}
            endDate={phaseData.enddate}
          />
        </div>
        <OverviewButton />
      </div>
    </span>
  );
}

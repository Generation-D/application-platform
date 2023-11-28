import Logger from "@/logger/logger";
import Apl_Header from "@/components/header";
import getOverviewPageText from "@/utils/getMarkdownText";
import { fetch_all_phases, fetch_all_questions, fetch_answer_table } from "@/actions/phase";
import PhaseOverview from "@/components/phaseOverview";

export default async function Home() {
  const log = new Logger("Overview Page");
  const contentHtml = await getOverviewPageText();
  const phasesData = await fetch_all_phases();
  const phase_questions = await fetch_all_questions();

  const mandatoryQuestions = phase_questions.filter((q) => q.mandatory)
  
  const already_answered = await fetch_answer_table(mandatoryQuestions.map((q) => q.phaseid));
  return (
    <>
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
      {phasesData
        .sort((a, b) => a.phaseorder - b.phaseorder)
        .map(async (phase) => {
          const mandatoryPhaseQuestionIds = mandatoryQuestions.filter((q) => (q.phaseid == phase.phaseid)).map((q) => q.questionid)
          const alreadyAnsweredPhaseQuestions = await fetch_answer_table(mandatoryPhaseQuestionIds);
          return (
            <PhaseOverview
              key={phase.phaseid}
              phaseName={phase.phasename}
              phaseStart={phase.startdate}
              phaseEnd={phase.enddate}
              mandatoryQuestionIds={mandatoryPhaseQuestionIds}
              numAnswers={alreadyAnsweredPhaseQuestions}
            />
          );
        })}
    </>
  );
}

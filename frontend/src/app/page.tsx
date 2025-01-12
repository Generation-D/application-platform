import { fetchAllAnswersOfApplication } from "@/actions/answers/answers";
import { fetch_all_phases, fetch_phases_status } from "@/actions/phase";
import ApplicationOverview from "@/components/applicationOverview";
import Apl_Header from "@/components/layout/header";
import { Question } from "@/components/questions";
import Logger from "@/logger/logger";
import { cached_fetch_phase_questions } from "@/utils/cached";
import getOverviewPageText from "@/utils/getMarkdownText";
import "github-markdown-css/github-markdown-light.css";

export default async function Home() {
  const log = new Logger("Overview Page");
  log.debug("Render Overview Page");
  const contentHtml = await getOverviewPageText();
  const phasesData = await fetch_all_phases();
  const phasesOutcome = await fetch_phases_status();
  const phasesQuestions: Record<string, Question[]> = {};
  for (const phase of phasesData) {
    phasesQuestions[phase.phaseid] = await cached_fetch_phase_questions(
      phase.phaseid,
    );
  }
  const phaseAnswers = await fetchAllAnswersOfApplication();

  return (
    <>
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <style>
          {`
            .markdown-body ul {
                list-style-type: disc;
            }
            .markdown-body ol {
                list-style-type: decimal;
            }
            .markdown-body ul ul {
                list-style-type: circle;
            }
            .markdown-body ol ul {
                list-style-type: disc;
            }
            .markdown-body ul ol {
                list-style-type: lower-roman;
            }
            .markdown-body ol ol {
                list-style-type: lower-alpha;
            }
          `}
        </style>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
      <ApplicationOverview
        phasesData={phasesData}
        phasesQuestions={phasesQuestions}
        phaseAnswers={phaseAnswers}
        phasesOutcome={phasesOutcome}
      />
    </>
  );
}

import { fetchAllAnswersOfApplication } from "@/actions/answers/answers";
import { fetch_all_phases, fetch_phases_status } from "@/actions/phase";
import InternalHeader from "@/components/layout/internalHeader";
import OverviewButton from "@/components/overviewButton";
import { Question } from "@/components/questions";
import ViewerApplicationOverview from "@/components/viewerApplicationOverview";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { cached_fetch_phase_questions } from "@/utils/cached";

export default async function Application({
  params,
}: Readonly<{
  params: Promise<{ application_id: string }>;
}>) {
  const { application_id } = await params;

  const supabase = await getSupabaseCookiesUtilClient();

  const { data, error } = await supabase.from("application_table").select("userid").eq("applicationid", application_id).single()
  if (error) {
    return <>{error.message}</>
  }

  const phasesData = await fetch_all_phases();
  const phasesOutcome = await fetch_phases_status(data.userid);
  const phasesQuestions: Record<string, Question[]> = {};
  for (const phase of phasesData) {
    phasesQuestions[phase.phaseid] = await cached_fetch_phase_questions(
      phase.phaseid,
    );
  }

  const phaseAnswers = await fetchAllAnswersOfApplication(application_id);

  console.log(phasesOutcome)

  return (
    <>
      <InternalHeader />
      <OverviewButton slug="review/applications" text="Zu allen Bewerbungen" />
      <h1>Bewerbung</h1>
      <div>ID: {application_id}</div>
      <ViewerApplicationOverview
        phasesData={phasesData}
        phasesQuestions={phasesQuestions}
        phaseAnswers={phaseAnswers}
        phasesOutcome={phasesOutcome}
        applicationid={application_id}
      />
    </>
  );
}

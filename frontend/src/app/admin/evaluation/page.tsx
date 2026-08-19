import { fetchEvaluationDashboardData } from "@/actions/evaluation";
import EvaluationWorkflow from "@/components/admin/evaluationWorkflow";
import InternalHeader from "@/components/layout/internalHeader";
import OverviewButton from "@/components/overviewButton";

export default async function EvaluationPage() {
  const data = await fetchEvaluationDashboardData();

  return (
    <div className="w-full">
      <InternalHeader />
      <OverviewButton slug="admin" text="<- Admin-Übersicht" />
      <h1 className="mt-6 text-2xl font-bold">Bewertungsprozess</h1>
      <p className="mt-2 text-sm text-gray-600">
        Matching erstellen, Bewerter informieren und die Phase abschließen.
      </p>
      <EvaluationWorkflow data={data} />
    </div>
  );
}

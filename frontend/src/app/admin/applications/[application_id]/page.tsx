import { fetch_all_phases, fetch_phases_status } from "@/actions/phase";
import OverviewButton from "@/components/overviewButton";
import Link from "next/link";

export default async function Application({
  params,
}: Readonly<{
  params: Promise<{ application_id: string }>;
}>) {
  const {application_id} = await params

  const phasesData = await fetch_all_phases();
  const phasesOutcome = await fetch_phases_status();

  return <>
    <OverviewButton slug="admin/applications"/>
    <h1>Application {application_id}</h1>

    <ul>
      { phasesData.map(phase => <li key={phase.phaseid}><Link href={`/admin/applications/${application_id}/${phase.phasename}`}>{phase.phasename}</Link></li>)}
    </ul>
  </>
}
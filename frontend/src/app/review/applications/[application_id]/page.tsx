import { fetch_all_phases } from "@/actions/phase";
import InternalHeader from "@/components/layout/internalHeader";
import OverviewButton from "@/components/overviewButton";
import Link from "next/link";

export default async function Application({
  params,
}: Readonly<{
  params: Promise<{ application_id: string }>;
}>) {
  const { application_id } = await params;

  const phasesData = await fetch_all_phases();
  // const phasesOutcome = await fetch_phases_status();

  return (
    <>
      <InternalHeader />
      <OverviewButton slug="admin/applications" />
      <h1>Bewerbung</h1>
      <div>ID: {application_id}</div>
      {/* <div></div> */}
      <h2>Phasen</h2>
      <div>
        {phasesData.map((phase) => (
            <Link
              key={phase.phaseid}
              href={`/review/applications/${application_id}/${phase.phasename}`}
            >
              {phase.phasename}
            </Link>
        ))}
      </div>
    </>
  );
}

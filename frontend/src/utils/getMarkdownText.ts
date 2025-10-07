import { extractCurrentPhase, fetch_phases_status } from "@/actions/phase";
import { createCurrentTimestamp } from "./helpers";
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";

const supabase = getSupabaseBrowserClient();

export default async function getOverviewPageText() {
  const currentTime = new Date(createCurrentTimestamp());
  const currentPhase = await extractCurrentPhase(currentTime);
  const phases_status = await fetch_phases_status();
  phases_status.sort((a, b) => b.phase.phaseorder - a.phase.phaseorder);
  const last_phase_status = phases_status[0];
  let markdownKey: string;

  if (currentPhase.phaseorder == -1) {
    markdownKey = 'welcome.md';
  } else if (
    last_phase_status !== undefined &&
    last_phase_status.outcome == false &&
    last_phase_status.phase.finished_evaluation != null &&
    currentPhase.phaseid != last_phase_status.phase.phaseid
  ) {
    markdownKey = `${last_phase_status.phase.phasename}/failed.md`;
  } else if (new Date(currentPhase.enddate) >= currentTime) {
    markdownKey = `${currentPhase.phasename}/ongoing.md`;
  } else if (currentPhase.finished_evaluation == null) {
    markdownKey = `${currentPhase.phasename}/evaluating.md`;
  } else if (last_phase_status.outcome == false) {
    markdownKey = `${currentPhase.phasename}/failed.md`;
  } else if (last_phase_status.outcome == true) {
    markdownKey = `${currentPhase.phasename}/passed.md`;
  } else {
    markdownKey = 'error.md';
  }

  const { data, error } = await supabase
    .from('phase_texts')
    .select('html_content')
    .eq('path', markdownKey)
    .single();

  if (error) {
    console.error('❌ Failed to fetch text:', error.message);
  }

  if (data?.html_content) return data.html_content;

  const fallback = await supabase
    .from('phase_texts')
    .select('html_content')
    .eq('path', 'error.md')
    .single();

  return fallback.data?.html_content ?? '<p>Unknown error</p>';
}

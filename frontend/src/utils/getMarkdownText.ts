import { extractCurrentPhase, fetch_phases_status } from "@/actions/phase";
import { createCurrentTimestamp } from "./helpers";
import { createLogger } from "@/logger/logger";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { overviewTextPath } from "./overviewTextPath";

const log = createLogger("utils/getMarkdownText");

export default async function getOverviewPageText() {
  const supabase = await getSupabaseCookiesUtilClient();
  const currentTime = new Date(createCurrentTimestamp());
  const currentPhase = await extractCurrentPhase(currentTime);
  const phases_status = await fetch_phases_status();
  const markdownKey = overviewTextPath(
    currentPhase,
    phases_status,
    currentTime,
  );

  const { data, error } = await supabase
    .from("phase_texts")
    .select("html_content")
    .eq("path", markdownKey)
    .single();

  if (error) {
    log.error(`Failed to fetch text:, ${error.message}`);
  }

  if (data?.html_content) return data.html_content;

  const fallback = await supabase
    .from("phase_texts")
    .select("html_content")
    .eq("path", "error.md")
    .single();

  if (fallback.data?.html_content) return fallback.data.html_content;

  log.error("Failed to fetch fallback");

  return "<p>Unknown error</p>";
}

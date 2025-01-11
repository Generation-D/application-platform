import { NextResponse } from "next/server";

import Logger from "@/logger/logger";
import { getURL } from "@/utils/helpers";
import { initSupabaseRouteNew } from "@/utils/supabaseServerClients";

const log = new Logger("auth/admin/callback/route");

export async function GET() {
  const options: { redirectTo: string; scopes?: string } = {
    redirectTo: `${getURL()}/auth/admin/callback`,
  };

  const supabase = await initSupabaseRouteNew();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "slack",
    options,
  });

  if (error) {
    log.error(JSON.stringify(error));
    throw error;
  }

  return NextResponse.redirect(data.url);
}

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import Logger from "@/logger/logger";
import { getURL } from "@/utils/helpers";
import { initSupabase } from "@/utils/supabaseServerClients";

const log = new Logger("auth/callback/route");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "";

  if (code) {
    const supabase = await initSupabase();
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      log.error(JSON.stringify(error));
      return NextResponse.redirect(`${getURL()}`);
    }
  }
  return NextResponse.redirect(`${getURL()}${next}`);
}

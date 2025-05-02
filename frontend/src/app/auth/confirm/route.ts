import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import Logger from "@/logger/logger";
import { getURL } from "@/utils/helpers";
import { initSupabase } from "@/utils/supabaseServerClients";

const log = new Logger("auth/callback/route");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType;
  const next = searchParams.get("next") ?? "";

  if (token_hash && type) {
    const supabase = await initSupabase();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (error) {
      // TODO: return the user to an error page with some instructions
      log.error(JSON.stringify(error));
    }
  }

  return NextResponse.redirect(`${getURL()}${next}`);
}

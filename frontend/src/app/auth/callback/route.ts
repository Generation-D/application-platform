import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await getSupabaseCookiesUtilClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}`);
    }
  }

  return NextResponse.redirect(`${origin}/review/login?error=auth-failed`);
}

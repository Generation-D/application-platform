import { NextRequest, NextResponse } from "next/server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { getURL, safeRelativePath } from "@/utils/helpers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = safeRelativePath(searchParams.get("next"));

  if (code) {
    const supabase = await getSupabaseCookiesUtilClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${getURL()}${next}`);
    }
  }

  return NextResponse.redirect(`${getURL()}login?error=auth-failed`);
}

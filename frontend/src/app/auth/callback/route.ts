import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import {logger} from "@/logger/logger";
import { getURL } from "@/utils/helpers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "";

  if (code) {
    const supabase = await getSupabaseCookiesUtilClient();
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      logger.error(JSON.stringify(error));
      return NextResponse.redirect(`${getURL()}`);
    }
  }
  return NextResponse.redirect(`${getURL()}${next}`);
}

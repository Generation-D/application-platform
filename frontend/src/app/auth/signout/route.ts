import { NextResponse } from "next/server";

import { getURL } from "@/utils/helpers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

export async function POST() {
  const supabase = await getSupabaseCookiesUtilClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(`${getURL()}login`, {
    status: 302,
  });
}

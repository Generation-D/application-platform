import { NextResponse } from "next/server";

import { getURL } from "@/utils/helpers";
import { initSupabaseRoute } from "@/utils/supabaseServerClients";

export async function POST() {
  const supabase = await initSupabaseRoute();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(`${getURL()}/login`, {
    status: 302,
  });
}

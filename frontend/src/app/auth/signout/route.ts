import { NextResponse } from "next/server";

import { getURL } from "@/utils/helpers";
import { initSupabase } from "@/utils/supabaseServerClients";

export async function POST() {
  const supabase = await initSupabase();

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

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import Logger from "@/logger/logger";
import { getURL } from "@/utils/helpers";
import {
  initSupabase,
  supabaseServiceRole,
} from "@/utils/supabaseServerClients";

const log = new Logger("auth/admin/callback/route");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  let subdomain = "";
  if (code) {
    const supabase = await initSupabase();
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      log.error(JSON.stringify(error));
      return NextResponse.redirect(`${getURL()}`);
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: roleData, error: roleError } = await supabase
      .from("user_profiles_table")
      .select("*")
      .eq("userid", user!.id)
      .single();

    if (roleError) {
      if (roleError.code == "PGRST116") {
        log.debug("User has no Role yet");
      } else {
        log.error(JSON.stringify(roleError));
      }
    }
    if (!roleData) {
      const { error: userProfileError } = await supabaseServiceRole
        .from("user_profiles_table")
        .insert({ userid: user!.id, userrole: 2, isactive: true });
      if (userProfileError) {
        log.error(JSON.stringify(userProfileError));
      } else {
        log.debug("Created Reviewer Role");
      }
      subdomain = "review";
    } else if (!roleData.isactive) {
      subdomain = "403";
      await supabase.auth.signOut();
    } else if (roleData.userrole == 2) {
      subdomain = "review";
    } else if (roleData.userrole == 3) {
      subdomain = "admin";
    }
  }
  log.debug(`Auth/Admin/Callback Redirect To: ${getURL()}${subdomain}`);

  return NextResponse.redirect(`${getURL()}${subdomain}`);
}

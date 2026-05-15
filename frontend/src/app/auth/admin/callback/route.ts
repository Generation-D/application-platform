import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { logger } from "@/logger/logger";
import { getURL } from "@/utils/helpers";
import {
  getSupabaseCookiesUtilClient,
  getSupabaseCookiesUtilClientAdmin,
} from "@/supabase-utils/cookiesUtilClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  let subdomain = "";
  if (code) {
    const supabase = await getSupabaseCookiesUtilClient();
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      logger.error(JSON.stringify(error));
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
        logger.debug("User has no Role yet");
      } else {
        logger.error(JSON.stringify(roleError));
      }
    }
    if (!roleData) {
      const supabaseAdmin = await getSupabaseCookiesUtilClientAdmin();
      const { error: userProfileError } = await supabaseAdmin
        .from("user_profiles_table")
        .insert({ userid: user!.id, userrole: 2, isactive: true });
      if (userProfileError) {
        logger.error(JSON.stringify(userProfileError));
      } else {
        logger.debug("Created Reviewer Role");
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
  logger.debug(`Auth/Admin/Callback Redirect To: ${getURL()}${subdomain}`);

  return NextResponse.redirect(`${getURL()}${subdomain}`);
}

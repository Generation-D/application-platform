"use client";

import { useEffect } from "react";

import { createLogger } from "@/logger/logger"; 
const log = createLogger("app/403");
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";

const Custom403: React.FC = () => {
  useEffect(() => {
    const signOut = async () => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        log.error(JSON.stringify(error));
      }
    };
    signOut();
  });
  return (
    <div>
      Dein Account wurde deaktiviert! Bitte wende dich an
      it-ressort@generation-d.org für weitere Fragen.
    </div>
  );
};

export default Custom403;

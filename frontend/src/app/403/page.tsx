"use client";

import { useEffect } from "react";

import Logger from "@/logger/logger";
import { supabase } from "@/utils/supabaseBrowserClient";

const log = new Logger("Custom403");

const Custom403: React.FC = () => {
  useEffect(() => {
    const signOut = async () => {
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

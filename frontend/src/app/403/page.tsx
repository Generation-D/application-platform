import { initSupabaseActions } from "@/utils/supabaseServerClients";
import Logger from "@/logger/logger";

const log = new Logger("Custom403");

const Custom403: React.FC = async () => {
  const supabase = initSupabaseActions();
  const error = await supabase.auth.signOut();
  if (error) {
    log.error(JSON.stringify(error));
  }
  return (
    <div>
      Dein Account wurde deaktiviert! Bitte wende dich an
      it-ressort@generation-d.org für weitere Fragen.
    </div>
  );
};

export default Custom403;

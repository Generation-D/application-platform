import { fetch_first_phase_over } from "@/actions/phase";
import { LoginComponent } from "@/components/login";

export default async function Login() {
  const signUpPossible = await fetch_first_phase_over();
  return <LoginComponent signUpPossible={signUpPossible} />;
}

import { fetch_first_phase_over } from "@/actions/phase";
import Apl_Footer from "@/components/layout/footer";
import { LoginComponent } from "@/components/login";

export default async function Login() {
  const signUpPossible = await fetch_first_phase_over();
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-grow">
        <div className="flex items-center justify-center m-12">
          <div className="flex flex-col rounded-lg items-center justify-center bg-white p-8 border-solid border-2 border-grey-500">
            <LoginComponent signUpPossible={signUpPossible} />
          </div>
        </div>
      </div>
      <Apl_Footer />
    </div>
  );
}

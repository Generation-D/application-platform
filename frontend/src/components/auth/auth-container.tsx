"use client";

import { useState } from "react";
import SignInForm from "../forms/signin-form";
import SignUpForm from "../forms/signup-form";

interface AuthContainerProps {
  signUpPossible: boolean;
}

export default function AuthContainer({ signUpPossible }: AuthContainerProps) {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      {!signUpPossible && (
        <div className="mb-6 text-center text-sm text-gray-600 bg-gray-50 p-4 rounded">
          Die erste Bewerbungsphase ist bereits vorbei und es können keine
          weiteren Accounts erstellt werden. Wir freuen uns auf eure Bewerbung
          im nächsten Jahr. Für weitere Informationen bitte besucht unsere
          Webseite. Der Login ist weiterhin möglich!
        </div>
      )}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-2 w-full gap-2">
          <button
            onClick={() => setIsSignIn(true)}
            className={`py-2 px-4 text-center rounded-lg transition-colors ${
              isSignIn
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => signUpPossible && setIsSignIn(false)}
            disabled={!signUpPossible}
            className={`py-2 px-4 text-center rounded-lg transition-colors ${
              !isSignIn && signUpPossible
                ? "bg-primary text-white"
                : !signUpPossible
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={
              !signUpPossible
                ? "Die Registrierung ist derzeit nicht möglich"
                : ""
            }
          >
            Registrieren
          </button>
        </div>
      </div>

      <div className="mt-6">
        {isSignIn || !signUpPossible ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  );
}

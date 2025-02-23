"use client";
import { ChangeEvent, useState } from "react";

import Link from "next/link";
import { useFormState } from "react-dom";

import { signUpUser } from "@/actions/auth";
import { Turnstile } from "@marsidev/react-turnstile";

import PasswordRequirementsComponent from "../passwordRequirements";
import { SubmitButton } from "../submitButton";

interface messageType {
  message: string;
  status: string;
}

const initialState: messageType = {
  message: "",
  status: "",
};

export default function SignUpForm() {
  const [state, formAction] = useFormState(signUpUser, initialState);
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <h2>Registriere dich!</h2>
      <form
        action={formAction}
        className="space-y-6"
        onSubmit={(e) => {
          // Prevent credentials from appearing in URL
          if (window.location.search) {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formAction(formData);
          }
        }}
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Passwort
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            onChange={(e) => handlePasswordChange(e)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <PasswordRequirementsComponent password={password} />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Passwort bestätigen
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <input
            type="checkbox"
            id="confirm-legal"
            name="confirm-legal"
            required
            className="w-5 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-secondary focus:ring-2"
          />
          <label htmlFor="confirm-legal" className="text-sm text-gray-700">
            <span className="text-red-500">*</span>Ich habe die{" "}
            <Link
              className="underline"
              href="https://generation-d.org/legal/"
              target="_blank"
            >
              Datenschutzerklärung
            </Link>{" "}
            gelesen und stimme dieser zu!
          </label>
        </div>
        <div
          className={`italic ${
            state?.status == "SUCCESS" ? "text-green-600" : "text-red-600"
          }`}
        >
          {state?.message}
        </div>

        <div className="flex justify-center mx-auto">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => {
              setCaptchaToken(token);
            }}
            options={{
              theme: "light",
              language: "de"
            }}
          />
        </div>

        <input type="hidden" name="captcha" id="captcha" value={captchaToken} />

        <div className={`${captchaToken ? "" : "hidden"}`}>
          <SubmitButton text={"Registrieren"} expanded={true} />
        </div>
      </form>
    </div>
  );
}

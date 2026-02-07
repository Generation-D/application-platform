"use client";

import { useRef, useState, useEffect } from "react";
import { useActionState } from "react";
import { signInUser } from "@/actions/auth";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import ForgottenPasswordForm from "./forgottenpassword-form";
import Popup from "../layout/popup";
import { SubmitButton } from "../submitButton";
import { getPublicEnv } from "@/utils/env";

interface messageType {
  message: string;
  email: string;
}

const initialState: messageType = {
  message: "",
  email: "",
};

export default function SignInForm() {
  const [state, formAction] = useActionState(signInUser, initialState);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>("");
  const [email, setEmail] = useState("");
  const ref = useRef<TurnstileInstance>(null);

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  // Reset Turnstile on failed sign-in
  useEffect(() => {
    if (state?.message) {
      ref.current?.reset();
      setCaptchaToken(""); // Clear captcha token to disable the button
    }
  }, [state]);

  return (
    <div>
      {isPopupOpen && (
        <Popup onClose={togglePopup}>
          <ForgottenPasswordForm />
        </Popup>
      )}
      <form
        action={formAction}
        className="space-y-4"
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-0">
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={togglePopup}
            className="px-1 text-secondary"
          >
            Passwort vergessen?
          </button>
        </div>
        <div className="text-red-600 italic">{state?.message}</div>

        <div className="flex justify-center mx-auto">
          <Turnstile
            ref={ref}
            siteKey={getPublicEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY") || "1x00000000000000000000AA"}
            onSuccess={(token) => setCaptchaToken(token)}
            onExpire={() => {
              ref.current?.reset();
              setCaptchaToken("");
            }}
            onError={() => {
              ref.current?.reset();
              setCaptchaToken("");
            }}
            options={{
              theme: "light",
              language: "de",
            }}
          />
        </div>

        <input type="hidden" name="captcha" id="captcha" value={captchaToken} />

        <div className={`${captchaToken ? "" : "hidden"}`}>
          <SubmitButton text={"Bestätigen"} expanded={true} />
        </div>
      </form>
    </div>
  );
}

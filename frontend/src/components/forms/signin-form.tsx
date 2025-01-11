"use client";

import { useState } from "react";

import { useActionState } from "react";

import { signInUser } from "@/actions/auth";

import ForgottenPasswordForm from "./forgottenpassword-form";
import Popup from "../layout/popup";
import { SubmitButton } from "../submitButton";

interface messageType {
  message: string;
}

const initialState: messageType = {
  message: "",
};

export default function SignInForm() {
  const [state, formAction] = useActionState(signInUser, initialState);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      {isPopupOpen && (
        <Popup onClose={togglePopup}>
          <ForgottenPasswordForm />
        </Popup>
      )}
      <form action={formAction} className="space-y-4">
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
        <div>
          <SubmitButton text={"Bestätigen"} expanded={true} />
        </div>
      </form>
    </div>
  );
}

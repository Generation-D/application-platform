"use client";

import { ChangeEvent, useState } from "react";

import { useActionState } from "react";

import { updatePassword } from "@/actions/auth";

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

export default function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePassword, initialState);
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <h2>Update dein Passwort!</h2>
      <form action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Neues Passwort
          </label>
          <input
            id="new_password"
            type="password"
            name="new_password"
            required
            onChange={(e) => handlePasswordChange(e)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <PasswordRequirementsComponent password={password} />
        <div>
          <label
            htmlFor="reenter_password"
            className="block text-sm font-medium text-gray-700"
          >
            Neues Passwort bestätigen
          </label>
          <input
            type="password"
            id="reenter_password"
            name="reenter_password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div
          className={`italic ${
            state?.status == "SUCCESS" ? "text-green-600" : "text-red-600"
          }`}
        >
          {state?.message}
        </div>
        <SubmitButton text={"Passwort updaten"} expanded={true} />
      </form>
    </div>
  );
}

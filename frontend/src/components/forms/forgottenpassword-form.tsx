"use client";
import React, { useState, useEffect } from "react";

import { useFormState } from "react-dom";

import { sendResetPasswordLink } from "@/actions/auth";

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
  const [state, formAction] = useFormState(sendResetPasswordLink, initialState);
  const [timer, setTimer] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setButtonVisible(true);
    }

    return () => clearTimeout(countdown);
  }, [timer]);

  const handleSubmit = () => {
    setButtonVisible(false);
    setTimer(30);
  };

  return (
    <div>
      <h2>Setze dein Passwort zurück</h2>
      <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
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
        <div
          className={`italic ${
            state?.status == "SUCCESS" ? "text-green-600" : "text-red-600"
          }`}
        >
          {state?.message}
        </div>
        <div>
          {buttonVisible ? (
            <SubmitButton
              text={`${state?.message == "" ? "Bestätigen" : "Erneut senden"}`}
              expanded={false}
            />
          ) : (
            <p>Erneut senden erst in {timer}s möglich!</p>
          )}
        </div>
      </form>
    </div>
  );
}

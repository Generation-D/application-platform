"use client";

import { useEffect, useState } from "react";

import { useActionState } from "react";

import { sendResetPasswordLinkFromSettings } from "@/actions/auth";

import { SubmitButton } from "../submitButton";

export default function SendPasswordResetForm({ email }: { email: string }) {
  const initialState = {
    email: email,
    message: "",
    status: "",
  };
  const [state, formAction] = useActionState(
    sendResetPasswordLinkFromSettings,
    initialState,
  );
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
    <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
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
            text={`${
              state?.message == "" ? "Link senden" : "Link erneut senden"
            }`}
            expanded={false}
          />
        ) : (
          <p>Erneut senden erst in {timer}s möglich!</p>
        )}
      </div>
    </form>
  );
}

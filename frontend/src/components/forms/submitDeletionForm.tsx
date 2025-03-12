"use client";

import { FormEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import { deleteUser } from "@/actions/auth";
import { RESET_STATE } from "@/store/actionTypes";
import { useAppDispatch } from "@/store/store";
import { supabase } from "@/supabase-utils/browserClient";

interface messageType {
  message: string;
  status: string;
}

const initialState: messageType = {
  message: "",
  status: "",
};

export default function SubmitDeletionForm({
  email,
}: {
  email: string | null;
}) {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<messageType>(initialState);
  const [countdown, setCountdown] = useState<number>(-1);
  const [countdownMessage, setCountdownMessage] = useState<string>("");
  const { pending } = useFormStatus();
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      setCountdownMessage(
        `Du wirst in ${countdown}s automatisch auf unsere Loginseite weitergeleitet!`,
      );
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      supabase.auth.signOut();
      router.push("/login");
    }

    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: RESET_STATE });
    const new_state = await deleteUser();
    if (new_state.status == "SUCCESS") {
      setCountdown(10);
    }
    setState(new_state);
  };

  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <h4 className="py-2 text-xl mb-3">Löschen bestätigen</h4>
        <div>
          Bist du dir sicher, dass du den folgenden User löschen willst?
        </div>
        <div>{email}</div>
        <div>Dies ist endgültig und kann nicht wiederhergestellt werden!</div>
        <div
          className={`italic ${
            state?.status == "SUCCESS" ? "text-green-600" : "text-red-600"
          }`}
        >
          {state?.message} {state.status === "SUCCESS" && countdownMessage}
        </div>
        <button
          disabled={pending}
          aria-disabled={pending}
          type="submit"
          className="apl-alert-button-fixed mt-3"
        >
          {pending ? "Bitte warten..." : "Account löschen"}
        </button>
      </form>
    </div>
  );
}

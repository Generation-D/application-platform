"use client";

import { FormEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import { deleteUser } from "@/actions/auth";
import { RESET_STATE } from "@/store/actionTypes";
import { useAppDispatch } from "@/store/store";
import { supabase } from "@/utils/supabaseBrowserClient";
import { checkRelevanceOfUser } from "@/actions/phase";

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

  const [isPartOfCompetition, setIsPartOfCompetition] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

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

  useEffect(() => {
    const checkCompetitionStatus = async () => {
      const isRelevant = await checkRelevanceOfUser()
      setIsPartOfCompetition(isRelevant);
    };
    checkCompetitionStatus();
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: RESET_STATE });
    const new_state = await deleteUser(isRelevant, reason);
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
        <div className="font-semibold">{email}</div>
        <div>Dies ist endgültig und kann nicht wiederhergestellt werden!</div>
        {isPartOfCompetition && (
          <div className="text-red-600">
            Der Wettbewerb ist noch in vollem Gange und du bist noch Teil davon. Mit der Löschung dieses Users schließt du dich automatisch aus!
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="reason" className="block text-secondary py-3">
            Grund für das Löschen des Users an (optional):
          </label>
          <input
            type="text"
            name="reason"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
          />
        </div>
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

"use client";
import Image from "next/image";
import { useFormState } from "react-dom";

import { signInWithMagicLink } from "@/actions/auth";

export default function AdminLogin() {
  const [state, formAction] = useFormState(signInWithMagicLink, null);
  return (
    <div className="flex flex-col">
      <form action={"/auth/slack"} method="GET">
        <button
          type="submit"
          className="apl-button-fixed-big flex items-center"
        >
          <Image
            src="/logos/slack.png"
            width={30}
            height={30}
            alt="Slack Image Logo"
            className="max-w-50 max-h-50"
          />
          <strong className="ml-2">Login mit Slack</strong>
        </button>
      </form>
      {/*<form action={formAction}>
        <input
          type="text"
          name="magicLinkEmail"
          id="magicLinkEmail"
          className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
          required={true}
        />
        <button
          type="submit"
          className="apl-button-fixed-big flex items-center"
        >
          <strong className="ml-2">Login mit Magic Link</strong>
        </button>
  </form>*/}
    </div>
  );
}

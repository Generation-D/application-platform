"use client";
import Image from "next/image";

import { signInWithMagicLink } from "@/actions/auth";
import { useActionState } from "react";

export default function Home() {
  const [state, formAction] = useActionState(signInWithMagicLink, null);
  return (
    <main className="grid-cols-1 flex flex-col items-center justify-between space-y-6">
      <Image
        src="/logos/gend_img.png"
        width={80}
        height={80}
        alt="Generation-D Image Logo"
        className="max-w-50 max-h-50"
      />
      <h1 className="text-4xl text-secondary md:text-5xl text-center">
        Generation-D Internal Login
      </h1>
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
    </main>
  );
}

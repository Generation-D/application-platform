"use client";
import Image from "next/image";

import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import Link from "next/link";

const supabase = getSupabaseBrowserClient();

export default function Home() {
  async function signInWithSlack() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "slack_oidc",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL!}/auth/callback`,
      },
    });

    if (error) {
      console.error("Login failed:", error.message);
    }
  }

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
      {/* <form action={"/auth/slack"} method="GET"> */}
      {/* <form> */}
      <button
        // type="submit"
        onClick={signInWithSlack}
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

      <div className="text-center text-sm text-gray-500 mt-4 space-y-1">
        <p>
          Hinweis: Dieser Bereich ist ausschließlich für den internen Login.
        </p>
        <p>
          <Link href="/login" className="text-secondary underline">
            Hier geht es zum regulären Login
          </Link>
        </p>
      </div>
      {/* </form> */}
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

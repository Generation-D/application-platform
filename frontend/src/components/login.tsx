"use client";

import { useState } from "react";

import Image from "next/image";

import AuthContainer from "@/components/auth/auth-container";

export const LoginComponent: React.FC<{ signUpPossible: boolean }> = ({
  signUpPossible,
}) => {
  return (
    <>
      <Image
        src="/logos/gend_img.png"
        width={80}
        height={80}
        alt="Generation-D Image Logo"
        className="max-w-50 max-h-50 items-center"
      />
      <h1 className="md:text-5xl text-4xl text-secondary justify-center text-center">
        Generation-D Bewerbung
      </h1>
      <AuthContainer signUpPossible={signUpPossible} />
    </>
  );
};

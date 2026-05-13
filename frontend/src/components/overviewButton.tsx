"use client";

import React from "react";

import { useRouter } from "next/navigation";

const OverviewButton: React.FC<{ slug?: string, text?: string }> = ({ slug, text = "<- Zur Startseite" }) => {
  const router = useRouter();
  const handleRedirect = () => {
    if (slug !== undefined) {
      router.push(`/${slug}`);
    } else {
      router.push(`/`);
    }
  };
  return <button onClick={handleRedirect}>{text}</button>;
};

export default OverviewButton;

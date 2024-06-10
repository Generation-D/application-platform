// components/Footer.tsx
import React from "react";

import Link from "next/link";

const Credits: React.FC = () => {
  return (
    <div className="flex flex-row w-full items-center justify-center text-secondary font-nunito text-xs mb-1">
      <Link
        href="https://github.com/Generation-D/application-platform/"
        target="_blank"
        className="m-0 p-0 hover:underline"
      >
        Open Source Projekt
      </Link>
      &nbsp;von&nbsp; <Link
        href="https://generation-d.org"
        target="_blank"
        className="m-0 p-0 hover:underline"
      >Generation-D</Link>
    </div>
  );
};

export default Credits;

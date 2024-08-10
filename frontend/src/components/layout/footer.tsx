// components/Footer.tsx
import React from "react";

import Image from "next/image";
import Link from "next/link";

const Apl_Footer: React.FC = () => {
  return (
    <footer className="bg-primary h-[256px] items-center justify-center space-y-8 mt-4">

      <div className="items-end md:items-center justify-center h-full flex flex-row md:flex-col space-y-8 md:space-x-8">
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-8 space-y-4 md:space-y-0 text-secondary font-nunito">
          <Link
            href="https://generation-d.org/legal/"
            target="_blank"
            className="m-0 p-0"
          >
            Impressum
          </Link>
          <Link
            href="https://generation-d.org/legal/"
            target="_blank"
            className="m-0 p-0"
          >
            Disclaimer
          </Link>
          <Link
            href="https://generation-d.org/legal/"
            target="_blank"
            className="m-0 p-0"
          >
            Datenschutzerklärung
          </Link>
        </div>
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-8 space-y-4 md:space-y-0 ml-3 md:ml-0">
          {/*
          <Link href="https://de-de.facebook.com/GenerationD/" target="_blank"  className="m-0 p-0">
            <Image
              src="/icons/social_media/facebook.svg"
              width={24}
              height={24}
              alt="Facebook"
              className="w-6 h-6"
            />
          </Link>
          */}
          <Link
            href="https://www.instagram.com/generationd_org/?hl=de"
            target="_blank"
            className="m-0 p-0"
          >
            <Image
              src="/icons/social_media/instagram.svg"
              width={24}
              height={24}
              alt="Instagram"
              className="w-6 h-6 m-0 p-0"
            />
          </Link>
          <Link
            href="https://www.linkedin.com/company/generation-d.org?"
            target="_blank"
            className="m-0 p-0"
          >
            <Image
              src="/icons/social_media/linkedin.svg"
              width={24}
              height={24}
              alt="Linked In"
              className="w-6 h-6 m-0 p-0"
            />
          </Link>
          <Link
            href="https://generation-d.org/bewerber/#h-fragen-antworten"
            target="_blank"
            className="m-0 p-0"
          >
            <Image
              src="/icons/social_media/mail.svg"
              width={24}
              height={24}
              alt="Contact"
              className="w-6 h-6 m-0 p-0"
            />
          </Link>
        </div>
        <div className="items-center justify-center text-secondary font-nunito flex flex-col ">
            ©{new Date(Date.now()).getFullYear()} Generation-D. All rights
            reserved.
        </div>
      </div>
    </footer>
  );
};

export default Apl_Footer;

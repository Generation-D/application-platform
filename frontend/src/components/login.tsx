"use client";

import { useState } from "react";

import Image from "next/image";

import SignInForm from "@/components/forms/signin-form";
import SignUpForm from "@/components/forms/signup-form";
import Popup from "@/components/layout/popup";

export const LoginComponent: React.FC<{ signUpPossible: boolean }> = ({
  signUpPossible,
}) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };
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
      {signUpPossible ? (
        <>
          {isPopupOpen && (
            <Popup onClose={togglePopup}>
              <SignUpForm />
            </Popup>
          )}
          <div className="py-12 px-8 max-w-xl bg-[#FFFFFF] text-secondary space-y-4 rounded text-center">
            <button
              type="button"
              onClick={togglePopup}
              className="apl-button-fixed"
            >
              Neues Konto anlegen
            </button>
            <p>Oder loggt euch ein um eure Bewerbung fortzusetzen</p>
          </div>
        </>
      ) : (
        <div className="py-12 px-8 m-2 max-w-xl bg-[#FFFFFF] text-secondary rounded text-center">
          Die erste Bewerbungsphase ist bereits vorbei und es können keine
          weiteren Accounts erstellt werden. Wir freuen uns auf eure Bewerbung
          im nächsten Jahr. Für weitere Informationen bitte besucht unsere
          Webseite.
        </div>
      )}
      <div className="text-left">
        <SignInForm />
      </div>
    </>
  );
};

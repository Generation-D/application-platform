"use client";

import React, { useState } from "react";

type PasswordRequirement = {
  text: string;
  test: (pw: string) => boolean;
};

type PasswordRequirements = {
  minLength: PasswordRequirement;
  maxLength: PasswordRequirement;
  upperCase: PasswordRequirement;
  lowerCase: PasswordRequirement;
  number: PasswordRequirement;
  specialChar: PasswordRequirement;
};

const PasswordRequirementsComponent: React.FC<{ password: string }> = ({
  password,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const passwordRequirements: PasswordRequirements = {
    minLength: { text: "Mindestens 8 Zeichen", test: (pw) => pw.length >= 8 },
    maxLength: { text: "Maximal 72 Zeichen", test: (pw) => pw.length <= 72 },
    upperCase: {
      text: "Mindestens ein großer Buchstabe",
      test: (pw) => /[A-Z]/.test(pw),
    },
    lowerCase: {
      text: "Mindestens ein kleiner Buchstabe",
      test: (pw) => /[a-z]/.test(pw),
    },
    number: { text: "Mindestens eine Zahl", test: (pw) => /[0-9]/.test(pw) },
    specialChar: {
      text: "Mindestens ein Sonderzeichen",
      test: (pw) => /[^A-Za-z0-9]/.test(pw),
    },
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <>
      <h2 id="accordion-collapse-heading">
        <button
          type="button"
          onClick={toggleAccordion}
          aria-expanded={isAccordionOpen}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm rtl:text-right text-gray-500 border ${
            isAccordionOpen && "border-b-0"
          } border-gray-200 focus:ring-4 focus:ring-gray-200`}
          data-accordion-target="#accordion-collapse-body"
          aria-controls="accordion-collapse-body"
        >
          <span className="italic">
            Klicken, um Passwortanforderungen anzuzeigen
          </span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 shrink-0 ${isAccordionOpen && "rotate-180"}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id="accordion-collapse-body"
        className={`${isAccordionOpen ? "" : "hidden"}`}
        aria-labelledby="accordion-collapse-heading"
      >
        <ul className="p-5 border border-gray-200">
          {Object.keys(passwordRequirements).map((key) => {
            const requirementKey = key as keyof PasswordRequirements;
            const requirement = passwordRequirements[requirementKey];
            const isSatisfied = requirement.test(password);
            return (
              <li
                key={key}
                className={`italic ${
                  password.length == 0
                    ? "text-gray-500"
                    : isSatisfied
                      ? "text-green-600"
                      : "text-red-600"
                }`}
              >
                - {requirement.text}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default PasswordRequirementsComponent;

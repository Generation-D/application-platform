"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { RESET_STATE } from "@/store/actionTypes";
import { toggle } from "@/store/slices/menuSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { SubmitButton } from "../submitButton";

const Apl_Header: React.FC = () => {
  const isMenuOpen = useAppSelector((state) => state.menuReducer.isOpen);
  const dispatch = useAppDispatch();

  function handleSubmit(): void {
    dispatch({ type: RESET_STATE });
  }

  return (
    <div className="w-full bg-primary h-24 flex items-center justify-between p-4 md:p-6">
      <div className="min-w-[20px] max-w-[200px] h-auto">
        <Link href="https://generation-d.org" target="_blank">
          <Image
            src="/logos/gend_img_font.png"
            alt="Generation-D Logo"
            className="max-w-full h-auto"
            priority={true}
            width={200}
            height={34}
            style={{ minWidth: "20px", maxWidth: "200px", maxHeight: "34px" }}
          />
        </Link>
      </div>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => dispatch(toggle())}
          className="p-2 focus:outline-none focus:shadow-outline"
        >
          <div className="block w-6 h-1 bg-secondary rounded-md"></div>
          <div className="block w-6 h-1 bg-secondary my-1.5 rounded-md"></div>
          <div className="block w-6 h-1 bg-secondary rounded-md"></div>
        </button>
      </div>
      <div
        className={`${
          isMenuOpen
            ? "border space-y-2 absolute bg-primary right-10 top-24 z-10 p-4 flex flex-col justify-center"
            : "hidden md:flex items-center"
        } space-x-4`}
      >
        <Link href="https://generation-d.org/faq/" target="_blank">
          <span className="text-secondary block text-center">FAQs</span>
        </Link>
        <Link href="/application/settings">
          <span className="text-secondary block text-center">
            Einstellungen
          </span>
        </Link>
        <form action="/auth/signout" method="post" onSubmit={handleSubmit}>
          <SubmitButton text={"Ausloggen"} expanded={false} />
        </form>
      </div>
    </div>
  );
};

export default Apl_Header;

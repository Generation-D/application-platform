"use client";

import React, { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { User } from "@supabase/supabase-js";

import SendPasswordResetForm from "@/components/forms/sendPasswordReset-form";
import SubmitDeletionForm from "@/components/forms/submitDeletionForm";
import Awaiting from "@/components/layout/awaiting";
import Apl_Header from "@/components/layout/header";
import Popup from "@/components/layout/popup";
import OverviewButton from "@/components/overviewButton";
import { supabase } from "@/utils/supabaseBrowserClient";

const SettingsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data) {
        setUser(data.user);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <span className="w-full">
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <OverviewButton />
        <h1 className="text-2xl font-bold mb-4">Einstellungen</h1>
        {isPopupOpen && (
          <Popup onClose={togglePopup}>
            <SubmitDeletionForm email={user?.email || ""} />
          </Popup>
        )}
        <div>
          <label>Email: {Awaiting(isLoading, user?.email)}</label>
        </div>
        <h3 className="py-2 text-xl">Ändere dein Passwort</h3>
        <div>
          <h2>
            Dir wird zum Zurücksetzen deines Passworts an die oben genannte
            Email-Adresse ein Link gesendet.
          </h2>
          {user?.email == undefined ? (
            <CircularProgress size={"1rem"} />
          ) : (
            <SendPasswordResetForm email={user!.email!} />
          )}
        </div>
        <h4 className="py-2 text-xl mb-3">Lösche deinen Account</h4>
        <button
          type="submit"
          className="apl-alert-button-fixed-big"
          onClick={togglePopup}
        >
          Account löschen
        </button>
      </div>
    </span>
  );
};

export default SettingsPage;

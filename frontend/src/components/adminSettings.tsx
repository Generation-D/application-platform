"use client";

import React, { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import SubmitDeletionForm from "@/components/forms/submitDeletionForm";
import Awaiting from "@/components/layout/awaiting";
import Popup from "@/components/layout/popup";
import { supabase } from "@/utils/supabaseBrowserClient";

export default function AdminSettings() {
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
    <div className="flex flex-col items-start justify-between space-y-4">
        <h1 className="text-2xl font-bold mb-4">Einstellungen</h1>
        {isPopupOpen && (
          <Popup onClose={togglePopup}>
            <SubmitDeletionForm email={user?.email || ""} />
          </Popup>
        )}
        <div>
          <label>Email: {Awaiting(isLoading, user?.email)}</label>
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
  );
}

"use client";

import React, { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

import SubmitDeletionForm from "@/components/forms/submitDeletionForm";
import Awaiting from "@/components/layout/awaiting";
import Apl_Header from "@/components/layout/header";
import Popup from "@/components/layout/popup";
import OverviewButton from "@/components/overviewButton";
import { supabase } from "@/utils/supabaseBrowserClient";
import AdminSettings from "@/components/adminSettings";

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
        <OverviewButton slug="admin" />
        <AdminSettings />
      </div>
    </span>
  );
};

export default SettingsPage;

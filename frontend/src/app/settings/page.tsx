"use client";

import React from "react";

import Apl_Header from "@/components/layout/header";
import OverviewButton from "@/components/overviewButton";
import ApplicantSettings from "@/components/applicantSettings";

const SettingsPage: React.FC = () => {
  return (
    <span className="w-full">
      <div className="flex flex-col items-start justify-between space-y-4">
        <Apl_Header />
        <OverviewButton />
        <ApplicantSettings />
      </div>
    </span>
  );
};

export default SettingsPage;

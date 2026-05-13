"use client";

import React, { ReactNode } from "react";

import CircularProgress from "@mui/material/CircularProgress";

export default function Awaiting(isLoading: boolean, input: any) {
  return <>{isLoading ? <CircularProgress size={"1rem"} /> : input}</>;
}

export const AwaitingChild: React.FC<{
  isLoading: boolean;
  children: ReactNode;
}> = ({ isLoading, children }) => {
  return <>{isLoading ? <CircularProgress size={"1rem"} /> : children}</>;
};

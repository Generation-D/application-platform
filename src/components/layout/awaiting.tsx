"use client";

import React, { ReactNode } from "react";

export default function Awaiting(isLoading: boolean, input: ReactNode) {
  return <>{isLoading ? <LoadingSpinner /> : input}</>;
}

export const AwaitingChild: React.FC<{
  isLoading: boolean;
  children: ReactNode;
}> = ({ isLoading, children }) => {
  return <>{isLoading ? <LoadingSpinner /> : children}</>;
};

export const LoadingSpinner = () => (
  <div
    className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
    aria-label="Loading..."
  />
);

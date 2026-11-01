"use client";

import { useState } from "react";

import { Provider } from "react-redux";

import { AppStore, makeStore } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}

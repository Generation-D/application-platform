"use client";

import { useMemo } from "react";

import { Provider } from "react-redux";

import { AppStore, makeStore } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo<AppStore>(() => makeStore(), []);
  return <Provider store={store}> {children} </Provider>;
}

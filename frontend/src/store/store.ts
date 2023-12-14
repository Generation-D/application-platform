import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector,
  useDispatch,
  useStore,
} from "react-redux";

import authReducer from "./slices/authSlice";
import menuReducer from "./slices/menuSlice";
import phaseReducer from "./slices/phaseSlice";
import userReducer from "./slices/usersSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      authReducer,
      userReducer,
      menuReducer,
      phaseReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

import { createSlice } from "@reduxjs/toolkit";

import { RESET_STATE } from "../actionTypes";

const initialState: { isOpen: boolean } = {
  isOpen: false,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    isOpen: false,
  },
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_STATE, () => initialState);
  },
});

export const { toggle } = menuSlice.actions;
export default menuSlice.reducer;

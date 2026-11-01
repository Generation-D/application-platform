import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { userData } from "@/actions/admin";

import { RESET_STATE } from "../actionTypes";

interface UsersState {
  users: userData[];
}

interface ChangeUserRolePayload {
  userId: string;
  newRole: number;
}

const initialState: UsersState = {
  users: [],
  // You can add more states related to users here
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<userData[]>) => {
      state.users = action.payload;
    },
    toggleUserActive: (state, action: PayloadAction<string>) => {
      const index = state.users.findIndex((user) => user.id === action.payload);
      if (index !== -1) {
        state.users[index].isactive = !state.users[index].isactive;
      }
    },
    changeUserRole: (state, action: PayloadAction<ChangeUserRolePayload>) => {
      const { userId, newRole } = action.payload;
      const index = state.users.findIndex((user) => user.id === userId);
      if (index !== -1) {
        state.users[index].userrole = newRole;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_STATE, () => initialState);
  },
});

export const { setUsers, toggleUserActive, changeUserRole } =
  usersSlice.actions;

export default usersSlice.reducer;

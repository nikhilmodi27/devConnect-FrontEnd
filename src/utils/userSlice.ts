import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/user";

const userSlice = createSlice({
  name: "user",
  initialState: null as User | null,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => {
      return action.payload;
    },
    clearUser: () => {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

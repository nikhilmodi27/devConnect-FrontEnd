import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types/user";

const feedSlice = createSlice({
  name: "feed",
  initialState: [] as User[],
  reducers: {
    addFeed: (_state, action: { payload: User[] }) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action: { payload: string }) => {
      return state.filter((user) => user._id !== action.payload);
    },
  },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;

export default feedSlice.reducer;

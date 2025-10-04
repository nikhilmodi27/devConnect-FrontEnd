import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/user";

const connectionSlice = createSlice({
  name: "connections",
  initialState: [] as User[],
  reducers: {
    addConnections: (_state, action: PayloadAction<User[]>) => action.payload,
  },
});

export const { addConnections } = connectionSlice.actions;

export default connectionSlice.reducer;

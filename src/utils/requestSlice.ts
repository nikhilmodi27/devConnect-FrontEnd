import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConnectionRequest } from "../types/connectionRequest";

const requestSlice = createSlice({
  name: "requests",
  initialState: [] as Array<ConnectionRequest>,
  reducers: {
    addRequests: (_state, action: PayloadAction<ConnectionRequest[]>) =>
      action.payload,
    removeRequest: (state, action: PayloadAction<string>) => {
      return state.filter((request) => request._id !== action.payload);
    },
  },
});

export const { addRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;

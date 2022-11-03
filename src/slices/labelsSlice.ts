import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

export const labelsSlice = createSlice({
  name: "labels",
  initialState,
  reducers: {
    setLabels: (state, action: PayloadAction<string[]>) => action.payload,
  },
});

export const { setLabels } = labelsSlice.actions;

export default labelsSlice.reducer;
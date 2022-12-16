import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: Sort[] = [];

export const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<Sort[] | number>) => {
      if (typeof action.payload === 'number') {
        return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];
      }
      
      if (action.payload === undefined) {
        return [];
      }

      return action.payload;
      
    }
  },
});

export const { setSort } = sortSlice.actions;

export default sortSlice.reducer;

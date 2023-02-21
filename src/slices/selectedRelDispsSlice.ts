import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: number[] = [];

export const selectedRelDispsSlice = createSlice({
  name: 'selectedRelDisps',
  initialState,
  reducers: {
    setSelectedRelDisps: (state, action: PayloadAction<number[]>) => {
      const newState = Object.assign([] as number[], state);
      if (action.payload.length === 0) {
        return [];
      }
      if (action.payload.length > 0) {
        return action.payload;
      }
      newState.sort();
      return newState;
    },
  },
});

export const { setSelectedRelDisps } = selectedRelDispsSlice.actions;

export const selectSelectedRelDisps = (state: { selectedRelDisps: number[] }) => state.selectedRelDisps;

export default selectedRelDispsSlice.reducer;

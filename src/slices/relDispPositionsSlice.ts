import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface RelDispPositionsState {
  aspect: number;
  col: number;
  group: string;
  height: number;
  width: number;
  idx: number;
  left: number;
  name: string;
  row: number;
  top: number;
}

const initialState: RelDispPositionsState[] = [];

export const relDispPositionsSlice = createSlice({
  name: 'relDispPositions',
  initialState,
  reducers: {
    setRelDispPositions: (state, action: PayloadAction<RelDispPositionsState[]>) => Object.assign([], [], action.payload),
  },
});

export const { setRelDispPositions } = relDispPositionsSlice.actions;

export default relDispPositionsSlice.reducer;

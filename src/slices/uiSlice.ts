import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  windowHeight: number;
  windowWidth: number;
  origHeight: number;
  origWidth: number;
};

const initialState: UIState = {
  windowHeight: typeof window === 'object' ? window.innerHeight : 0,
  windowWidth: typeof window === 'object' ? window.innerWidth : 0,
  origHeight: 0,
  origWidth: 0,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    windowResize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.windowHeight = action.payload.height;
      state.windowWidth = action.payload.width;
    },
    setAppDims: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.origHeight = action.payload.height;
      state.origWidth = action.payload.width;
    }
  },
});

export const { windowResize, setAppDims } = uiSlice.actions;

export default uiSlice.reducer;

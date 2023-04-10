import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  windowHeight: number;
  windowWidth: number;
  origHeight: number;
  origWidth: number;
  sidbarActive: boolean;
}

const initialState: UIState = {
  windowHeight: typeof window === 'object' ? window.innerHeight : 0,
  windowWidth: typeof window === 'object' ? window.innerWidth : 0,
  origHeight: 0,
  origWidth: 0,
  sidbarActive: false,
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
    },
    setSidebarActive: (state, action: PayloadAction<boolean>) => {
      state.sidbarActive = action.payload;
    },
  },
});

export const { windowResize, setAppDims, setSidebarActive } = uiSlice.actions;

export default uiSlice.reducer;

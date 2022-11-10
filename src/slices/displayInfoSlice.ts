import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface DisplayInfoState {
  isFetching: boolean;
  isLoaded: boolean;
  didInvalidate: boolean;
  info: DisplayObject;
  lastUpdated?: number;
}

interface DisplayInfoInitialState {
  [key: string]: DisplayInfoState;
}

const initialState: DisplayInfoInitialState = {};

export const displayInfoSlice = createSlice({
  name: 'displayInfo',
  initialState,
  reducers: {
    requestDisplay: (state, action: PayloadAction<{ name: string; group: string }>) => {
      state[action.payload.name] = {
        isFetching: true,
        isLoaded: false,
        info: {} as DisplayObject,
        didInvalidate: false,
      };
    },
    receiveDisplay: (state, action: PayloadAction<{ name: string; group: string; info: DisplayObject }>) => {
      state[action.payload.name] = {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        info: action.payload.info,
        lastUpdated: Date.now(),
      };
    },
  },
});

export const { requestDisplay, receiveDisplay } = displayInfoSlice.actions;

export default displayInfoSlice.reducer;

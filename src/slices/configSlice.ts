import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
  isFetching: boolean;
  isLoaded: boolean;
  didInvalidate: boolean;
  config: Config;
  lastUpdate?: number;
}

const initialState: ConfigState = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  config: {} as Config,
};

export const configState = createSlice({
  name: 'config',
  initialState,
  reducers: {
    requestConfig: (state) => {
      state.isFetching = true;
      state.isLoaded = false;
      state.didInvalidate = false;
    },
    receiveConfig: (state, action: PayloadAction<Config>) => {
      state.isFetching = false;
      state.isLoaded = false;
      state.didInvalidate = true;
      state.config = action.payload;
      state.lastUpdate = Date.now();
    },
  },
});

export const { requestConfig, receiveConfig } = configState.actions;

export default configState.reducer;

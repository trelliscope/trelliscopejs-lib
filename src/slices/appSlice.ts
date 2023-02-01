import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface AppState {
  appId: string;
  options: AppOptions;
  dialog: boolean;
  dispSelectDialog: boolean;
  dispInfoDialog: boolean;
  singlePageApp: boolean;
  fullscreen: boolean;
  errorMsg: string;
  basePath: string;
  configPath: string;
}

const initialState: AppState = {
  appId: 'app',
  options: {},
  dialog: false,
  dispSelectDialog: false,
  dispInfoDialog: false,
  singlePageApp: true,
  fullscreen: true,
  errorMsg: '',
  basePath: '',
  configPath: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppID: (state, action: PayloadAction<string>) => {
      state.appId = action.payload;
    },
    setOptions: (state, action: PayloadAction<AppOptions | undefined>) => {
      state.options = action.payload || {};
    },
    setDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.dialog = action.payload;
    },
    setDispSelectDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.dispSelectDialog = action.payload;
    },
    setDispInfoDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.dispInfoDialog = action.payload;
    },
    setSinglePageApp: (state, action: PayloadAction<boolean | undefined>) => {
      state.singlePageApp = !!action.payload;
    },
    setFullscreen: (state, action: PayloadAction<boolean | undefined>) => {
      state.fullscreen = !!action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMsg = action.payload;
    },
    setPaths: (state, action: PayloadAction<string>) => {
      state.configPath = action.payload;
      state.basePath = action.payload.substring(0, action.payload.lastIndexOf('/')) || './';
    },
  },
});

export const {
  setAppID,
  setOptions,
  setDialogOpen,
  setDispSelectDialogOpen,
  setDispInfoDialogOpen,
  setSinglePageApp,
  setFullscreen,
  setErrorMessage,
  setPaths,
} = appSlice.actions;

export const selectAppId = (state: RootState) => state.app.appId;
export const selectBasePath = (state: RootState) => state.app.basePath;
export const selectConfigPath = (state: RootState) => state.app.configPath;
export const selectDialogOpen = (state: RootState) => state.app.dialog;

export default appSlice.reducer;

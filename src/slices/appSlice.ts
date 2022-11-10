import { createSlice } from '@reduxjs/toolkit' ;
import type { PayloadAction } from '@reduxjs/toolkit' ;

export interface AppState {
  appId: string;
  options: AppOptions;
  dialog: boolean;
  dispSelectDialog: boolean;
  dispInfoDialog: boolean;
  singlePageApp: boolean;
  fullscreen: boolean;
  errorMsg: string;
};

const initialState: AppState = {
  appId: 'app',
  options: {},
  dialog: false,
  dispSelectDialog: false,
  dispInfoDialog: false,
  singlePageApp: true,
  fullscreen: true,
  errorMsg: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppID: (state, action: PayloadAction<string>) => {
      state.appId = action.payload;
    },
    setOptions: (state, action: PayloadAction<any>) => {
      state.options = action.payload;
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
    setSinglePageApp: (state, action: PayloadAction<boolean>) => {
      state.singlePageApp = action.payload;
    },
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.fullscreen = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMsg = action.payload;
    },
  },
});

export const { setAppID, setOptions, setDialogOpen, setDispSelectDialogOpen, setDispInfoDialogOpen, setSinglePageApp, setFullscreen, setErrorMessage } = appSlice.actions;

export default appSlice.reducer;
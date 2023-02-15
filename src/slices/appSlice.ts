import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { configAPI } from './configAPI';
import { displayInfoAPI } from './displayInfoAPI';
import { metaDataAPI } from './metaDataAPI';
import { displayListAPI } from './displayListAPI';

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

const apiErrorHandler: CaseReducer = (state, action) => {
  const url = new URL(action.payload.url);
  return {
    ...state,
    errorMsg: `Couldn't load data at: ${url.origin}${url.pathname}`,
  };
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
  extraReducers: (builder) => {
    builder.addMatcher(configAPI.endpoints.getConfig.matchRejected, (state, action) => apiErrorHandler(state, action));
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchRejected, (state, action) =>
      apiErrorHandler(state, action),
    );
    builder.addMatcher(metaDataAPI.endpoints.getMetaData.matchRejected, (state, action) => apiErrorHandler(state, action));
    builder.addMatcher(displayListAPI.endpoints.getDisplayList.matchRejected, (state, action) =>
      apiErrorHandler(state, action),
    );
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

export default appSlice.reducer;

import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { configAPI } from './configAPI';
import { displayInfoAPI } from './displayInfoAPI';
import { metaDataAPI } from './metaDataAPI';
import { displayListAPI } from './displayListAPI';

export interface PanelDialog {
  open: boolean;
  panel?: IMeta;
  source?: string;
}
export interface AppState {
  appId: string;
  options: AppOptions;
  dialog: boolean;
  singlePageApp: boolean;
  fullscreen: boolean;
  errorMsg: string;
  basePath: string;
  configPath: string;
  panelDialog: PanelDialog;
}

const initialState: AppState = {
  appId: 'app',
  options: {},
  dialog: false,
  singlePageApp: true,
  fullscreen: true,
  errorMsg: '',
  basePath: '',
  configPath: '',
  panelDialog: {
    open: false,
    panel: undefined,
    source: '',
  },
};

const apiErrorHandler: CaseReducer = (state, action) => ({
  ...state,
  errorMsg: action.payload,
});

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
    setPanelDialog: (state, action: PayloadAction<{ panel?: IMeta; source?: string; open?: boolean }>) => {
      state.panelDialog = { ...state.panelDialog, ...action.payload };
    },
  },
  // Listen for rejected API calls and set the error message
  extraReducers: (builder) => {
    builder.addMatcher(configAPI.endpoints.getConfig.matchRejected, apiErrorHandler);
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchRejected, apiErrorHandler);
    builder.addMatcher(metaDataAPI.endpoints.getMetaData.matchRejected, apiErrorHandler);
    builder.addMatcher(displayListAPI.endpoints.getDisplayList.matchRejected, apiErrorHandler);
  },
});

export const { setAppID, setOptions, setSinglePageApp, setFullscreen, setErrorMessage, setPaths, setPanelDialog } =
  appSlice.actions;

export default appSlice.reducer;

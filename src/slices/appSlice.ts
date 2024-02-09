import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { configAPI } from './configAPI';
import { displayInfoAPI } from './displayInfoAPI';
import { displayListAPI } from './displayListAPI';
import { META_DATA_STATUS } from '../constants';

export interface PanelDialog {
  open: boolean;
  panel?: IMeta;
  source?: string;
  index?: number;
}
export interface AppState {
  appId: string;
  options: AppOptions;
  dialog: boolean;
  singlePageApp: boolean;
  fullscreen: boolean;
  errorMsg: string;
  basePath: string;
  appData: string;
  configPath: string;
  metaData: Datum[] | null;
  metaDataState: string;
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
  appData: '',
  configPath: '',
  metaData: [],
  metaDataState: META_DATA_STATUS.LOADING,
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
    setAppData: (state, action: PayloadAction<string>) => {
      state.appData = action.payload;
    },
    setPanelDialog: (state, action: PayloadAction<{ panel?: IMeta; source?: string; open?: boolean; index?: number }>) => {
      state.panelDialog = { ...state.panelDialog, ...action.payload };
    },
    setMetaData: (state, action: PayloadAction<Datum[] | null>) => {
      state.metaData = action.payload;
    },
    setMetaDataState: (state, action: PayloadAction<string>) => {
      state.metaDataState = action.payload;
    },
  },
  // Listen for rejected API calls and set the error message
  extraReducers: (builder) => {
    builder.addMatcher(configAPI.endpoints.getConfig.matchRejected, apiErrorHandler);
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchRejected, apiErrorHandler);
    builder.addMatcher(displayListAPI.endpoints.getDisplayList.matchRejected, apiErrorHandler);
  },
});

export const {
  setAppID,
  setOptions,
  setSinglePageApp,
  setFullscreen,
  setErrorMessage,
  setPaths,
  setAppData,
  setPanelDialog,
  setMetaData,
  setMetaDataState,
} = appSlice.actions;

export default appSlice.reducer;

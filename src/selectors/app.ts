import type { RootState } from '../store';

export const selectAppId = (state: RootState) => state.app.appId;
export const selectBasePath = (state: RootState) => state.app.basePath;
export const selectConfigPath = (state: RootState) => state.app.configPath;
export const selectAppData = (state: RootState) => state.app.appData;
export const selectDialogOpen = (state: RootState) => state.app.dialog;
export const selectErrorMessage = (state: RootState) => state.app.errorMsg;
export const selectPanelDialog = (state: RootState) => state.app.panelDialog;
export const panelDialogIsOpenSelector = (state: RootState) => state.app.panelDialog.open;
export const selectMetaData = (state: RootState) => state.app.metaData;
export const selectMetaDataState = (state: RootState) => state.app.metaDataState;

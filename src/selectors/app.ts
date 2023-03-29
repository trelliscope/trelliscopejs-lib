import type { RootState } from '../store';

export const selectAppId = (state: RootState) => state.app.appId;
export const selectBasePath = (state: RootState) => state.app.basePath;
export const selectConfigPath = (state: RootState) => state.app.configPath;
export const selectDialogOpen = (state: RootState) => state.app.dialog;
export const selectErrorMessage = (state: RootState) => state.app.errorMsg;

// cross-component selectors go here
// otherwise they go in the component files
import type { RootState } from '../store';

export const selectedDisplaySelector = (state: RootState) => state.selectedDisplay;

export const relDispPositionsSelector = (state: RootState) => state.relDispPositions;

export const cogDataSelector = (state: RootState) => state.cogDataMutable;

export const filterSelector = (state: RootState) => state.filter;
export const filterViewSelector = (state: RootState) => state.filter.view;
export const labelsSelector = (state: RootState) => state.labels || [];

export const appIdSelector = (state: RootState) => state.app.appId;
export const singlePageAppSelector = (state: RootState) => state.app.singlePageApp;
export const fullscreenSelector = (state: RootState) => state.app.fullscreen;

export const dispSelectDialogSelector = (state: RootState) => state.app.dispSelectDialog;

export const selectCallbacks = (state: RootState) => state?.app.options?.callbacks;

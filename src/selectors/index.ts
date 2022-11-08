// cross-component selectors go here
// otherwise they go in the component files
import { createSelector } from 'reselect';
import type { RootState } from '../store';

export const displayListSelector = (state: RootState) => state.displayList;
export const displayInfoSelector = (state: RootState) => state._displayInfo;
export const curDisplayInfoSelector = (state: RootState) => {
  if (state.selectedDisplay && state.selectedDisplay.name !== '' && state._displayInfo[state.selectedDisplay.name]) {
    return state._displayInfo[state.selectedDisplay.name];
  }
  return {
    isFetching: true,
    isLoaded: false,
    didInvalidate: false,
    info: {},
  };
};
export const selectedDisplaySelector = (state: RootState) => state.selectedDisplay;
export const displayLoadedSelector = (state: RootState) => {
  if (state.selectedDisplay && state.selectedDisplay.name !== '' && state._displayInfo[state.selectedDisplay.name]) {
    return state._displayInfo[state.selectedDisplay.name].isLoaded;
  }
  return false;
};

export const cogInterfaceSelector = (state: RootState) => state._cogDataMutable.iface;
export const cogDataSelector = (state: RootState) => state._cogDataMutable;

export const pageNumSelector = (state: RootState) => (state.layout.pageNum ? state.layout.pageNum : -1);
export const nPerPageSelector = (state: RootState) => state.layout.nrow * state.layout.ncol;

export const filterSelector = (state: RootState) => state.filter;
export const filterStateSelector = (state: RootState) => state.filter.state;
export const filterViewSelector = (state: RootState) => state.filter.view;
export const sortSelector = (state: RootState) => state.sort;
export const layoutSelector = (state: RootState) => state.layout;
export const labelsSelector = (state: RootState) => state.labels || [];

export const configSelector = (state: RootState) => state._config.config;
export const appIdSelector = (state: RootState) => state.appId;
export const singlePageAppSelector = (state: RootState) => state.singlePageApp;
export const fullscreenSelector = (state: RootState) => state.fullscreen;

export const dialogOpenSelector = (state: RootState) => state.dialog;
export const dispSelectDialogSelector = (state: RootState) => state.dispSelectDialog;
export const dispInfoDialogSelector = (state: RootState) => state.dispInfoDialog;

export const selectCallbacks = (state: RootState) => state?.options?.callbacks;

export const aspectSelector = createSelector(curDisplayInfoSelector, (cdi) => {
  if (cdi.isLoaded) {
    return cdi.info.height / cdi.info.width;
  }
  return 0;
});

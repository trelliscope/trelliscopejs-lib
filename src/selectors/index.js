// cross-component selectors go here
// otherwise they go in the component files
import { createSelector } from 'reselect';

export const displayListSelector = (state) => state._displayList;
export const displayInfoSelector = (state) => state._displayInfo;
export const curDisplayInfoSelector = (state) => {
  if (state.selectedDisplay
    && state.selectedDisplay.name !== ''
    && state._displayInfo[state.selectedDisplay.name]) {
    return state._displayInfo[state.selectedDisplay.name];
  }
  return {
    isFetching: true,
    isLoaded: false,
    didInvalidate: false,
    info: {}
  };
};
export const selectedDisplaySelector = (state) => state.selectedDisplay;
export const displayLoadedSelector = (state) => {
  if (state.selectedDisplay
    && state.selectedDisplay.name !== ''
    && state._displayInfo[state.selectedDisplay.name]) {
    return state._displayInfo[state.selectedDisplay.name].isLoaded;
  }
  return false;
};

export const cogInterfaceSelector = (state) => state._cogDataMutable.iface;
export const cogDataSelector = (state) => state._cogDataMutable;
export const panelRenderersSelector = (state) => state.panelRenderers;
export const localPanelsSelector = (state) => state._localPanels;

export const pageNumSelector = (state) => (state.layout.pageNum ? state.layout.pageNum : -1);
export const nPerPageSelector = (state) => state.layout.nrow * state.layout.ncol;

export const filterSelector = (state) => state.filter;
export const filterStateSelector = (state) => state.filter.state;
export const filterViewSelector = (state) => state.filter.view;
export const sortSelector = (state) => state.sort;
export const layoutSelector = (state) => state.layout;
export const labelsSelector = (state) => state.labels;

export const configSelector = (state) => state._config.config;
export const appIdSelector = (state) => state.appId;
export const singlePageAppSelector = (state) => state.singlePageApp;
export const fullscreenSelector = (state) => state.fullscreen;

export const dialogOpenSelector = (state) => state.dialog;
export const dispSelectDialogSelector = (state) => state.dispSelectDialog;
export const dispInfoDialogSelector = (state) => state.dispInfoDialog;

export const aspectSelector = createSelector(
  curDisplayInfoSelector,
  (cdi) => {
    if (cdi.isLoaded) {
      return cdi.info.height / cdi.info.width;
    }
    return 0;
  }
);

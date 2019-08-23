// cross-component selectors go here
// otherwise they go in the component files

export const displayListSelector = (state) => state._displayList;
export const displayInfoSelector = (state) => state._displayInfo;
export const currentDisplaySelector = (state) => state.currentDisplay;
export const selectedDisplaySelector = (state) => state.selectedDisplay;
export const displayLoadedSelector = (state) => state._displayInfo.isLoaded;

export const cogInterfaceSelector = (state) => state._cogDataMutable.iface;
export const cogDataSelector = (state) => state._cogDataMutable;
export const panelRendererSelector = (state) => state.panelRenderer;
export const localPanelsSelector = (state) => state._localPanels;

export const pageNumSelector = (state) => state.layout.pageNum;
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

export const aspectSelector = (state) => state._displayInfo.info.height
  / state._displayInfo.info.width;

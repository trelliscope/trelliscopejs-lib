export const SET_APP_ID = 'SET_APP_ID' as string;
export const SET_OPTIONS = 'SET_OPTIONS' as string;
export const SET_SINGLE_PAGE_APP = 'SET_SINGLE_PAGE_APP' as string;
export const SET_FULLSCREEN = 'SET_FULLSCREEN' as string;
export const SET_DIALOG_OPEN = 'SET_DIALOG_OPEN' as string;
export const SET_APP_DIMS = 'SET_APP_DIMS' as string;
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE' as string;
export const SET_DISPSELECT_DIALOG_OPEN = 'SET_DISPSELECT_DIALOG_OPEN' as string;
export const SET_DISPINFO_DIALOG_OPEN = 'SET_DISPINFO_DIALOG_OPEN' as string;

export const ACTIVE_SIDEBAR = 'ACTIVE_SIDEBAR' as string;
export const SET_LAYOUT = 'SET_LAYOUT' as string;
export const SET_LABELS = 'SET_LABELS' as string;
export const SET_SORT = 'SET_SORT' as string;
export const SET_FILTER = 'SET_FILTER' as string;
export const SET_FILTER_VIEW = 'SET_FILTER_VIEW' as string;
export const SELECT_DISPLAY = 'SELECT_DISPLAY' as string;
export const REQUEST_DISPLAY = 'REQUEST_DISPLAY' as string;
export const RECEIVE_DISPLAY = 'RECEIVE_DISPLAY' as string;
export const REQUEST_DISPLAY_LIST = 'REQUEST_DISPLAY_LIST' as string;
export const RECEIVE_DISPLAY_LIST = 'RECEIVE_DISPLAY_LIST' as string;
export const REQUEST_COGDATA = 'REQUEST_COGDATA' as string;
export const RECEIVE_COGDATA = 'RECEIVE_COGDATA' as string;
export const SET_PANEL_RENDERER = 'SET_PANEL_RENDERER' as string;
export const WINDOW_RESIZE = 'WINDOW_RESIZE' as string;
export const UPDATE_DIMS = 'UPDATE_DIMS' as string;
export const REQUEST_CONFIG = 'REQUEST_CONFIG' as string;
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG' as string;
export const SET_LOCAL_PANELS = 'SET_LOCAL_PANELS' as string;
export const SET_SELECTED_RELDISPS = 'SET_SELECTED_RELDISPS' as string;
export const SET_REL_DISP_POSITIONS = 'SET_REL_DISP_POSITIONS' as string;
// export const SET_SELECTED_VIEW = 'SET_SELECTED_VIEW' as string;

export const SB_PANEL_LAYOUT = 'Panel Grid Layout' as string;
export const SB_PANEL_FILTER = 'Filter Panels' as string;
export const SB_PANEL_SORT = 'Sort Panels' as string;
export const SB_PANEL_LABELS = 'Show/Hide Labels' as string;
export const SB_VIEWS = 'Views' as string;
export const SB_CONFIG = 'Configuration' as string;

export const SB_LOOKUP = [SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_VIEWS] as Array<string>;
export const SB_REV_LOOKUP = {} as {[k: string]: number};
SB_LOOKUP.forEach((d, i) => {
  SB_REV_LOOKUP[d] = i;
});
SB_REV_LOOKUP[''] = -1;

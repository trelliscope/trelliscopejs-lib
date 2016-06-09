import fetch from 'isomorphic-fetch';
import { ACTIVE_SIDEBAR, SET_LAYOUT, SET_LABELS, SET_SORT, SET_FILTER,
  SET_FILTER_VIEW, SELECT_DISPLAY, REQUEST_DISPLAY, RECEIVE_DISPLAY,
  REQUEST_DISPLAY_LIST, RECEIVE_DISPLAY_LIST,
  REQUEST_COGIFACE, RECEIVE_COGIFACE, REQUEST_CONFIG, RECEIVE_CONFIG } from '../constants.js';

export const requestConfig = () => ({
  type: REQUEST_CONFIG
});

export const receiveConfig = (json) => ({
  type: RECEIVE_CONFIG,
  config: json,
  receivedAt: Date.now()
});

export const setActiveSidebar = (active) => ({
  type: ACTIVE_SIDEBAR, active
});

export const setLayout = (layout) => ({
  type: SET_LAYOUT, layout
});

export const setLabels = (labels) => ({
  type: SET_LABELS, labels
});

export const setSort = (sort) => ({
  type: SET_SORT, sort
});

export const setFilter = (filter) => ({
  type: SET_FILTER, filter
});

export const setFilterView = (filterView) => ({
  type: SET_FILTER_VIEW, filterView
});

export const requestDisplayList = () => ({
  type: REQUEST_DISPLAY_LIST
});

export const receiveDisplayList = (json) => ({
  type: RECEIVE_DISPLAY_LIST,
  list: json,
  receivedAt: Date.now()
});

export const setSelectedDisplay = (name, group) => ({
  type: SELECT_DISPLAY, name, group
});

export const requestDisplay = (name, group) => ({
  type: REQUEST_DISPLAY, name, group
});

export const receiveDisplay = (name, group, json) => ({
  type: RECEIVE_DISPLAY,
  name, group,
  info: json,
  receivedAt: Date.now()
});

export const requestCogInterfaceInfo = (iface) => ({
  type: REQUEST_COGIFACE, iface
});

export const receiveCogInterfaceInfo = (iface, json) => ({
  type: RECEIVE_COGIFACE,
  iface,
  info: json,
  receivedAt: Date.now()
});

export const fetchCogInterfaceInfo = (dispatch, iface, cfg) => {
  dispatch(receiveCogInterfaceInfo(iface));

  // TODO: when a more robust back-end API is spec'd out, rework this
  return fetch(`${cfg.display_base}/displays/${iface.group}/${iface.name}/cogData.json`)
    .then(response => response.json())
    .then(json => {
      dispatch(receiveCogInterfaceInfo(iface, json));
    }
  );
};

// the display list is only loaded once at the beginning
// but it needs the config so we'll load config first
export const fetchDisplayList = () =>
  (dispatch) => {
    dispatch(requestConfig());

    return fetch('config.json')
    .then(response => response.json())
    .then(json => {
      dispatch(receiveConfig(json));
      fetch(`${json.display_base}/displays/displayList.json`)
        .then(response => response.json())
        .then(json2 => {
          dispatch(receiveDisplayList(json2));
        }
      );
    });
  };

export const fetchDisplay = (name, group, cfg) =>
  (dispatch) => {
    dispatch(requestDisplay(name, group));

    return fetch(`${cfg.display_base}/displays/${group}/${name}/displayObj.json`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveDisplay(name, group, json));
        dispatch(setLabels(json.state.labels));
        dispatch(setSort(json.state.sort));
        dispatch(setFilter(json.state.filter));
        // initial filter view will be those that are active
        const active = [];
        const inactive = [];
        const ciKeys = Object.keys(json.cogInfo);
        for (let i = 0; i < ciKeys.length; i++) {
          if (json.cogInfo[ciKeys[i]].filterable) {
            if (json.state.filter &&
              json.state.filter[ciKeys[i]] !== undefined) {
              active.push(ciKeys[i]);
            } else {
              inactive.push(ciKeys[i]);
            }
          }
        }
        dispatch(setFilterView({ active, inactive }));
        dispatch(setLayout(json.state.layout));
        fetchCogInterfaceInfo(dispatch, json.cogInterface, cfg);
      }
    );
  };

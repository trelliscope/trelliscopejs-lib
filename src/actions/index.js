import fetch from 'isomorphic-fetch';
import { ACTIVE_SIDEBAR, SET_LAYOUT, SET_LABELS, SET_SORT, SET_FILTER,
  SET_PAGENUM, SELECT_DISPLAY, REQUEST_DISPLAY, RECEIVE_DISPLAY,
  REQUEST_COGIFACE, RECEIVE_COGIFACE } from '../constants.js';

export const setActiveSidebar = (active) => (
  { type: ACTIVE_SIDEBAR, active }
);

export const setLayout = (layout) => (
  { type: SET_LAYOUT, layout }
);

export const setLabels = (labels) => (
  { type: SET_LABELS, labels }
);

export const setSort = (sort) => (
  { type: SET_SORT, sort }
);

export const setFilter = (filter) => (
  { type: SET_FILTER, filter }
);

export const setPageNum = (n) => (
  { type: SET_PAGENUM, n }
);

export const setSelectedDisplay = (name, group) => (
  { type: SELECT_DISPLAY, name, group }
);

export const requestDisplay = (name, group) => (
  { type: REQUEST_DISPLAY, name, group }
);

export const receiveDisplay = (name, group, json) => (
  {
    type: RECEIVE_DISPLAY,
    name, group,
    info: json,
    receivedAt: Date.now()
  }
);

export const requestCogInterfaceInfo = (iface) => (
  { type: REQUEST_COGIFACE, iface }
);

export const receiveCogInterfaceInfo = (iface, json) => (
  {
    type: RECEIVE_COGIFACE,
    iface,
    info: json,
    receivedAt: Date.now()
  }
);

export const fetchCogInterfaceInfo = (dispatch, iface) => {
  dispatch(receiveCogInterfaceInfo(iface));

  return fetch(`vdb/displays/${iface.group}/${iface.name}/cogData.json`)
    .then(response => response.json())
    .then(json => {
      dispatch(receiveCogInterfaceInfo(iface, json));
    }
  );
};

export const fetchDisplay = (name, group) =>
  (dispatch) => {
    dispatch(requestDisplay(name, group));

    return fetch(`vdb/displays/${group}/${name}/displayObj.json`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveDisplay(name, group, json));
        dispatch(setLayout(json.state.layout));
        dispatch(setLabels(json.state.labels));
        dispatch(setSort(json.state.sort));
        dispatch(setFilter(json.state.filter));
        fetchCogInterfaceInfo(dispatch, json.cogInterface);
      }
    );
  };

import fetch from 'isomorphic-fetch';
import { ACTIVE_SIDEBAR, SET_LAYOUT, SET_LABELS, SET_SORT, SET_FILTER,
  SELECT_DISPLAY, REQUEST_DISPLAY, RECEIVE_DISPLAY } from '../constants.js';

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
      }
    );
  };


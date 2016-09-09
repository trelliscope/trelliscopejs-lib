import { json as getJSON } from 'd3-request';
// import { crossfilter } from 'crossfilter2';
import { ACTIVE_SIDEBAR, SET_LAYOUT, SET_LABELS, SET_SORT, SET_FILTER,
  SET_FILTER_VIEW, SELECT_DISPLAY, REQUEST_DISPLAY, RECEIVE_DISPLAY,
  REQUEST_DISPLAY_LIST, RECEIVE_DISPLAY_LIST,
  REQUEST_COGIFACE, RECEIVE_COGIFACE,
  REQUEST_COGDATA, RECEIVE_COGDATA,
  REQUEST_CONFIG, RECEIVE_CONFIG,
  SET_DIALOG_OPEN } from '../constants.js';

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

export const setDialogOpen = (isOpen) => ({
  type: SET_DIALOG_OPEN, isOpen
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

export const setFilterView = (name, which) => ({
  type: SET_FILTER_VIEW, name, which
});

export const requestDisplayList = () => ({
  type: REQUEST_DISPLAY_LIST
});

export const receiveDisplayList = (json) => ({
  type: RECEIVE_DISPLAY_LIST,
  list: json,
  receivedAt: Date.now()
});

export const setSelectedDisplay = (name, group, desc) => ({
  type: SELECT_DISPLAY, name, group, desc
});

export const requestDisplay = (name, group) => ({
  type: REQUEST_DISPLAY, name, group
});

export const receiveDisplay = (name, group, json) => ({
  type: RECEIVE_DISPLAY,
  name,
  group,
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
  const cf = `${cfg.display_base}/displays/${iface.group}/${iface.name}/cogData.json`;
  return getJSON(cf, json => {
    dispatch(receiveCogInterfaceInfo(iface, json));
  });
};


export const requestCogData = (iface) => ({
  type: REQUEST_COGDATA, iface
});

export const receiveCogData = (iface, json) => ({
  type: RECEIVE_COGDATA,
  iface,
  crossfilter: json,
  receivedAt: Date.now()
});

// the display list is only loaded once at the beginning
// but it needs the config so we'll load config first
export const fetchDisplayList = () =>
  (dispatch) => {
    dispatch(requestConfig());

    return getJSON('config.json', json => {
      dispatch(receiveConfig(json));
      getJSON(`${json.display_base}/displays/displayList.json`, json2 => {
        dispatch(receiveDisplayList(json2));
      });
    });
  };

export const fetchDisplay = (name, group, cfg) =>
  (dispatch) => {
    dispatch(requestDisplay(name, group));

    // first get displayObj.json so we can find the cog data, etc.
    const dof = `${cfg.display_base}/displays/${group}/${name}/displayObj.json`;
    return getJSON(dof, json => {
      const iface = json.cogInterface;
      // now that displayObj is available, we can set the state with this data
      dispatch(receiveDisplay(name, group, json));
       // TODO: remove when crossfilter is done
      // fetchCogInterfaceInfo(dispatch, iface, cfg);
      // set cog data state as pending while it loads
      dispatch(receiveCogData(iface));
      // TODO: perhaps do a quick load of initial panels while cog data is loading...
      // (to do this, have displayObj store initial panel keys and cogs)

      // load the cog data
      const cf = `${cfg.display_base}/displays/${iface.group}/${iface.name}/cogData.json`;
      getJSON(cf, json2 => {
        // once cog data is loaded, set the state with this data
        // but first add an index column to the data so we can
        // preserve original order or do multi-column sorts
        for (let i = 0; i < json2.length; i++) {
          json2[i].__index = i; // eslint-disable-line no-param-reassign
        }
        dispatch(receiveCogData(iface, crossfilter(json2)));
        // now we can safely set several other default states that depend
        // on either display or cog data or can't be set until this data is loaded
        dispatch(setLabels(json.state.labels));
        dispatch(setLayout(json.state.layout));
        dispatch(setSort(json.state.sort));
        dispatch(setFilter(json.state.filter));
        const ciKeys = Object.keys(json.cogInfo);
        for (let i = 0; i < ciKeys.length; i++) {
          if (json.cogInfo[ciKeys[i]].filterable) {
            if (json.state.filter &&
              json.state.filter[ciKeys[i]] !== undefined) {
              dispatch(setFilterView(ciKeys[i], 'add'));
            } else {
              dispatch(setFilterView(ciKeys[i], 'remove'));
            }
          }
        }
      });
    });
  };

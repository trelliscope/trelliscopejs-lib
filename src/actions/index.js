import React from 'react';
import { json as d3json } from 'd3-request';
import { default as getJSONP } from 'browser-jsonp';
import { loadAssetsSequential } from '../loadAssets';
import { ACTIVE_SIDEBAR, SET_LAYOUT, SET_LABELS, SET_SORT, SET_FILTER,
  SET_FILTER_VIEW, SELECT_DISPLAY, REQUEST_DISPLAY, RECEIVE_DISPLAY,
  REQUEST_DISPLAY_LIST, RECEIVE_DISPLAY_LIST,
  RECEIVE_COGDATA, REQUEST_CONFIG, RECEIVE_CONFIG,
  SET_DIALOG_OPEN, SET_PANEL_RENDERER } from '../constants';

const getJSON = obj =>
  d3json(obj.url, json => obj.callback(json));

export const requestConfig = () => ({
  type: REQUEST_CONFIG
});

export const receiveConfig = json => ({
  type: RECEIVE_CONFIG,
  config: json,
  receivedAt: Date.now()
});

export const setActiveSidebar = active => ({
  type: ACTIVE_SIDEBAR, active
});

export const setDialogOpen = isOpen => ({
  type: SET_DIALOG_OPEN, isOpen
});

export const setLayout = layout => ({
  type: SET_LAYOUT, layout
});

export const setLabels = labels => ({
  type: SET_LABELS, labels
});

export const setSort = sort => ({
  type: SET_SORT, sort
});

export const setFilter = filter => ({
  type: SET_FILTER, filter
});

export const setFilterView = (name, which) => ({
  type: SET_FILTER_VIEW, name, which
});

export const requestDisplayList = () => ({
  type: REQUEST_DISPLAY_LIST
});

export const receiveDisplayList = json => ({
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

const receiveCogData = (iface, json) => ({
  type: RECEIVE_COGDATA,
  iface,
  crossfilter: json,
  receivedAt: Date.now()
});

export const setPanelRenderer = fn => ({
  type: SET_PANEL_RENDERER, fn
});

// the display list is only loaded once at the beginning
// but it needs the config so we'll load config first
export const fetchDisplayList = () =>
  (dispatch) => {
    dispatch(requestConfig());

    window.__loadDisplayList__ = (json) => {
      dispatch(receiveDisplayList(json));
    };

    window.__loadTrscopeConfig__ = (json) => {
      dispatch(receiveConfig(json));
      if (json.data_type === 'jsonp') {
        getJSONP({
          url: `${json.display_base}/displayList.jsonp`,
          callbackName: '__loadDisplayList__'
        });
      } else {
        getJSON({
          url: `${json.display_base}/displayList.json`,
          callback: window.__loadDisplayList__
        });
      }
    };

    getJSONP({
      url: 'config.jsonp',
      callbackName: '__loadTrscopeConfig__'
    });
  };

export const fetchDisplay = (name, group, cfg) =>
  (dispatch) => {
    dispatch(requestDisplay(name, group));

    window.__loadDisplayObj__ = (json) => {
      const iface = json.cogInterface;
      // now that displayObj is available, we can set the state with this data
      dispatch(receiveDisplay(name, group, json));
      // set cog data state as pending while it loads
      dispatch(receiveCogData(iface));
      // TODO: perhaps do a quick load of initial panels while cog data is loading...
      // (to do this, have displayObj store initial panel keys and cogs)

      window.__loadCogData__ = (json2) => {
        // once cog data is loaded, set the state with this data
        // but first add an index column to the data so we can
        // preserve original order or do multi-column sorts
        for (let i = 0; i < json2.length; i += 1) {
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
        for (let i = 0; i < ciKeys.length; i += 1) {
          if (json.cogInfo[ciKeys[i]].filterable) {
            if (json.state.filter &&
              json.state.filter[ciKeys[i]] !== undefined) {
              dispatch(setFilterView(ciKeys[i], 'add'));
            } else {
              dispatch(setFilterView(ciKeys[i], 'remove'));
            }
          }
        }
      };

      if (json.panelInterface.type === 'image') {
        dispatch(setPanelRenderer((x, style) => (
          <img
            src={x}
            alt="panel"
            style={style}
          />
        )));
      } else if (json.panelInterface.type === 'htmlwidget') {
        const callback = (binding) => {
          const renderFn = (x, style, post, key) => {
            const el = document.getElementById(`widget_outer_${key}`);
            if (post && el) {
              // need to create a child div that is not bound to react
              const dv = document.createElement('div');
              dv.style.width = `${style.width}px`;
              dv.style.height = `${style.height}px`;
              dv.setAttribute('id', `widget_${key}`);
              el.appendChild(dv);

              let initResult;
              if (binding.initialize) {
                initResult = binding.initialize(dv, style.width, style.height);
              }
              binding.renderValue(dv, x.x, initResult);
              // evalAndRun(x.jsHooks.render, initResult, [el, x.x]);
            } else {
              return <div id={`widget_outer_${key}`} />;
            }
            return null;
          };
          const renderFn2 = renderFn.bind({ binding });
          dispatch(setPanelRenderer(renderFn2));
        };
        loadAssetsSequential(json.panelInterface.deps, callback);
      }

      // load the cog data
      if (cfg.data_type === 'jsonp') {
        getJSONP({
          url: `${cfg.display_base}/${iface.group}/${iface.name}/cogData.jsonp`,
          callbackName: '__loadCogData__'
        });
      } else {
        getJSON({
          url: `${cfg.display_base}/${iface.group}/${iface.name}/cogData.json`,
          callback: window.__loadCogData__
        });
      }
    };

    // get displayObj.json so we can find the cog data, etc.
    if (cfg.data_type === 'jsonp') {
      getJSONP({
        url: `${cfg.display_base}/${group}/${name}/displayObj.jsonp`,
        callbackName: '__loadDisplayObj__'
      });
    } else {
      getJSON({
        url: `${cfg.display_base}/${group}/${name}/displayObj.json`,
        callback: window.__loadDisplayObj__
      });
    }
  };

import React from 'react';
import { json as d3json } from 'd3-request';
import { default as getJSONP } from 'browser-jsonp';
import { loadAssetsSequential, findWidget } from '../loadAssets';
import { SET_APP_ID, SET_FULLSCREEN, WINDOW_RESIZE,
  ACTIVE_SIDEBAR, SET_LAYOUT, SET_LABELS, SET_SORT,
  SET_FILTER, SET_FILTER_VIEW, SELECT_DISPLAY, REQUEST_DISPLAY,
  RECEIVE_DISPLAY, REQUEST_DISPLAY_LIST, RECEIVE_DISPLAY_LIST,
  RECEIVE_COGDATA, REQUEST_CONFIG, RECEIVE_CONFIG,
  SET_DIALOG_OPEN, SET_PANEL_RENDERER, SET_LOCAL_PANELS } from '../constants';

const getJSON = obj =>
  d3json(obj.url, json => obj.callback(json));

export const setAppID = id => ({
  type: SET_APP_ID, id
});

export const setFullscreen = fullscreen => ({
  type: SET_FULLSCREEN, fullscreen
});

export const windowResize = dims => (
  { type: WINDOW_RESIZE, dims }
);

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

export const setLocalPanels = dat => ({
  type: SET_LOCAL_PANELS, dat
});

const setCogDatAndState = (iface, cogDatJson, dObjJson, dispatch) => {
  for (let i = 0; i < cogDatJson.length; i += 1) {
    cogDatJson[i].__index = i; // eslint-disable-line no-param-reassign
  }
  dispatch(receiveCogData(iface, crossfilter(cogDatJson)));
  // now we can safely set several other default states that depend
  // on either display or cog data or can't be set until this data is loaded
  dispatch(setLabels(dObjJson.state.labels));
  dispatch(setLayout(dObjJson.state.layout));
  dispatch(setSort(dObjJson.state.sort));
  dispatch(setFilter(dObjJson.state.filter));
  const ciKeys = Object.keys(dObjJson.cogInfo);
  for (let i = 0; i < ciKeys.length; i += 1) {
    if (dObjJson.cogInfo[ciKeys[i]].filterable) {
      if (dObjJson.state.filter &&
        dObjJson.state.filter[ciKeys[i]] !== undefined) {
        dispatch(setFilterView(ciKeys[i], 'add'));
      } else {
        dispatch(setFilterView(ciKeys[i], 'remove'));
      }
    }
  }
};

const setPanelInfo = (dObjJson, cfg, dispatch) => {
  if (dObjJson.panelInterface.type === 'image') {
    dispatch(setPanelRenderer((x, width, height) => (
      <img
        src={x}
        alt="panel"
        style={{ width, height }}
      />
    )));
  } else if (dObjJson.panelInterface.type === 'htmlwidget') {
    if (cfg.config_base) {
      const prCallback = () => {
        const binding = findWidget(dObjJson.panelInterface.deps.name);

        dispatch(setPanelRenderer((x, width, height, post, key) => {
          const el = document.getElementById(`widget_outer_${key}`);

          if (post && el) {
            // need to create a child div that is not bound to react
            const dv = document.createElement('div');
            dv.style.width = `${width}px`;
            dv.style.height = `${height}px`;
            dv.setAttribute('id', `widget_${key}`);
            el.appendChild(dv);

            let initResult;
            if (binding.initialize) {
              initResult = binding.initialize(dv, width, height);
            }
            binding.renderValue(dv, x.x, initResult);
            // evalAndRun(x.jsHooks.render, initResult, [el, x.x]);
          } else {
            return <div id={`widget_outer_${key}`} />;
          }
          return null;
        }));
      };

      loadAssetsSequential(dObjJson.panelInterface.deps, cfg.config_base, prCallback);
    }
  }
};

// the display list is only loaded once at the beginning
// but it needs the config so we'll load config first
export const fetchDisplayList = (config = 'config.jsonp', id = '') =>
  (dispatch) => {
    const selfContained = !(typeof config === 'string' || config instanceof String);

    if (!selfContained) {
      dispatch(requestConfig());

      const dlCallback = `__loadDisplayList__${id}`;
      const cfgCallback = `__loadTrscopeConfig__${id}`;

      const configBase = config.replace(/[^\/]*$/, '');

      const getConfigBase = (txt) => {
        let res = txt;
        if (!(/^https?:\/\/|^file:\/\/|^\//.test(txt))) {
          res = configBase;
          if (txt !== '') {
            res += `${txt}/`;
          }
        }
        return res;
      };

      window[dlCallback] = (json) => {
        dispatch(receiveDisplayList(json));
      };

      window[cfgCallback] = (json) => {
        // if display_base is empty, we want to use same path as config
        json.display_base = getConfigBase(json.display_base); // eslint-disable-line no-param-reassign
        json.config_base = configBase; // eslint-disable-line no-param-reassign
        json.cog_server.info.base = // eslint-disable-line no-param-reassign
          getConfigBase(json.cog_server.info.base);
        dispatch(receiveConfig(json));
        if (json.data_type === 'jsonp') {
          getJSONP({
            url: `${json.display_base}/displayList.jsonp`,
            callbackName: dlCallback
          });
        } else {
          getJSON({
            url: `${json.display_base}/displayList.json`,
            callback: window[dlCallback]
          });
        }
      };

      getJSONP({
        url: config,
        callbackName: cfgCallback
      });
    } else {
      dispatch(receiveConfig(config.config));
      dispatch(receiveDisplayList(config.displayList));
      const name = config.displayList[0].name;
      const group = config.displayList[0].group;
      const desc = config.displayList[0].desc;

      dispatch(setSelectedDisplay(name, group, desc));
      dispatch(requestDisplay(name, group));
      const iface = config.displayObj.cogInterface;
      dispatch(receiveDisplay(name, group, config.displayObj));
      dispatch(receiveCogData(iface));
      dispatch(setLocalPanels(config.panels));
      setCogDatAndState(iface, config.cogData, config.displayObj, dispatch);
      setPanelInfo(config.displayObj, config.config, dispatch);
    }
  };

export const fetchDisplay = (name, group, cfg, id = '') =>
  (dispatch) => {
    dispatch(requestDisplay(name, group));

    const ldCallback = `__loadDisplayObj__${id}_${group}_${name}`;
    const cdCallback = `__loadCogData__${id}_${group}_${name}`;

    window[ldCallback] = (dObjJson) => {
      const iface = dObjJson.cogInterface;
      // now that displayObj is available, we can set the state with this data
      dispatch(receiveDisplay(name, group, dObjJson));
      // set cog data state as pending while it loads
      dispatch(receiveCogData(iface));
      // TODO: perhaps do a quick load of initial panels while cog data is loading...
      // (to do this, have displayObj store initial panel keys and cogs)

      window[cdCallback] = (cogDatJson) => {
        // once cog data is loaded, set the state with this data
        // but first add an index column to the data so we can
        // preserve original order or do multi-column sorts
        setCogDatAndState(iface, cogDatJson, dObjJson, dispatch);
      };

      setPanelInfo(dObjJson, cfg, dispatch);

      // load the cog data
      if (cfg.data_type === 'jsonp') {
        getJSONP({
          url: `${cfg.display_base}/${iface.group}/${iface.name}/cogData.jsonp`,
          callbackName: 'cdCallback'
        });
      } else {
        getJSON({
          url: `${cfg.display_base}/${iface.group}/${iface.name}/cogData.json`,
          callback: window[cdCallback]
        });
      }
    };

    // get displayObj.json so we can find the cog data, etc.
    if (cfg.data_type === 'jsonp') {
      getJSONP({
        url: `${cfg.display_base}/${group}/${name}/displayObj.jsonp`,
        callbackName: 'ldCallback'
      });
    } else {
      getJSON({
        url: `${cfg.display_base}/${group}/${name}/displayObj.json`,
        callback: window[ldCallback]
      });
    }
  };

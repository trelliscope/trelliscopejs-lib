import React from 'react';
import { json as d3json } from 'd3-request';
import * as crossfilter from 'crossfilter2';
import { default as getJSONP } from 'browser-jsonp'; // eslint-disable-line import/no-named-default
import { loadAssetsSequential, findWidget } from '../loadAssets';
import {
  SET_APP_ID, SET_FULLSCREEN, WINDOW_RESIZE, UPDATE_DIMS,
  SET_ERROR_MESSAGE, ACTIVE_SIDEBAR, SET_LAYOUT, SET_LABELS, SET_SORT,
  SET_FILTER, SET_FILTER_VIEW, SELECT_DISPLAY, REQUEST_DISPLAY,
  RECEIVE_DISPLAY, REQUEST_DISPLAY_LIST, RECEIVE_DISPLAY_LIST,
  RECEIVE_COGDATA, REQUEST_CONFIG, RECEIVE_CONFIG,
  SET_DIALOG_OPEN, SET_PANEL_RENDERER, SET_LOCAL_PANELS,
  SB_LOOKUP, SET_DISPSELECT_DIALOG_OPEN, SET_SELECTED_RELDISPS,
  SET_REL_DISP_POSITIONS
} from '../constants';

const getJSON = (obj) => d3json(obj.url, (json) => obj.callback(json));

export const setAppID = (id) => ({
  type: SET_APP_ID, id
});

export const setFullscreen = (fullscreen) => ({
  type: SET_FULLSCREEN, fullscreen
});

export const windowResize = (dims) => (
  { type: WINDOW_RESIZE, dims }
);

export const setAppDims = (dims) => (
  { type: UPDATE_DIMS, dims }
);

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

export const setDispSelectDialogOpen = (isOpen) => ({
  type: SET_DISPSELECT_DIALOG_OPEN, isOpen
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

export const setSelectedRelDisps = (arr) => ({
  type: SET_SELECTED_RELDISPS,
  which: 'set',
  val: arr
});

export const addRelDisp = (i) => ({
  type: SET_SELECTED_RELDISPS,
  which: 'add',
  val: i
});

export const removeRelDisp = (i) => ({
  type: SET_SELECTED_RELDISPS,
  which: 'remove',
  val: i
});

export const resetRelDisps = (i) => ({
  type: SET_SELECTED_RELDISPS,
  which: 'reset',
  val: i
});

export const setRelDispPositions = (obj) => ({
  type: SET_REL_DISP_POSITIONS, obj
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

export const setPanelRenderers = (name, fn) => ({
  type: SET_PANEL_RENDERER, name, fn
});

export const setLocalPanels = (dat) => ({
  type: SET_LOCAL_PANELS, dat
});

export const setErrorMessage = (msg) => ({
  type: SET_ERROR_MESSAGE, msg
});

const setCogDatAndState = (iface, cogDatJson, dObjJson, dispatch, hash) => {
  const hashItems = {};
  hash.replace('#', '').split('&').forEach((d) => {
    const tuple = d.split('=');
    hashItems[tuple[0]] = tuple[[1]];
  });

  for (let i = 0; i < cogDatJson.length; i += 1) {
    cogDatJson[i].__index = i; // eslint-disable-line no-param-reassign
  }
  dispatch(receiveCogData(iface, crossfilter(cogDatJson)));
  // now we can safely set several other default states that depend
  // on either display or cog data or can't be set until this data is loaded

  // sidebar
  if (hashItems.sidebar) {
    const sb = SB_LOOKUP[parseInt(hashItems.sidebar, 10)];
    dispatch(setActiveSidebar(sb));
  }

  // layout
  // (need to set layout before others because the default layout is 1,1
  //   and will be temporarily honored if this is set later)
  const { layout } = dObjJson.state;
  if (hashItems.nrow) {
    layout.nrow = parseInt(hashItems.nrow, 10);
  }
  if (hashItems.ncol) {
    layout.ncol = parseInt(hashItems.ncol, 10);
  }
  if (hashItems.arr) {
    layout.arrange = hashItems.arr;
  }
  dispatch(setLayout(layout));
  // need to do page number separately because it is recomputed when nrow/ncol are changed
  if (hashItems.pg) {
    dispatch(setLayout({ pageNum: parseInt(hashItems.pg, 10) }));
  }

  // labels
  let { labels } = dObjJson.state;
  if (hashItems.labels) {
    labels = hashItems.labels.split(',');
  }
  dispatch(setLabels(labels));

  // sort
  let { sort } = dObjJson.state;
  if (hashItems.sort) {
    sort = hashItems.sort.split(',').map((d, i) => {
      const vals = d.split(';');
      return ({
        order: i + 1,
        name: vals[0],
        dir: vals[1]
      });
    });
  }
  dispatch(setSort(sort));

  // filter
  const filter = dObjJson.state.filter ? dObjJson.state.filter : {};
  if (hashItems.filter) {
    const fltrs = hashItems.filter.split(',');
    fltrs.forEach((flt) => {
      const fltItems = {};
      flt.split(';').forEach((d) => {
        const tuple = d.split(':');
        fltItems[tuple[0]] = tuple[[1]];
      });
      // fltItems.var
      const fltState = {
        name: fltItems.var,
        type: fltItems.type,
        varType: dObjJson.cogInfo[fltItems.var].type
      };
      if (fltItems.type === 'select') {
        fltState.orderValue = 'ct,desc';
        fltState.value = fltItems.val.split('#').map(decodeURIComponent);
      } else if (fltItems.type === 'regex') {
        const { levels } = dObjJson.cogInfo[fltItems.var];
        const vals = [];
        const rval = new RegExp(decodeURIComponent(fltItems.val), 'i');
        levels.forEach((d) => { if (d.match(rval) !== null) { vals.push(d); } });
        fltState.regex = fltItems.val;
        fltState.value = vals;
        fltState.orderValue = 'ct,desc';
      } else if (fltItems.type === 'range') {
        const from = fltItems.from ? parseFloat(fltItems.from, 10) : undefined;
        const to = fltItems.to ? parseFloat(fltItems.to, 10) : undefined;
        fltState.value = { from, to };
        fltState.valid = true;
        if (from && to && from > to) {
          fltState.valid = false;
        }
      }
      filter[fltItems.var] = fltState;
    });
  }
  dispatch(setFilter(filter));

  let fv = [];
  if (hashItems.fv) {
    fv = hashItems.fv.split(',');
  }

  const ciKeys = Object.keys(dObjJson.cogInfo);
  for (let i = 0; i < ciKeys.length; i += 1) {
    if (dObjJson.cogInfo[ciKeys[i]].filterable) {
      if (fv.indexOf(ciKeys[i]) > -1) {
        dispatch(setFilterView(ciKeys[i], 'add'));
      } else if (dObjJson.state.filter
        && dObjJson.state.filter[ciKeys[i]] !== undefined) {
        dispatch(setFilterView(ciKeys[i], 'add'));
      } else {
        dispatch(setFilterView(ciKeys[i], 'remove'));
      }
    }
  }
};

const setPanelInfo = (dObjJson, cfg, dispatch) => {
  if (dObjJson.panelInterface.type === 'image') {
    dispatch(setPanelRenderers(
      dObjJson.name,
      (x, width, height) => (
        <img
          src={x}
          alt="panel"
          style={{ width, height }}
        />
      ))
    );
  } else if (dObjJson.panelInterface.type === 'image_src') {
    dispatch(setPanelRenderers(
      dObjJson.name,
      (x) => (
        <img
          src={x}
          alt="panel"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          // style={{ width, height }}
        />
      ))
    );
  } else if (dObjJson.panelInterface.type === 'htmlwidget') {
    const prCallback = () => {
      const binding = findWidget(dObjJson.panelInterface.deps.name);

      dispatch(setPanelRenderers(
        dObjJson.name,
        (x, width, height, post, key) => {
          const el = document.getElementById(`widget_outer_${key}`);
          const child = document.getElementById(`widget_${key}`)
          if (post && el && child === null) {
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

            if (!(x.evals instanceof Array)) {
              x.evals = [x.evals]; // eslint-disable-line no-param-reassign
            }
            for (let i = 0; x.evals && i < x.evals.length; i += 1) {
              window.HTMLWidgets.evaluateStringMember(x.x, x.evals[i]);
            }

            binding.renderValue(dv, x.x, initResult);
            // evalAndRun(x.jsHooks.render, initResult, [el, x.x]);
          } else {
            return <div id={`widget_outer_${key}`} />;
          }
          return null;
        })
      );
    };

    if (cfg.config_base) {
      // this will set the panelRenderer but only after assets have been loaded
      loadAssetsSequential(dObjJson.panelInterface.deps, cfg.config_base, prCallback);
    } else if (cfg.display_base === '__self__') {
      // if the widget is self-contained, we don't need to load assets
      prCallback();
    }
  }
};

export const fetchDisplay = (name, group, cfg, id = '', hash = '', getCogData = true) => (dispatch) => {
  dispatch(requestDisplay(name, group));

  const ldCallback = `__loadDisplayObj__${id}_${group}_${name}`;
  const cdCallback = `__loadCogData__${id}_${group}_${name}`;

  window[ldCallback] = (dObjJson) => {
    const iface = dObjJson.cogInterface;
    // now that displayObj is available, we can set the state with this data
    dispatch(receiveDisplay(name, group, dObjJson));

    setPanelInfo(dObjJson, cfg, dispatch);

    // set cog data state as pending while it loads
    if (getCogData) {
      dispatch(receiveCogData(iface));
      // TODO: perhaps do a quick load of initial panels while cog data is loading...
      // (to do this, have displayObj store initial panel keys and cogs)

      window[cdCallback] = (cogDatJson) => {
        // once cog data is loaded, set the state with this data
        // but first add an index column to the data so we can
        // preserve original order or do multi-column sorts
        setCogDatAndState(iface, cogDatJson, dObjJson, dispatch, hash);
      };

      // load the cog data
      if (cfg.data_type === 'jsonp') {
        getJSONP({
          url: `${cfg.display_base}${iface.group}/${iface.name}/cogData.jsonp`,
          callbackName: 'cdCallback',
          error: (err) => dispatch(setErrorMessage(
            `Couldn't load cognostics data: ${err.url}`
          ))
        });
      } else {
        getJSON({
          url: `${cfg.display_base}${iface.group}/${iface.name}/cogData.json`,
          callback: window[cdCallback]
        }).on('error', (err) => dispatch(setErrorMessage(
          `Couldn't load display list: ${err.target.responseURL}`
        )));
      }
    }
  };

  // get displayObj.json so we can find the cog data, etc.
  if (cfg.data_type === 'jsonp') {
    getJSONP({
      url: `${cfg.display_base}${group}/${name}/displayObj.jsonp`,
      callbackName: 'ldCallback',
      error: (err) => dispatch(setErrorMessage(
        `Couldn't load display object: ${err.url}`
      ))
    });
  } else {
    getJSON({
      url: `${cfg.display_base}${group}/${name}/displayObj.json`,
      callback: window[ldCallback]
    }).on('error', (err) => dispatch(setErrorMessage(
      `Couldn't load display list: ${err.target.responseURL}`
    )));
  }
};

// the display list is only loaded once at the beginning
// but it needs the config so we'll load config first
export const fetchDisplayList = (
  config = 'config.jsonp', id = '', singlePageApp = false
) => (dispatch) => {
  const selfContained = !(typeof config === 'string' || config instanceof String);

  if (!selfContained) {
    dispatch(requestConfig());

    const dlCallback = `__loadDisplayList__${id}`;
    const cfgCallback = `__loadTrscopeConfig__${id}`;

    const configBase = config.replace(/[^\/]*$/, ''); // eslint-disable-line no-useless-escape

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

    window[cfgCallback] = (cfg) => {
      // if display_base is empty, we want to use same path as config
      // eslint-disable-next-line no-param-reassign
      cfg.display_base = getConfigBase(cfg.display_base);
      cfg.config_base = configBase; // eslint-disable-line no-param-reassign
      // eslint-disable-next-line no-param-reassign
      cfg.cog_server.info.base = getConfigBase(cfg.cog_server.info.base);
      dispatch(receiveConfig(cfg));

      window[dlCallback] = (json) => {
        dispatch(receiveDisplayList(json));
        // check to see if a display is specified already in the URL
        // and load it if it is
        const { hash } = window.location;
        const hashItems = {};
        hash.replace('#', '').split('&').forEach((d) => {
          const tuple = d.split('=');
          hashItems[tuple[0]] = tuple[[1]];
        });
        if (hashItems.display) {
          const names = json.map((d) => d.name);
          const idx = names.indexOf(hashItems.display);
          if (idx > -1) {
            const dObj = json[idx];
            dispatch(setSelectedDisplay(dObj.name, dObj.group, dObj.desc));
            dispatch(fetchDisplay(dObj.name, dObj.group, cfg, id, hash));
          }
        } else if (singlePageApp) {
          dispatch(setDialogOpen(true));
          dispatch(setDispSelectDialogOpen(true));
        }
      };

      if (cfg.data_type === 'jsonp') {
        getJSONP({
          url: `${cfg.display_base}displayList.jsonp`,
          callbackName: dlCallback,
          error: (err) => dispatch(setErrorMessage(
            `Couldn't load display list: ${err.url}`
          ))
        });
      } else {
        getJSON({
          url: `${cfg.display_base}displayList.json`,
          callback: window[dlCallback]
        }).on('error', (err) => dispatch(setErrorMessage(
          `Couldn't load display list: ${err.target.responseURL}`
        )));
      }
    };
    // load the config to start
    // try json first and if the file isn't there, try jsonp

    const extRegex = /\.([0-9a-z]+)(?:[\?#]|$)/i; // eslint-disable-line no-useless-escape
    const configExt = config.match(extRegex)[0];

    if (configExt === '.jsonp') {
      getJSONP({
        url: config,
        callbackName: cfgCallback,
        error: (err) => dispatch(setErrorMessage(
          `Couldn't load config: ${err.url}`
        ))
      });
    } else if (configExt === '.json') {
      getJSON({
        url: config,
        callback: window[cfgCallback]
      });
    } else {
      dispatch(setErrorMessage(
        `Config specified as ${config} must have extension '.json' or '.jsonp'`
      ));
    }
  } else {
    // all data for rendering app is self-contained in document
    dispatch(receiveConfig(config.config));
    dispatch(receiveDisplayList(config.displayList));
    const { name } = config.displayList[0];
    const { group } = config.displayList[0];
    const { desc } = config.displayList[0];

    dispatch(setSelectedDisplay(name, group, desc));
    dispatch(requestDisplay(name, group));
    const iface = config.displayObj.cogInterface;
    dispatch(receiveDisplay(name, group, config.displayObj));
    dispatch(receiveCogData(iface));
    dispatch(setLocalPanels(config.panels));
    setCogDatAndState(iface, config.cogData, config.displayObj, dispatch, '');
    setPanelInfo(config.displayObj, config.config, dispatch);
  }
};

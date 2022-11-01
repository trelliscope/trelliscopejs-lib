import crossfilter, { Crossfilter } from 'crossfilter2';
import ReactGA from 'react-ga';
import getJSONP from 'browser-jsonp';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { loadAssetsSequential } from '../loadAssets';
import { getInputsAPI } from '../inputUtils';
import { AppDispatch, RootState } from '../store';
import { setActiveSidebar } from '../slices/sidebarSlice';
import {
  SET_APP_ID,
  SET_FULLSCREEN,
  WINDOW_RESIZE,
  UPDATE_DIMS,
  SET_ERROR_MESSAGE,
  SET_LAYOUT,
  SET_LABELS,
  SET_SORT,
  SET_FILTER,
  SET_FILTER_VIEW,
  SELECT_DISPLAY,
  REQUEST_DISPLAY,
  RECEIVE_DISPLAY,
  REQUEST_DISPLAY_LIST,
  RECEIVE_DISPLAY_LIST,
  RECEIVE_COGDATA,
  REQUEST_CONFIG,
  RECEIVE_CONFIG,
  SET_DIALOG_OPEN,
  SET_LOCAL_PANELS,
  SB_LOOKUP,
  SET_DISPSELECT_DIALOG_OPEN,
  SET_SELECTED_RELDISPS,
  SET_DISPINFO_DIALOG_OPEN,
  SET_REL_DISP_POSITIONS,
  SET_SINGLE_PAGE_APP,
  SET_OPTIONS,
} from '../constants';

const getJSON = (obj: { url: string; callback: (data: never) => void }) =>
  fetch(obj.url)
    .then((response) => response.json() as never)
    .then((json) => obj.callback(json));

export const setAppID = (id: string) => ({
  type: SET_APP_ID,
  id,
});

export const setOptions = (options: { logger?: boolean; mockData?: boolean }) => ({
  type: SET_OPTIONS,
  options,
});

export const setFullscreen = (fullscreen: boolean) => ({
  type: SET_FULLSCREEN,
  fullscreen,
});

export const setSinglePageApp = (singlePageApp: boolean) => ({
  type: SET_SINGLE_PAGE_APP,
  singlePageApp,
});

export const windowResize = (dims: { width: number; height: number }) => ({ type: WINDOW_RESIZE, dims });

export const setAppDims = (dims: { width: number; height: number }) => ({ type: UPDATE_DIMS, dims });

export const requestConfig = () => ({
  type: REQUEST_CONFIG,
});

export const receiveConfig = (json: Config) => ({
  type: RECEIVE_CONFIG,
  config: json,
  receivedAt: Date.now(),
});

export const setDialogOpen = (isOpen: boolean) => ({
  type: SET_DIALOG_OPEN,
  isOpen,
});

export const setDispSelectDialogOpen = (isOpen: boolean) => ({
  type: SET_DISPSELECT_DIALOG_OPEN,
  isOpen,
});

export const setDispInfoDialogOpen = (isOpen: boolean) => ({
  type: SET_DISPINFO_DIALOG_OPEN,
  isOpen,
});

export const setLayout = (layout: { nrow?: number; ncol?: number; arrange?: 'row' | 'col'; pageNum?: number }) => ({
  type: SET_LAYOUT,
  layout,
});

export const setLabels = (labels: string[]) => ({
  type: SET_LABELS,
  labels,
});

export const setSort = (sort?: Sort[] | number) => ({
  type: SET_SORT,
  sort,
});

export const setFilter = (filter?: { [key: string]: Filter<FilterCat | FilterRange> } | string) => ({
  type: SET_FILTER,
  filter,
});

export const setFilterView = (name: FilterView | string, which?: 'set' | 'add' | 'remove') => ({
  type: SET_FILTER_VIEW,
  name,
  which,
});

export const requestDisplayList = () => ({
  type: REQUEST_DISPLAY_LIST,
});

export const receiveDisplayList = (json: Display[]) => ({
  type: RECEIVE_DISPLAY_LIST,
  list: json,
  receivedAt: Date.now(),
});

export const setSelectedDisplay = (name: string, group: string, desc: string) => ({
  type: SELECT_DISPLAY,
  name,
  group,
  desc,
});

export const setSelectedRelDisps = (arr: number[]) => ({
  type: SET_SELECTED_RELDISPS,
  which: 'set',
  val: arr,
});

// export const setSelectedView = (val) => ({
//   type: SET_SELECTED_VIEW,
//   val
// });

export const resetRelDisps = (i?: number[]) => ({
  type: SET_SELECTED_RELDISPS,
  which: 'reset',
  val: i,
});

export const setRelDispPositions = (obj: RelDispPositions[]) => ({
  type: SET_REL_DISP_POSITIONS,
  obj,
});

export const requestDisplay = (name: string, group: string) => ({
  type: REQUEST_DISPLAY,
  name,
  group,
});

export const receiveDisplay = (name: string, group: string, json: DisplayObject) => ({
  type: RECEIVE_DISPLAY,
  name,
  group,
  info: json,
  receivedAt: Date.now(),
});

const receiveCogData = (iface: CogInterface, json?: Crossfilter<CogData>) => ({
  type: RECEIVE_COGDATA,
  iface,
  crossfilter: json,
  receivedAt: Date.now(),
});

export const setLocalPanels = (dat: unknown) => ({
  type: SET_LOCAL_PANELS,
  dat,
});

export const setErrorMessage = (msg: string) => ({
  type: SET_ERROR_MESSAGE,
  msg,
});

const setCogDatAndState = (
  iface: CogInterface,
  cogDatJson: CogData[],
  dObjJson: DisplayObject,
  dispatch: AppDispatch,
  hash: string,
): void => {
  let hashItems = {} as HashItem;
  hash
    .replace('#', '')
    .split('&')
    .forEach((d) => {
      const tuple: string[] = d.split('=');
      hashItems = { ...hashItems, [tuple[0]]: tuple[1] };
    });

  for (let i = 0; i < cogDatJson.length; i += 1) {
    cogDatJson[i].__index = i; // eslint-disable-line no-param-reassign
  }

  dispatch(receiveCogData(iface, crossfilter(cogDatJson)));
  // now we can safely set several other default states that depend
  // on either display or cog data or can't be set until this data is loaded

  // sidebar
  let sb = dObjJson.state.sidebar;
  if (hashItems.sidebar) {
    sb = parseInt(hashItems.sidebar, 10);
  }
  if (sb && sb >= 0) {
    dispatch(setActiveSidebar(SB_LOOKUP[sb]));
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
    dispatch(setLayout({ ...layout, pageNum: parseInt(hashItems.pg, 10) }));
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
      return {
        order: i + 1,
        name: vals[0],
        dir: vals[1] as SortDir,
      };
    });
  }
  dispatch(setSort(sort));

  // filter
  const filter = (dObjJson.state.filter ? dObjJson.state.filter : {}) as { [key: string]: Filter<FilterCat | FilterRange> };
  if (hashItems.filter) {
    const fltrs = hashItems.filter.split(',');
    fltrs.forEach((flt) => {
      let fltItems = {} as FilterItem;
      flt.split(';').forEach((d) => {
        const tuple = d.split(':');
        fltItems = { ...fltItems, [tuple[0]]: tuple[1] };
      });
      // fltItems.var
      const fltState = {
        name: fltItems.var,
        type: fltItems.type,
        varType: dObjJson.cogInfo[fltItems.var].type,
      } as Filter<FilterCat | FilterRange>;
      if (fltItems.type === 'select') {
        fltState.orderValue = 'ct,desc';
        fltState.value = fltItems.val.split('#').map(decodeURIComponent);
      } else if (fltItems.type === 'regex') {
        const { levels } = dObjJson.cogInfo[fltItems.var];
        const vals = [] as string[];
        const rval = new RegExp(decodeURIComponent(fltItems.val), 'i');
        levels.forEach((d) => {
          if (d.match(rval) !== null) {
            vals.push(d);
          }
        });
        fltState.regex = fltItems.val;
        fltState.value = vals;
        fltState.orderValue = 'ct,desc';
      } else if (fltItems.type === 'range') {
        const from = fltItems.from ? parseFloat(fltItems.from) : undefined;
        const to = fltItems.to ? parseFloat(fltItems.to) : undefined;
        fltState.value = { from, to };
        fltState.valid = true;
        if (from && to && from > to) {
          fltState.valid = false;
        }
      }
      filter[fltItems.var] = fltState;
    });
  }

  let fv = dObjJson.state.fv ? dObjJson.state.fv : [];
  if (hashItems.fv) {
    fv = hashItems.fv.split(',');
  }

  const ciKeys = Object.keys(dObjJson.cogInfo);
  const fvObj = {
    active: [],
    inactive: [],
  } as FilterView;

  for (let i = 0; i < ciKeys.length; i += 1) {
    if (dObjJson.cogInfo[ciKeys[i]].filterable) {
      if (fv.includes(ciKeys[i])) {
        fvObj.active.push(ciKeys[i]);
      } else if (dObjJson.state.filter && dObjJson.state.filter[ciKeys[i]] !== undefined) {
        fvObj.active.push(ciKeys[i]);
      } else {
        fvObj.inactive.push(ciKeys[i]);
      }
    }
  }
  dispatch(setFilterView(fvObj, 'set'));
  dispatch(setFilter(filter));
};

const setPanelInfo = (dObjJson: DisplayObject, cfg: Config) => {
  if (dObjJson.panelInterface.type === 'htmlwidget') {
    if (cfg.config_base) {
      // this will set the panelRenderer but only after assets have been loaded
      loadAssetsSequential(dObjJson.panelInterface.deps, cfg.config_base);
    }
  }
};

export const fetchDisplay =
  (
    name: string,
    group: string,
    cfg: Config,
    id = '',
    hash = '',
    getCogData = true,
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(requestDisplay(name, group));

    const ldCallback = `__loadDisplayObj__${id}_${group}_${name}`;
    const cdCallback = `__loadCogData__${id}_${group}_${name}`;

    window[ldCallback] = (dObjJson: DisplayObject) => {
      const iface = dObjJson.cogInterface;
      // now that displayObj is available, we can set the state with this data
      dispatch(receiveDisplay(name, group, dObjJson));

      setPanelInfo(dObjJson, cfg);

      if (dObjJson.showMdDesc) {
        dispatch(setDispInfoDialogOpen(true));
      }

      // set cog data state as pending while it loads
      if (getCogData) {
        dispatch(receiveCogData(iface));
        // TODO: perhaps do a quick load of initial panels while cog data is loading...
        // (to do this, have displayObj store initial panel keys and cogs)

        window[cdCallback] = (cogDatJson: CogData[]) => {
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
            error: (err) => dispatch(setErrorMessage(`Couldn't load cognostics data: ${err.url}`)),
          });
        } else {
          getJSON({
            url: `${cfg.display_base}${iface.group}/${iface.name}/cogData.json`,
            callback: window[cdCallback],
          }).catch(() => {
            dispatch(
              setErrorMessage(`Couldn't load display list: ${cfg.display_base}${iface.group}/${iface.name}/cogData.json`),
            );
          });
        }

        // if storing inputs through an API, set localStorage accordingly
        if (dObjJson.has_inputs && dObjJson.input_type === 'API') {
          getInputsAPI(dObjJson);
        }
      }
    };

    // get displayObj.json so we can find the cog data, etc.
    if (cfg.data_type === 'jsonp') {
      getJSONP({
        url: `${cfg.display_base}${group}/${name}/displayObj.jsonp`,
        callbackName: 'ldCallback',
        error: (err) => dispatch(setErrorMessage(`Couldn't load display object: ${err.url}`)),
      });
    } else {
      getJSON({
        url: `${cfg.display_base}${group}/${name}/displayObj.json`,
        callback: window[ldCallback],
      }).catch(() => {
        dispatch(setErrorMessage(`Couldn't load display list: ${cfg.display_base}${group}/${name}/displayObj.json`));
      });
    }
  };

// the display list is only loaded once at the beginning
// but it needs the config so we'll load config first
export const fetchDisplayList =
  (config = 'config.jsonp', id = '', singlePageApp = false): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    // don't read from the hash if not in single-page-app mode
    const hash = singlePageApp ? window.location.hash : '';

    dispatch(requestConfig());

    const dlCallback = `__loadDisplayList__${id}`;
    const cfgCallback = `__loadTrscopeConfig__${id}`;

    const configBase = config.replace(/[^\/]*$/, ''); // eslint-disable-line no-useless-escape

    const getConfigBase = (txt: string) => {
      let res = txt;
      if (!/^https?:\/\/|^file:\/\/|^\//.test(txt)) {
        res = configBase;
        if (txt !== '') {
          res += `${txt}/`;
        }
      }
      return res;
    };

    window[cfgCallback] = (cfg: Config) => {
      // if display_base is empty, we want to use same path as config
      // eslint-disable-next-line no-param-reassign
      cfg.display_base = getConfigBase(cfg.display_base) as Config['display_base'];
      cfg.config_base = configBase; // eslint-disable-line no-param-reassign
      // eslint-disable-next-line no-param-reassign
      cfg.cog_server.info.base = getConfigBase(cfg.cog_server.info.base);
      dispatch(receiveConfig(cfg));

      // register with google analytics if specified
      if (cfg.ga_id) {
        ReactGA.initialize(cfg.ga_id);
      }

      if (cfg.require_token === true) {
        const id1 = `${window.devicePixelRatio || ''}${navigator.userAgent.replace(/\D+/g, '')}`;
        const id2 = `${navigator.language.length || ''}${window.screen.colorDepth || ''}`;
        const id3 = `${new Date().getTimezoneOffset()}${navigator.platform.length || ''}`;
        const id4 = `${window.screen.height || ''}${window.screen.width || ''}${window.screen.pixelDepth || ''}`;
        const id5 = `${new Date().toLocaleDateString().replace(/\D+/g, '')}`;
        const token = `${id1}${id2}${id3}${id4}${id5}`;
        // console.log(token);
        // console.log(localStorage.getItem('TRELLISCOPE_TOKEN') === token);
        if (localStorage.getItem('TRELLISCOPE_TOKEN') !== token) {
          dispatch(
            setErrorMessage(
              'Visualization could not be loaded because it is not embedded in a properly authenticated website.',
            ),
          );
          return;
        }
      }

      window[dlCallback] = (json: Display[]) => {
        json.sort((a, b) => {
          const v1 = a.order === undefined ? 1 : a.order;
          const v2 = b.order === undefined ? 1 : b.order;
          return v1 > v2 ? 1 : -1;
        });

        dispatch(receiveDisplayList(json));
        // check to see if a display is specified already in the URL
        // and load it if it is
        let hashItems = {} as HashItem;
        hash
          .replace('#', '')
          .split('&')
          .forEach((d) => {
            const tuple = d.split('=');
            hashItems = { ...hashItems, [tuple[0]]: tuple[1] };
          });
        if (hashItems.display) {
          const names = json.map((d) => d.name);
          const idx = names.indexOf(hashItems.display);
          if (idx > -1) {
            const dObj = json[idx];
            dispatch(setSelectedDisplay(dObj.name, dObj.group, dObj.desc));
            dispatch(fetchDisplay(dObj.name, dObj.group, cfg, id, hash));
          }
        } else if (singlePageApp && json.length > 1) {
          dispatch(setDialogOpen(true));
          dispatch(setDispSelectDialogOpen(true));
        }
      };

      if (cfg.data_type === 'jsonp') {
        getJSONP({
          url: `${cfg.display_base}displayList.jsonp`,
          callbackName: dlCallback,
          error: (err) => dispatch(setErrorMessage(`Couldn't load display list: ${err.url}`)),
        });
      } else {
        getJSON({
          url: `${cfg.display_base}displayList.json`,
          callback: window[dlCallback],
        }).catch(() => {
          dispatch(setErrorMessage(`Couldn't load display list: ${cfg.display_base}displayList.json`));
        });
      }
    };
    // load the config to start
    // try json first and if the file isn't there, try jsonp

    const extRegex = /\.([0-9a-z]+)(?:[\?#]|$)/i; // eslint-disable-line no-useless-escape
    const configExt = (config.match(extRegex) || [])[0];

    if (configExt === '.jsonp') {
      getJSONP({
        url: `${config}`,
        callbackName: cfgCallback,
        error: (err) => dispatch(setErrorMessage(`Couldn't load config: ${err.url}`)),
      });
    } else if (configExt === '.json') {
      getJSON({
        url: config,
        callback: window[cfgCallback],
      });
    } else {
      dispatch(setErrorMessage(`Config specified as ${config} must have extension '.json' or '.jsonp'`));
    }
  };

interface Config {
  display_base: '/displays/' | '/__self__/';
  data_type: 'json' | 'jsonp';
  cog_server: CogServer;
  split_layout: boolean;
  has_legend: boolean;
  require_token: boolean;
  disclaimer: boolean;
}

interface CogServer {
  type: 'jsonp' | 'json';
  info: { base: string };
}

type Group = 'common' | 'condVar' | 'panelKey';

type PanelInterfaceType = 'image' | 'image_src' | 'htmlwidget';

type PanelInterfaceAssetType = 'script' | 'stylesheet';

interface PanelInterface {
  type: PanelInterfaceType;
  deps: {
    name: string;
    assets: {
      url: string;
      type: PanelInterfaceAssetType;
    };
  };
}

interface Display {
  // ?
  group: Group;
  name: string;
  desc: string;
  n: number;
  order: number;
  height: number;
  width: number;
  updated: string;
  keySig: string;
}

interface CurrentDisplayInfo {
  didInvalidate: boolean;
  info: DisplayObject;
  isFetching: boolean;
  isLoaded: boolean;
  lastUpdated: number;
}

interface DisplayObject {
  name: string;
  // ?
  group: Group;
  desc: string;
  mdDesc: string;
  mdTitle: string;
  showMdDesc: boolean;
  updated: string;
  n: number;
  height: number;
  width: number;
  order: number;
  has_legend: boolean;
  has_inputs: boolean;
  // ?
  input_type: 'localStorage' | undefined;
  input_email: string;
  // ?
  input_csv_vars: Array;
  // ?
  input_api: {
    set: function;
    get: function;
    getRequestOptions: function;
  };
  gaID: string;
  split_layout: boolean;
  split_aspect: boolean;
  keySig: string;
  cogInterface: {
    name: string;
    // ?
    group: Group;
    // ?
    type: string;
  };
  panelInterface: PanelInterface;
  imgSrcLookup: object;
  cogInfo: {
    [key: string]: CogInfo;
  };
  cogDistns: {
    [key: string]: CogDistns;
  };
  cogGroups: { [key: string]: Array<string> };
}

interface CogInfo {
  [key: string]: { name: string; desc: string };
  name: string;
  desc: string;
  // ?
  type: 'factor';
  group: Group;
  defLabel: boolean;
  defActive: boolean;
  filterable: boolean;
  log: boolean;
  levels: string[];
  range: number[];
  nnna: number;
  breaks: number[];
  delta: number;
}

interface CogDistns {
  type: 'factor' | 'numeric';
  dis: {
    [key: string]: number;
  };
}

interface CurDisplayInfo {
  didInvalidate: boolean;
  info: DisplayObject;
  isFetching: boolean;
  isLoaded: boolean;
  lastUpdated: number;
}

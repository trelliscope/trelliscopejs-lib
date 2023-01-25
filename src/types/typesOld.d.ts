interface Config {
  display_base: 'displays';
  data_type: 'json' | 'jsonp';
  cog_server: CogServer;
  split_layout: boolean;
  has_legend: boolean;
  require_token: boolean;
  disclaimer: boolean;
  config_base?: unknown;
  ga_id?: string;
}

interface CogServer {
  type: 'jsonp' | 'json';
  info: { base: string };
}

type Group = 'common' | 'condVar' | 'panelKey';

type PanelInterfaceType = 'image' | 'image_src' | 'htmlwidget';

type PanelInterfaceAssetType = 'script' | 'stylesheet';

type CogType =
  | 'factor'
  | 'numeric'
  | 'integer'
  | 'href'
  | 'href_hash'
  | 'input_text'
  | 'input_radio'
  | 'panelSrc'
  | 'panelSrcLocal'
  | 'key'
  | 'date'
  | 'time';

interface PanelAsset {
  url: string[];
  type: PanelInterfaceAssetType;
}

interface PanelInterface {
  type: PanelInterfaceType;
  deps: {
    name: string;
    assets: PanelAsset[];
  };
}

interface DisplaySelect {
  list: Display[];
  isLoaded: boolean;
}

interface CogInterface {
  name: string;
  // ?
  group: Group;
  // ?
  type: string;
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

// TODO this should probably live as a return type
// of `displayGroupSelector` once that file is converted to TS
type DisplayGroup = {
  [key in string]: number[];
};

interface DisplayObject {
  name: string;
  // ?
  group: Group;
  views: ViewItem[];
  desc: string;
  mdDesc: string;
  mdTitle: string;
  showMdDesc: boolean;
  updated: string;
  n: number;
  height: number;
  width: number;
  order: number | string[];
  has_legend: boolean;
  has_inputs: boolean;
  // ?
  input_type: 'localStorage' | 'API' | undefined;
  input_email: string;
  // ?
  input_csv_vars: Array;
  // ?
  input_api: {
    set: function;
    get: function;
    getRequestOptions: function;
    setRequestOptions: function;
  };
  gaID: string;
  split_layout: boolean;
  split_aspect: boolean;
  state: {
    labels: string[];
    layout: LayoutState;
    sort: Sort[];
    sidebar: number;
    filter: { [key: string]: Filter<FilterCat | FilterRange> };
    fv: string[];
  };
  keySig: string;
  cogInterface: CogInterface;
  panelInterface: PanelInterface;
  imgSrcLookup: {
    [key: string]: string;
  };
  cogInfo: {
    [key: string]: CogInfo;
  };
  cogDistns: {
    [key: string]: CogDistns;
  };
  cogGroups: { [key: string]: Array<string> };
}

interface CogInfo {
  name: string;
  desc: string;
  type: CogType;
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
  options: string[];
  height: number;
}

declare type CogDistns<D> = {
  type: 'string' | 'number' | 'factor' | 'date' | 'datetime' | 'href' | 'geo' | 'graph';
  dist: D;
  has_dist?: boolean;
  max?: number;
  log_default?: boolean;
};

interface CogDistnsFactor {
  [key: string]: number;
}

interface CogDistnsNumeric {
  raw: {
    breaks: number[];
    freq: number[];
  };
}

declare type Filter<V> = {
  name: string;
  varType: string;
  orderValue?: string;
  type?: string;
  regex?: string;
  valid?: boolean;
  value?: V;
};

type FilterCat = string[];

type FilterRange = {
  from?: number;
  to?: number;
};

interface FilterView {
  active: string[];
  inactive: string[];
}

type FilterItem = {
  var: string;
  type: string;
  val: string;
  from: string;
  to: string;
};

interface ViewItem {
  name: string;
  state: string;
}

interface Sort {
  order: number;
  name: string;
  dir: SortDir;
}

type SortDir = 'asc' | 'desc';
interface HTMLWidget {
  widgets: HTMLWidgetInstance[];
  initialize: (el: HTMLElement, width: number, height: number) => void;
  evaluateStringMember: (data: HTMLWidgetData['x'], evals: HTMLWidgetData['evals']) => void;
}

interface HTMLWidgetIntance {
  find: (selector: string) => HTMLElement;
}

interface HTMLWidgetData {
  evals: string[];
  x: unknown;
  jsHooks: unknown[];
}

type PanelData = string | HTMLWidgetData;

type PanelLabel = {
  name: string;
  value: string | number;
  type: CogType;
  desc: string;
};

interface Dims {
  contentWidth: number;
  fontSize: number;
  hOffset: number;
  hh: number;
  labelHeight: number;
  labelPad: number;
  labelWidth: number;
  nLabels: number;
  pHeight: number;
  pPad: number;
  pWidth: number;
  wOffset: number;
  ww: number;
}

interface FilterCatDist {
  dist: { [key: string]: number };
  has_dist: boolean;
  max: number;
  type: string;
}

interface CondDistFilterCat {
  dist: import('crossfilter2').Grouping<string, number>[];
  idx: number[];
  max: number;
  orderValue: string;
  reverseRows: boolean;
  sumSelected: number;
  totSelected: number;
  breaks: number[];
}

interface CondDistFilterNum {
  dist: import('crossfilter2').Grouping<string, number>[];
  max: number;
  breaks: number[];
  delta: number;
  range: [number, number];
  log: boolean;
}

interface LayoutState {
  nrow: number;
  ncol: number;
  arrange?: 'rows' | 'cols';
  pageNum: number;
}

interface FilterNumStateChange {
  name: string;
  type: string;
  varType: string;
  value?: { from: number | string | undefined; to: number | string | undefined };
  valid: boolean;
}

interface AppOptions {
  logger?: boolean;
  mockData?: boolean;
  callbacks?: {
    [key: string]: () => void;
  };
}
interface Window {
  trelliscopeApp: (id: string, config: string, options: AppOptions) => void;
}

interface CogData {
  [key: string]: string | number;
  panelKey: string;
}

interface CogDataMutable {
  isFetching: boolean;
  isLoaded: boolean;
  didInvalidate: boolean;
  lastUpdated?: number;
  crossfilter?: import('crossfilter2').Crossfilter<CogData>;
  dimensionRefs?: {
    [key: string]: import('crossfilter2').Dimension<CogData, string | number>;
  };
  groupRefs?: {
    [key: string]: import('crossfilter2').Group<CogData, import('crossfilter2').NaturallyOrderedValue, number>;
  };
  allRef?: import('crossfilter2').GroupAll<CogData, import('crossfilter2').NaturallyOrderedValue> | undefined;
  iface?: CogInterface;
}

type SidebarType =
  | 'Panel Grid Layout'
  | 'Filter Panels'
  | 'Sort Panels'
  | 'Show/Hide Labels'
  | 'Views'
  | 'Configuration'
  | '';

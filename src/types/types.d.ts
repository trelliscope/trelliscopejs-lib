interface Config {
  display_base: 'displays' | '__self__';
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
  url: string;
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
  isLoaded: string;
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

interface SelectedDisplay {
  group: string;
  name: string;
  desc: string;
}

// TODO this should probably live as a return type
// of `displayGroupSelector` once that file is converted to TS
type DisplayGroup = {
  [key in string]: number[];
};

interface CurrentDisplayInfo {
  didInvalidate: boolean;
  info: DisplayObject;
  isFetching: boolean;
  isLoaded: boolean;
  lastUpdated: number;
}

interface DisplayList extends CurrentDisplayInfo {
  list: DisplayObject[];
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
  order: number | string[];
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
  [key: string]: { name: string; desc: string };
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

interface CogDistns {
  type: 'factor' | 'numeric';
  dis: {
    [key: string]: number;
  };
}

interface CondDist {
  breaks: number[];
  delta: number;
  dist: [
    {
      key: number;
      value: number;
    },
  ];
  log: boolean;
  max: number;
}

interface FilterCommon {
  name: string;
  orderValue: string;
  type?: string;
  varType: string;
}

interface FilterCat extends FilterCommon {
  value?: string[];
  regex?: string;
}
interface FilterNumPlotFilter extends FilterCommon {
  value: {
    from: number;
    to: number;
  };
}

interface FilterNumFilter extends FilterNumPlotFilter {
  valid: boolean;
}

interface SidebarViewsFilter extends FilterCommon {
  value: string[] | { from: number | undefined; to: number | undefined };
  regex: string;
  valid: boolean;
}

interface SidebarViewsFilterKey {
  [key: string]: SidebarViewsFilter;
}

interface ViewItem {
  name: string;
  state: string;
}

interface HashItem {
  [key: string]: string;
  arr: string;
  filter: string;
  fv: string;
  labels: string;
  ncol: string;
  nrow: string;
  pg: string;
  sidebar: string;
  sort: string;
  var: string;
}

interface DisplayInfoState {
  isFetching: boolean;
  didInvalidate: boolean;
  isLoaded: boolean;
  lastUpdated: number;
  info: DisplayObject;
}

type PanelData = string | { evals: string[]; x: any };

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
  nLabels: 1;
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
  dist: { key: string; value: number }[];
  idx: number[];
  max: number;
  orderValue: string;
  reverseRows: true;
  sumSelected: number;
  totSelected: number;
}

interface LayoutState {
  nrow: number;
  ncol: number;
  arrange: 'row' | 'col';
  pageNum: number;
}

interface PanelRenderers {
  [key: string]: {
    fn: (x: PanelData, width: number, height: number, post?: boolean, key?: string) => JSX.Element;
  };
}

interface RelDispPositions {
  aspect: number;
  col: number;
  group: string;
  height: number;
  width: number;
  idx: number;
  left: number;
  name: string;
  row: number;
  top: number;
}

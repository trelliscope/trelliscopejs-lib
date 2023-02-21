interface CogInterface {
  name: string;
  // ?
  group: Group;
  // ?
  type: string;
}

type Group = 'common' | 'condVar' | 'panelKey';

interface FilterView {
  active: string[];
  inactive: string[];
}
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

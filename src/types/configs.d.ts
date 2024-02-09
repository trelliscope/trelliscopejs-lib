/* ------------------------------------------------------ */
/* meta                                                   */
/* ------------------------------------------------------ */

type MetaType = 'string' | 'number' | 'factor' | 'date' | 'datetime' | 'href' | 'geo' | 'graph' | 'currency' | 'panel';
// type RangeMetaType = 'number' | 'currency' | 'date' | 'datetime';
// type StringMetaType = 'string' | 'factor';

type GraphDirection = 'none' | 'from' | 'to';
type CurrencyCode =
  | 'AED'
  | 'AFN'
  | 'ALL'
  | 'AMD'
  | 'ANG'
  | 'AOA'
  | 'ARS'
  | 'AUD'
  | 'AWG'
  | 'AZN'
  | 'BAM'
  | 'BBD'
  | 'BDT'
  | 'BGN'
  | 'BHD'
  | 'BIF'
  | 'BMD'
  | 'BND'
  | 'BOB'
  | 'BOV'
  | 'BRL'
  | 'BSD'
  | 'BTN'
  | 'BWP'
  | 'BYN'
  | 'BZD'
  | 'CAD'
  | 'CDF'
  | 'CHE'
  | 'CHF'
  | 'CHW'
  | 'CLF'
  | 'CLP'
  | 'CNY'
  | 'COP'
  | 'COU'
  | 'CRC'
  | 'CUC'
  | 'CUP'
  | 'CVE'
  | 'CZK'
  | 'DJF'
  | 'DKK'
  | 'DOP'
  | 'DZD'
  | 'EGP'
  | 'ERN'
  | 'ETB'
  | 'EUR'
  | 'FJD'
  | 'FKP'
  | 'GBP'
  | 'GEL'
  | 'GHS'
  | 'GIP'
  | 'GMD'
  | 'GNF'
  | 'GTQ'
  | 'GYD'
  | 'HKD'
  | 'HNL'
  | 'HRK'
  | 'HTG'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'IQD'
  | 'IRR'
  | 'ISK'
  | 'JMD'
  | 'JOD'
  | 'JPY'
  | 'KES'
  | 'KGS'
  | 'KHR'
  | 'KMF'
  | 'KPW'
  | 'KRW'
  | 'KWD'
  | 'KYD'
  | 'KZT'
  | 'LAK'
  | 'LBP'
  | 'LKR'
  | 'LRD'
  | 'LSL'
  | 'LYD'
  | 'MAD'
  | 'MDL'
  | 'MGA'
  | 'MKD'
  | 'MMK'
  | 'MNT'
  | 'MOP'
  | 'MRU'
  | 'MUR'
  | 'MVR'
  | 'MWK'
  | 'MXN'
  | 'MXV'
  | 'MYR'
  | 'MZN'
  | 'NAD'
  | 'NGN'
  | 'NIO'
  | 'NOK'
  | 'NPR'
  | 'NZD'
  | 'OMR'
  | 'PAB'
  | 'PEN'
  | 'PGK'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'PYG'
  | 'QAR'
  | 'RON'
  | 'RSD'
  | 'RUB'
  | 'RWF'
  | 'SAR'
  | 'SBD'
  | 'SCR'
  | 'SDG'
  | 'SEK'
  | 'SGD'
  | 'SHP'
  | 'SLE'
  | 'SLL'
  | 'SOS'
  | 'SRD'
  | 'SSP'
  | 'STN'
  | 'SVC'
  | 'SYP'
  | 'SZL'
  | 'THB'
  | 'TJS'
  | 'TMT'
  | 'TND'
  | 'TOP'
  | 'TRY'
  | 'TTD'
  | 'TWD'
  | 'TZS'
  | 'UAH'
  | 'UGX'
  | 'USD'
  | 'USN'
  | 'UYI'
  | 'UYU'
  | 'UYW'
  | 'UZS'
  | 'VED'
  | 'VES'
  | 'VND'
  | 'VUV'
  | 'WST'
  | 'XAF'
  | 'XAG'
  | 'XAU'
  | 'XBA'
  | 'XBB'
  | 'XBC'
  | 'XBD'
  | 'XCD'
  | 'XDR'
  | 'XOF'
  | 'XPD'
  | 'XPF'
  | 'XPT'
  | 'XSU'
  | 'XTS'
  | 'XUA'
  | 'XXX'
  | 'YER'
  | 'ZAR'
  | 'ZMW'
  | 'ZWL';

interface IMeta {
  name: string;
  varname: string;
  type: MetaType;
  label: string;
  tags: string[];
  filterable: boolean;
  sortable: boolean;
  maxnchar: number;
  code?: string;
  log: boolean;
  levels?: string[];
  digits: number;
  filterSortOrder: 'ct,asc' | 'ct,desc' | 'id,asc' | 'id,desc';
  locale: boolean;
}

interface INumberMeta extends IMeta {
  digits: number | null; // should be integer
  locale: boolean;
}

interface ICurrencyMeta extends IMeta {
  code: CurrencyCode;
}

interface IFactorMeta extends IMeta {
  levels: string[];
}

interface IStringMeta extends IMeta {}

interface IDateMeta extends IMeta {}

// do we want to support this?
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
interface IDatetimeMeta extends IMeta {
  timezone: string;
}

interface IHrefMeta extends IMeta {}

interface IGraphMeta extends IMeta {
  idvarname: string;
  direction: GraphDirection;
}

/* ------------------------------------------------------ */
/* inputs                                                 */
/* ------------------------------------------------------ */

// how the inputs will be stored (client side doesn't have any properties)

interface IInputClientSideStorage {
  type: 'localStorage';
}

// how the inputs will be relayed back to the creator of the display
interface IInputEmailFeedback {
  feedbackEmail: string;
  includeMetaVars: string[];
}

interface IInputs {
  inputs: IInput[];
  storageInterface: IInputClientSideStorage;
  feedbackInterface: IInputEmailFeedback;
}

type InputType = 'radio' | 'checkbox' | 'select' | 'multiselect' | 'text' | 'number';

interface IInput {
  varname: string;
  name: string;
  label: string;
  active: boolean;
  type: InputType;
  maxnchar: number;
  sortable: boolean;
  tags: string[];
  levels?: string[];
  digits?: number;
  code?: string;
}

interface IRadioInput extends IInput {
  options: string[];
}

interface ICheckboxInput extends IInput {
  options: string[];
}

interface ISelectInput extends IInput {
  options: string[];
}

interface IMultiselectInput extends IInput {
  options: string[];
}

interface ITextInput extends IInput {
  height: number;
}

interface INumberInput extends IInput {
  min: number | null;
  max: number | null;
}

/* ------------------------------------------------------ */
/* states                                                 */
/* ------------------------------------------------------ */

type StateType = 'layout' | 'labels' | 'sort' | 'filter';
type SortDirType = 'asc' | 'desc';
type FilterType = 'category' | 'numberrange' | 'daterange' | 'datetimerange';

interface IDisplayState {
  layout: ILayoutState;
  labels: ILabelState;
  sort: ISortState[];
  filter: IFilterState[];
  filterView: string[];
}

interface IState {
  type: StateType;
}

type ViewType = 'table' | 'grid';

interface ILayoutState extends IState {
  nrow: number; // why??
  ncol: number;
  page: number;
  viewtype: ViewType;
  panel: string; // why??
  sidebarActive: boolean;
  showLabels: boolean; // why??
}

interface ILabelState extends IState {
  varnames: string[];
  tags: string[];
}

interface ISortState extends IState {
  varname: string;
  dir: SortDirType;
  metatype: MetaType;
}

// what is this?!?!?!?!
interface IFilterState extends IState {
  varname: string;
  filtertype: FilterType;
  metatype: MetaType;
}

interface ILabelState {
  varname: string;
  label: string;
  sortable: boolean;
}

interface ICategoryFilterState extends IFilterState {
  regexp: string | null;
  values: string[];
}

interface INumberRangeFilterState extends IFilterState {
  min: number | null;
  max: number | null;
}

interface IDateRangeFilterState extends IFilterState {
  min: Date | null;
  max: Date | null;
}

interface IDatetimeRangeFilterState extends IFilterState {
  min: Date | null;
  max: Date | null;
}

/* ------------------------------------------------------ */
/* view                                                   */
/* ------------------------------------------------------ */

interface IView {
  name: string;
  description: string;
  state: IDisplayState;
}

/* ------------------------------------------------------ */
/* display                                                */
/* ------------------------------------------------------ */

type PanelFormat = 'apng' | 'avif' | 'gif' | 'jpg' | 'jpeg' | 'jfif' | 'pjpeg' | 'pjp' | 'png' | 'svg' | 'webp';

type PanelType = 'img' | 'iframe';

type PanelSourceType = 'file' | 'REST' | 'localWebSocket' | 'JS';

type PanelFunction = (args: []) => string;

interface IJSPanelSource extends IPanelSource {
  function: PanelFunction;
}

interface IPanelSource {
  type: PanelSourceType;
  isLocal: boolean;
  port: number;
}

interface IPanelMeta extends IMeta {
  paneltype: PanelType;
  // format?: PanelFormat;
  aspect: number;
  source: IPanelSource;
}

// interface IFilePanelSource extends IPanelSource {
// }

interface IRESTPanelSource extends IPanelSource {
  url: string;
  apiKey: string | undefined;
  headers: string | undefined;
}

interface IDisplay {
  name: string;
  description: string;
  tags: string[];
  hasCustomInfo: boolean;
  infoOnLoad: boolean;
  keycols: string[];
  keysig: string;
  metas: IMeta[];
  inputs?: IInputs;
  state: IDisplayState;
  views: IView[];
  // paneltype: PanelType;
  // panelformat?: PanelFormat;
  // panelaspect: number;
  primarypanel: string;
  thumbnailurl: string;
}

/* ------------------------------------------------------ */
/* display list                                           */
/* ------------------------------------------------------ */

interface IDisplayListItem {
  name: string;
  description: string;
  tags: string[];
  keysig: string;
  thumbnailurl: string;
}

/* ------------------------------------------------------ */
/* config                                                 */
/* ------------------------------------------------------ */

type AppDataType = 'jsonp' | 'json' | 'js'; // js means created in JavaScript and doesn't need to be read from a file

interface IConfig {
  name: string;
  datatype: AppDataType;
  id: string;
  theme?: ITheme;
}

interface ITheme {
  primary: string;
  dark: string;
  light: string;
  isLightTextOnDark: boolean;
  darkText: string;
  lightText: string;
  logo: string;
  header: {
    background: string;
    text: string;
  };
}

interface Datum {
  [key: string | symbol]: string | number;
}

interface IDisplaySpec {
  displayInfo: IDisplay;
  metaData: Datum[];
}

interface ITrelliscopeAppSpec {
  config: IConfig;
  displayList: IDisplayListItem[];
  displays: {
    [key: string]: IDisplaySpec;
  };
  setDefaultLayout(arg0: {
    ncol?: number;
    page?: number;
    viewtype?: ViewType;
    sidebarActive?: boolean;
    activeFilterVars?: string[];
  }): ITrelliscopeAppSpec;
  setDefaultLabels(arg0: { varnames?: string[]; tags?: string[] }): ITrelliscopeAppSpec;
  setDefaultSort(arg0: { varnames: string[]; dirs?: SortDirType[] }): ITrelliscopeAppSpec;
  setVarLabels(labels: { [index: string]: string }): ITrelliscopeAppSpec;
  setPrimaryPanel(panel: string): ITrelliscopeAppSpec;
  setRangeFilter(arg0: { varname: string; min?: number | Date | null; max?: number | Date | null }): ITrelliscopeAppSpec;
}

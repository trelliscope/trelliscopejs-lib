/* ------------------------------------------------------ */
/* meta                                                   */
/* ------------------------------------------------------ */

type MetaType = 'string' | 'number' | 'factor' | 'date' | 'datetime' | 'href' | 'geo' | 'graph' | 'currency';
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
  varname: string;
  type: MetaType;
  label: string;
  tags: string[];
  filterable: boolean;
  sortable: boolean;
  code?: string;
  digits: number;
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

// do we want to support this?
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
interface IDatetimeMeta extends IMeta {
  timezone: string;
}

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
  name: string;
  label: string;
  active: boolean;
  type: InputType;
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
  width: number;
  height: number;
}

/* ------------------------------------------------------ */
/* states                                                 */
/* ------------------------------------------------------ */

type StateType = 'layout' | 'labels' | 'sort' | 'filter';
type LayoutArrangeType = 'rows' | 'cols';
type SortDirType = 'asc' | 'desc';
type FilterType = 'category' | 'numberrange' | 'daterange' | 'datetimerange';

interface IDisplayState {
  layout: ILayoutState;
  labels: ILabelState;
  sort: ISortState[];
  filter: IFilterState[];
}

interface IState {
  type: StateType;
}

interface ILayoutState extends IState {
  nrow: number;
  ncol: number;
  arrange: LayoutArrangeType;
  page: number;
}

interface ILabelState extends IState {
  varnames: string[];
}

interface ISortState extends IState {
  varname: string;
  dir: SortDirType;
}

interface IFilterState extends IState {
  varname: string;
  filtertype: FilterType;
}

interface ILabelState {
  varname: string;
  label: string;
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
  state: IDisplayState;
}

/* ------------------------------------------------------ */
/* display                                                */
/* ------------------------------------------------------ */

type PanelFormat = 'apng' | 'avif' | 'gif' | 'jpg' | 'jpeg' | 'jfif' | 'pjpeg' | 'pjp' | 'png' | 'svg' | 'webp';

type PanelType = 'img' | 'iframe' | 'REST';

interface IDisplay {
  name: string;
  description: string;
  tags: string[];
  keycols: string[];
  keysig: string;
  metas: IMeta[];
  inputs?: IInputs;
  state: IDisplayState;
  views: IView[];
  paneltype: PanelType;
  panelformat?: PanelFormat;
  panelaspect: number;
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

type AppDataType = 'jsonp' | 'json';

interface IConfig {
  name: string;
  datatype: AppDataType;
  id: string;
}

interface Datum {
  [key: string | symbol]: string | number;
}

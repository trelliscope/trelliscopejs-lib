/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { max } from 'd3-array';
import { metaIndex } from './slices/metaDataAPI';
import { cloneDeep } from 'lodash';

export class Meta implements IMeta {
  name: string; // why??
  type: MetaType;
  varname: string;
  label: string;
  tags: string[];
  filterable: boolean;
  sortable: boolean;
  maxnchar: number;
  log: boolean; // why??
  digits: number; // why??
  locale: boolean; // why??
  filterSortOrder: 'ct,asc' | 'ct,desc' | 'id,asc' | 'id,desc';
  constructor({
    type,
    varname,
    tags = [],
    label = undefined,
    filterable = true,
    sortable = true,
    maxnchar = 0,
    log = false,
    digits = 2,
    locale = true,
    filterSortOrder = 'ct,desc',
  }: {
    type: MetaType;
    varname: string;
    tags: string[];
    maxnchar?: number;
    label?: string | undefined;
    filterable?: boolean;
    sortable?: boolean;
    log?: boolean;
    digits?: number;
    locale?: boolean;
    filterSortOrder?: 'ct,asc' | 'ct,desc' | 'id,asc' | 'id,desc';
  }) {
    this.type = type;
    this.name = varname;
    this.varname = varname;
    this.tags = tags;
    this.filterable = filterable;
    this.sortable = sortable;
    this.label = label === undefined ? varname : label;
    this.maxnchar = maxnchar;
    this.filterSortOrder = filterSortOrder;
    this.log = log;
    this.digits = digits;
    this.locale = locale;
  }
}

export class PanelSource implements IPanelSource {
  type: PanelSourceType;
  isLocal: boolean; // what is this?
  port: number; // why??
  constructor({ type, port = 0 }: { type: PanelSourceType; port: number }) {
    this.type = type;
    this.isLocal = false;
    this.port = port;
  }
}

class PanelMetaClass extends Meta implements IPanelMeta {
  paneltype: PanelType;
  format?: PanelFormat;
  aspect: number;
  source: PanelSource;
  constructor({
    varname,
    label,
    tags = [],
    paneltype,
    format,
    aspect,
    sourcetype,
    port = 0,
  }: {
    varname: string;
    label?: string | undefined;
    tags?: string[];
    paneltype: PanelType;
    port?: number;
    format: PanelFormat | undefined;
    sourcetype: PanelSourceType;
    aspect: number;
  }) {
    super({ type: 'panel', varname, tags, label });
    this.paneltype = paneltype;
    if (format !== undefined) {
      this.format = format;
    }
    this.aspect = aspect;
    this.source = {
      type: sourcetype,
      isLocal: false,
      port,
    };
  }
}
export function PanelMeta({
  varname,
  label,
  tags = [],
  paneltype,
  format,
  aspect,
  sourcetype,
  port = 0,
}: {
  varname: string;
  label?: string | undefined;
  tags?: string[];
  paneltype: PanelType;
  format: PanelFormat | undefined;
  aspect: number;
  sourcetype: PanelSourceType;
  port?: number;
}): IPanelMeta {
  return new PanelMetaClass({ varname, label, tags, paneltype, format, aspect, sourcetype, port });
}

class NumberMetaClass extends Meta implements INumberMeta {
  digits: number;
  locale: boolean;
  log: boolean;
  constructor({
    varname,
    label,
    tags = [],
    digits,
    locale,
    log,
  }: {
    varname: string;
    label?: string | undefined;
    tags?: string[];
    digits?: number;
    locale?: boolean;
    log?: boolean;
  }) {
    super({ type: 'number', varname, tags, label });
    this.digits = digits === undefined ? 2 : digits;
    this.locale = locale === undefined ? true : locale;
    this.log = log === undefined ? false : log;
  }
}
export function NumberMeta({
  varname,
  label,
  tags = [],
  digits,
  locale,
  log,
}: {
  varname: string;
  label?: string | undefined;
  tags?: string[];
  digits?: number;
  locale?: boolean;
  log?: boolean;
}): INumberMeta {
  return new NumberMetaClass({ varname, label, tags, digits, locale, log });
}

class DateMetaClass extends Meta implements IDateMeta {
  constructor({ varname, label, tags = [] }: { varname: string; label?: string | undefined; tags?: string[] }) {
    super({ type: 'date', varname, tags, label });
  }
}
export function DateMeta({
  varname,
  label,
  tags = [],
}: {
  varname: string;
  label?: string | undefined;
  tags?: string[];
}): IDateMeta {
  return new DateMetaClass({ varname, label, tags });
}

class DatetimeMetaClass extends Meta implements IDatetimeMeta {
  timezone: string; // Add the missing 'timezone' property
  constructor({
    varname,
    label,
    tags = [],
    timezone = 'UTC',
  }: {
    varname: string;
    label?: string | undefined;
    tags?: string[];
    timezone?: string;
  }) {
    super({ type: 'datetime', varname, tags, label });
    this.timezone = timezone;
  }
}
export function DatetimeMeta({
  varname,
  label,
  tags = [],
  timezone = 'UTC',
}: {
  varname: string;
  label?: string | undefined;
  tags?: string[];
  timezone?: string;
}): IDatetimeMeta {
  return new DatetimeMetaClass({ varname, label, tags, timezone });
}

class CurrencyMetaClass extends Meta implements ICurrencyMeta {
  code: CurrencyCode;
  digits: number;
  log: boolean;
  constructor({
    varname,
    label,
    tags = [],
    code,
    digits,
    log,
  }: {
    varname: string;
    label?: string | undefined;
    tags?: string[];
    code?: CurrencyCode;
    digits?: number;
    log?: boolean;
  }) {
    super({ type: 'number', varname, tags, label });
    this.code = code === undefined ? 'USD' : code;
    this.digits = digits === undefined ? 2 : digits;
    this.log = log === undefined ? false : log;
  }
}
export function CurrencyMeta({
  varname,
  label,
  tags = [],
  code,
  digits,
  log,
}: {
  varname: string;
  label?: string | undefined;
  tags?: string[];
  code?: CurrencyCode;
  digits?: number;
  log?: boolean;
}): ICurrencyMeta {
  return new CurrencyMetaClass({ varname, label, tags, code, digits, log });
}

class StringMetaClass extends Meta implements IStringMeta {
  constructor({ varname, label, tags = [] }: { varname: string; label?: string | undefined; tags?: string[] }) {
    super({ type: 'string', varname, tags, label });
  }
}
export function StringMeta({
  varname,
  label,
  tags = [],
}: {
  varname: string;
  label?: string | undefined;
  tags?: string[];
}): IStringMeta {
  return new StringMetaClass({ varname, label, tags });
}

class HrefMetaClass extends Meta implements IHrefMeta {
  constructor({ varname, label, tags = [] }: { varname: string; label?: string | undefined; tags?: string[] }) {
    super({ type: 'href', varname, tags, label });
  }
}
export function HrefMeta({
  varname,
  label,
  tags = [],
}: {
  varname: string;
  label?: string | undefined;
  tags?: string[];
}): IHrefMeta {
  return new HrefMetaClass({ varname, label, tags });
}

class FactorMetaClass extends Meta implements IFactorMeta {
  levels: string[];
  constructor({
    varname,
    levels,
    label,
    tags = [],
  }: {
    varname: string;
    levels: string[];
    label?: string | undefined;
    tags?: string[];
  }) {
    super({ type: 'factor', varname, tags, label });
    this.levels = levels;
  }
}
export function FactorMeta({
  varname,
  levels,
  label,
  tags = [],
}: {
  varname: string;
  levels: string[];
  label?: string | undefined;
  tags?: string[];
}): IFactorMeta {
  return new FactorMetaClass({ varname, levels, label, tags });
}

class State implements IState {
  type: StateType;
  constructor(type: StateType) {
    this.type = type;
  }
}

class LayoutStateClass extends State implements ILayoutState {
  nrow: number; // why??
  ncol: number;
  page: number;
  viewtype: ViewType;
  panel: string; // why??
  sidebarActive: boolean;
  showLabels: boolean; // why??
  constructor({
    ncol = 3,
    page = 1,
    viewtype = 'grid',
    sidebarActive = false,
  }: {
    ncol?: number;
    page?: number;
    viewtype?: ViewType;
    sidebarActive?: boolean;
  }) {
    super('layout');
    this.ncol = ncol;
    this.page = page;
    this.viewtype = viewtype;
    this.sidebarActive = sidebarActive;
    // why these??
    this.showLabels = true;
    this.panel = '';
    this.nrow = 0;
  }
}
export function LayoutState({
  ncol = 3,
  page = 1,
  viewtype = 'grid',
  sidebarActive = false,
}: {
  ncol?: number;
  page?: number;
  viewtype?: ViewType;
  sidebarActive?: boolean;
}): ILayoutState {
  return new LayoutStateClass({ ncol, page, viewtype, sidebarActive });
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class LabelsStateClass extends State implements ILabelState {
  varnames: string[];
  tags: string[];
  constructor({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    varnames = [],
    tags = [],
  }: {
    varname?: string[];
    tags?: string[];
  }) {
    super('labels');
    this.varnames = varnames;
    this.tags = tags;
  }
}
export function LabelsState({ varnames = [], tags = [] }: { varnames?: string[]; tags?: string[] }): ILabelState {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new LabelsStateClass({ varnames, tags });
}

class SortStateClass extends State implements ISortState {
  varname: string;
  dir: SortDirType;
  metatype: MetaType;
  constructor({ varname, dir, metatype }: { varname: string; dir: SortDirType; metatype: MetaType }) {
    super('sort');
    this.varname = varname;
    this.dir = dir;
    this.metatype = metatype;
  }
}

class FilterState extends State implements IFilterState {
  varname: string;
  filtertype: FilterType;
  metatype: MetaType;
  constructor({ varname, filtertype, metatype }: { varname: string; filtertype: FilterType; metatype: MetaType }) {
    super('filter');
    this.varname = varname;
    this.filtertype = filtertype;
    this.metatype = metatype;
  }
}

class CategoryFilterStateClass extends FilterState implements ICategoryFilterState {
  regexp: string | null;
  values: string[];
  constructor({
    varname,
    values = [],
    regexp = null,
    metatype = 'string',
  }: {
    varname: string;
    values: string[];
    regexp: string | null;
    metatype: MetaType;
  }) {
    super({ varname, filtertype: 'category', metatype });
    this.values = values;
    this.regexp = regexp;
  }
}

class NumberRangeFilterStateClass extends FilterState implements INumberRangeFilterState {
  min: number | null;
  max: number | null;
  constructor({ varname, min = null, max = null }: { varname: string; min: number | null; max: number | null }) {
    super({ varname, filtertype: 'numberrange', metatype: 'number' });
    this.min = min;
    this.max = max;
  }
}

class DateRangeFilterStateClass extends FilterState implements IDateRangeFilterState {
  min: Date | null;
  max: Date | null;
  constructor({ varname, min = null, max = null }: { varname: string; min: Date | null; max: Date | null }) {
    super({ varname, filtertype: 'daterange', metatype: 'date' });
    this.min = min;
    this.max = max;
  }
}

class DatetimeRangeFilterStateClass extends FilterState implements IDatetimeRangeFilterState {
  min: Date | null;
  max: Date | null;
  constructor({ varname, min = null, max = null }: { varname: string; min: Date | null; max: Date | null }) {
    super({ varname, filtertype: 'datetimerange', metatype: 'datetime' });
    this.min = min;
    this.max = max;
  }
}

function inferMeta(data: Datum[], colNames: string[], guessMax: number = 1000) {
  const types = colNames.map((key) => {
    const values = data
      .slice(0, guessMax)
      .map((row) => row[key as keyof typeof row])
      // remove any undefined values
      .filter((value) => !(value === undefined || value === null));

    // TODO: add this in everywhere
    // const maxnchar = Math.max(...values.map((value) => String(value).length));

    if (values.length === 0) {
      return StringMeta({ varname: key }) as IMeta;
    }

    if (values.every((value) => typeof value === 'number')) {
      return NumberMeta({ varname: key }) as IMeta;
    }

    if (values.every((value) => !Number.isNaN(Date.parse(value as string)))) {
      return DateMeta({ varname: key }) as IMeta;
    }

    if (values.every((value) => !Number.isNaN(Date.parse(value as string)))) {
      return DatetimeMeta({ varname: key }) as IMeta;
    }

    if (
      values.every((value) => (value as string).startsWith('http') && /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(value as string))
    ) {
      return PanelMeta({ varname: key, paneltype: 'img', format: 'png', aspect: 1.5, sourcetype: 'file' }) as IMeta;
    }

    if (values.every((value) => (value as string).startsWith('http'))) {
      return HrefMeta({ varname: key }) as IMeta;
    }

    // get distinct values from all rows (all data, not just first 1000)
    const levels = Array.from(new Set(data.flatMap((row) => row[key as keyof typeof row]))).sort();
    if (levels.length <= 25) {
      return FactorMeta({ varname: key, levels: levels as string[] }) as IMeta;
    }

    return StringMeta({ varname: key }) as IMeta;
  });
  return types;
}

// function checkKeycols makes sure that the keycols are in the data and that together they uniqueily identify each row - if not, it throws an error
function checkKeycols(data: Datum[], keycols: string[], colNames: string[]) {
  if (keycols.length === 0) {
    throw new Error('keycols must be non-empty');
  }
  if (keycols.some((keycol) => !colNames.includes(keycol))) {
    throw new Error('keycols must be in the data');
  }
  if (new Set(data.map((row) => keycols.map((keycol) => row[keycol as keyof typeof row]).join())).size !== data.length) {
    throw new Error('keycols must uniquely identify each row');
  }
}

class TrelliscopeClass implements ITrelliscopeAppSpec {
  config: IConfig;
  displayList: IDisplayListItem[];
  displays: {
    [key: string]: IDisplaySpec;
  };
  // make a constructor
  constructor({
    data,
    name,
    description = undefined,
    tags = [],
    keycols = [],
    guessMax = 1000,
    // metas = [],
    // state = {},
    // views = [],
    // inputs = {},
    primarypanel = undefined,
    // thumbnailurl = undefined,
    infoOnLoad = false,
    // hasCustomInfo = false,
    // order = 0,
  }: {
    data: Datum[];
    name: string;
    description?: string;
    tags?: string[];
    keycols: string[];
    guessMax: number;
    // metas?: IMeta[],
    // state?: IDisplayState,
    // views?: IView[],
    // inputs?: IInputs,
    primarypanel?: string;
    // thumbnailurl?: string,
    infoOnLoad?: boolean;
    // hasCustomInfo?: boolean,
    // order?: number,
  }) {
    this.displays = {};
    const colNames = Array.from(new Set(data.slice(0, guessMax).flatMap(Object.keys)));
    const metas = inferMeta(data, colNames, guessMax);
    checkKeycols(data, keycols, colNames);

    this.displays[name] = {
      displayInfo: {
        name,
        description: description === undefined ? name : description,
        tags,
        keycols,
        metas,
        infoOnLoad,
        hasCustomInfo: false,
        state: {
          layout: LayoutState({}),
          labels: LabelsState({ varnames: keycols }),
          sort: [],
          filter: [],
          filterView: [],
        },
        views: [],
        inputs: undefined,
        primarypanel: primarypanel === undefined ? '' : primarypanel,
        keysig: keycols.join(), // TODO
        thumbnailurl: '', // TODO
      },
      metaData: data,
    };

    this.displayList = [
      {
        name,
        description: description === undefined ? name : description,
        tags,
        keysig: keycols.join(),
        thumbnailurl: '', // TODO
      },
    ];

    this.config = {
      name: 'Trelliscope App',
      datatype: 'js',
      id: '',
    };
  }

  setDefaultLayout({
    ncol = 3,
    page = 1,
    viewtype = 'grid',
    sidebarActive = false,
    activeFilterVars,
  }: {
    ncol?: number;
    page?: number;
    viewtype?: ViewType;
    sidebarActive?: boolean;
    activeFilterVars?: string[];
  }): ITrelliscopeAppSpec {
    const ls = new LayoutStateClass({ ncol, page, viewtype, sidebarActive });
    const { name } = this.displayList[0];
    this.displays[name].displayInfo.state.layout = ls;
    if (activeFilterVars !== undefined) {
      this.displays[name].displayInfo.state.filterView = activeFilterVars;
    }
    return this;
  }

  setDefaultLabels({ varnames = [], tags = [] }: { varnames?: string[]; tags?: string[] }): ITrelliscopeAppSpec {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const ls = new LabelsStateClass({ varnames, tags });
    const { name } = this.displayList[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.displays[name].displayInfo.state.labels = ls;
    return this;
  }

  setDefaultSort({ varnames, dirs }: { varnames: string[]; dirs?: SortDirType[] }): ITrelliscopeAppSpec {
    let sdirs: SortDirType[];
    if (dirs === undefined) {
      sdirs = varnames.map(() => 'asc');
    } else {
      sdirs = dirs;
    }
    if (varnames.length !== sdirs.length) {
      throw new Error('varname and dir must be the same length');
    }
    const { metas } = this.displays[this.displayList[0].name].displayInfo;
    if (varnames.some((vn) => !metas.map((m) => m.varname).includes(vn))) {
      throw new Error(`all varname values in setSort() must be in the data`);
    }
    // create a lookup object of meta types
    const metatypes: { [key: string]: MetaType } = {};
    metas.forEach((m) => {
      metatypes[m.varname] = m.type;
    });
    const ss = varnames.map((vn, i) => new SortStateClass({ varname: vn, dir: sdirs[i], metatype: metatypes[vn] }));
    const { name } = this.displayList[0];
    this.displays[name].displayInfo.state.sort = ss;
    return this;
  }

  setVarLabels(labels: { [index: string]: string }): ITrelliscopeAppSpec {
    const { metas } = this.displays[this.displayList[0].name].displayInfo;
    metas.forEach((m: { varname: string; label: string }) => {
      if (labels[m.varname] !== undefined) {
        m.label = labels[m.varname];
      }
    });
    return this;
  }

  setPrimaryPanel(panel: string): ITrelliscopeAppSpec {
    const { name } = this.displayList[0];
    this.displays[name].displayInfo.primarypanel = panel;
    return this;
  }

  setPanelFunction({
    varname,
    label,
    panelType = 'img',
    aspect = 1,
    func,
  }: {
    varname: string;
    label: string;
    panelType: PanelType;
    aspect: number;
    func: PanelFunction;
  }): ITrelliscopeAppSpec {
    const setLabel = label || varname;
    const { name } = this.displayList[0];
    const { metas } = this.displays[name].displayInfo;

    // FIXME
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const meta: IPanelMeta = metas.find((m) => m.varname === varname);

    if (!meta) {
      metas.push({
        varname,
        label: setLabel,
        type: 'panel',
        // FIXME
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paneltype: panelType,
        aspect,
        sortable: false,
        filterable: false,
        source: {
          type: 'JS',
          function: func,
        },
      });
    } else {
      meta.label = setLabel;
      meta.paneltype = panelType;
      meta.aspect = aspect;
      meta.source = {
        type: 'JS',
        function: func,
        isLocal: false,
        port: 0,
      };
    }

    return this;
  }

  setRangeFilter({
    varname,
    min = null,
    max = null,
  }: {
    varname: string;
    min?: number | Date | null;
    max?: number | Date | null;
  }): ITrelliscopeAppSpec {
    if (min === null && max === null) {
      throw new Error('min and max cannot both be null');
    }
    const { name } = this.displayList[0];
    const { metas } = this.displays[name].displayInfo;
    const meta = metas.find((m) => m.varname === varname);
    if (meta === undefined) {
      throw new Error(`varname ${varname} not found in metas`);
    }
    if ((typeof min === 'number' && max instanceof Date) || (min instanceof Date && typeof max === 'number')) {
      throw new Error('min and max must be the same type');
    }
    if (typeof min === 'number' || typeof max === 'number') {
      if (meta.type !== 'number') {
        throw new Error(`varname ${varname} is not a number`);
      }
      // TODO: make sure the filter is not already set
      this.displays[name].displayInfo.state.filter.push(
        new NumberRangeFilterStateClass({ varname, min: min as number, max: max as number }),
      );
    } else if (min instanceof Date || max instanceof Date) {
      if (meta.type === 'date') {
        // TODO: make sure the filter is not already set
        this.displays[name].displayInfo.state.filter.push(new DateRangeFilterStateClass({ varname, min, max }));
      } else if (meta.type === 'datetime') {
        // TODO: make sure the filter is not already set
        this.displays[name].displayInfo.state.filter.push(new DatetimeRangeFilterStateClass({ varname, min, max }));
      } else {
        throw new Error(`varname ${varname} is not a date or datetime`);
      }
    } else {
      throw new Error('min and max must be the same type');
    }
    return this;
  }

  // setStringFilter(varname: string, values: string[], regexp: string): ITrelliscopeAppSpec {
  //   const {metas} = this.displays[this.displayList[0].name].displayInfo;
  //   const meta = metas.find((m) => m.varname === varname);
  //   if (meta === undefined) {
  //     throw new Error(`varname ${varname} not found in metas`);
  //   }
  //   if (meta.type !== 'factor') {
  //     throw new Error(`varname ${varname} is not a factor`);
  //   }
  //   const {name} = this.displayList[0];
  //   this.displays[name].displayInfo.state.filter.push(new CategoryFilterStateClass({ varname, values, regexp }));
  //   return this;
  // }

  // setDefaultFilters(filters: string[]): void {
  // }

  // addView(view: any): void {
  // }

  // addInputs(inputs: any[]): void {
  // }

  // setShowInfoOnLoad(showInfo: boolean): void {
  //   this.di.hasCustomInfo = showInfo;
  // }

  // setInfoHtml(html: string): void {
  // }

  // setTheme(theme: string): void {
  // }
}

export function Trelliscope({
  data,
  name,
  description = undefined,
  tags = [],
  keycols = [],
  primarypanel = undefined,
  // thumbnailurl = undefined,
  infoOnLoad = false,
  // order = 0,
}: {
  data: Datum[];
  name: string;
  description?: string;
  tags?: string[];
  keycols: string[];
  primarypanel?: string;
  // thumbnailurl?: string,
  infoOnLoad?: boolean;
  // order?: number,
}): ITrelliscopeAppSpec {
  return new TrelliscopeClass({
    data,
    name,
    description,
    tags,
    keycols,
    primarypanel,
    // thumbnailurl,
    infoOnLoad,
    guessMax: 1000,
    // order,
  });
}

export function prepareTrelliscope(data: ITrelliscopeAppSpec, id: string): ITrelliscopeAppSpec {
  const data2 = cloneDeep(data);
  data2.config.id = id;
  const di = data2.displays[data2.displayList[0].name].displayInfo;
  // make sure there is a primary panel specified
  if (di.primarypanel === undefined || di.primarypanel === '') {
    const panels = di.metas.filter((d: { type: string }) => d.type === 'panel');
    if (panels.length === 0) {
      throw new Error('At least one panel must be specified');
    }
    di.primarypanel = panels[0].name;
  }
  // replace factor metas with numbers
  const md = data2.displays[data2.displayList[0].name].metaData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  di.metas
    .filter((d: IMeta) => d.type === 'factor')
    .forEach((d: IMeta) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      md.forEach((row: { [x: string]: any }) => {
        if (row[d.name]) {
          // eslint-disable-next-line no-param-reassign
          row[d.name] = (d.levels ?? []).indexOf(row[d.name]) + 1;
        }
      });
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  md?.forEach((row: any, i: number) => {
    // eslint-disable-next-line no-param-reassign
    row[metaIndex] = i;
  });

  return data2;
}

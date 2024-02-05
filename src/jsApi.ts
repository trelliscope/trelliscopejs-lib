/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { metaIndex } from "./slices/metaDataAPI";

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
  } : {
    type: MetaType,
    varname: string,
    tags: string[],
    maxnchar?: number,
    label?: string | undefined,
    filterable?: boolean,
    sortable?: boolean,
    log?: boolean,
    digits?: number,
    locale?: boolean,
    filterSortOrder?: 'ct,asc' | 'ct,desc' | 'id,asc' | 'id,desc',
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
  constructor({
    type,
    port = 0,
  } : {
    type: PanelSourceType,
    port: number,
  }
  ) {
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
  constructor(
    {
      varname,
      label,
      tags = [],
      paneltype,
      format,
      aspect,
      sourcetype,
      port = 0,
    } : {
      varname: string,
      label?: string | undefined,
      tags?: string[],
      paneltype: PanelType,
      port?: number,
      format: PanelFormat | undefined,
      sourcetype: PanelSourceType,
      aspect: number,
    }
  ) {
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
} : {
  varname: string,
  label?: string | undefined,
  tags?: string[],
  paneltype: PanelType,
  format: PanelFormat | undefined,
  aspect: number,
  sourcetype: PanelSourceType,
  port?: number,
}): IPanelMeta {
  return new PanelMetaClass({ varname, label, tags, paneltype, format, aspect, sourcetype, port });
}

class NumberMetaClass extends Meta implements INumberMeta {
  digits: number;
  locale: boolean;
  log: boolean;
  constructor(
    {
      varname,
      label,
      tags = [],
      digits,
      locale,
      log
    } : {
      varname: string,
      label?: string | undefined,
      tags?: string[],
      digits?: number,
      locale?: boolean,
      log?: boolean,
    }
  ) {
    super({type: 'number', varname, tags, label });
    this.digits = digits === undefined ? 2 : digits;
    this.locale = locale === undefined ? true : locale;
    this.log = log === undefined ? false : log;
  };
}
export function NumberMeta({
  varname,
  label,
  tags = [],
  digits,
  locale,
  log
} : {
  varname: string,
  label?: string | undefined,
  tags?: string[],
  digits?: number,
  locale?: boolean,
  log?: boolean,
}): INumberMeta {
  return new NumberMetaClass({ varname, label, tags, digits, locale, log });
}

class DateMetaClass extends Meta implements IDateMeta {
  constructor(
    {
      varname,
      label,
      tags = []
    } : {
      varname: string,
      label?: string | undefined,
      tags?: string[]
    }
  ) {
    super({ type: 'date', varname, tags, label });
  };
}
export function DateMeta({
  varname,
  label,
  tags = []
}: {
  varname: string,
  label?: string | undefined,
  tags?: string[]
}): IDateMeta {
  return new DateMetaClass({ varname, label, tags });
}

class DatetimeMetaClass extends Meta implements IDatetimeMeta {
  timezone: string; // Add the missing 'timezone' property
  constructor(
    {
      varname,
      label,
      tags = [],
      timezone = 'UTC',
    } : {
      varname: string,
      label?: string | undefined,
      tags?: string[],
      timezone?: string,
    }
  ) {
    super({ type: 'datetime', varname, tags, label });
    this.timezone = timezone;
  };
}
export function DatetimeMeta({
  varname,
  label,
  tags = [],
  timezone = 'UTC',
}: {
  varname: string,
  label?: string | undefined,
  tags?: string[],
  timezone?: string,
}): IDatetimeMeta {
  return new DatetimeMetaClass({ varname, label, tags, timezone });
}

class CurrencyMetaClass extends Meta implements ICurrencyMeta {
  code: CurrencyCode;
  digits: number;
  log: boolean;
  constructor(
    {
      varname,
      label,
      tags = [],
      code,
      digits,
      log,
    } : {
      varname: string,
      label?: string | undefined,
      tags?: string[],
      code?: CurrencyCode,
      digits?: number,
      log?: boolean,
    }
  ) {
    super({type: 'number', varname, tags, label });
    this.code = code === undefined ? 'USD' : code;
    this.digits = digits === undefined ? 2 : digits;
    this.log = log === undefined ? false : log;
  };
}
export function CurrencyMeta({
  varname,
  label,
  tags = [],
  code,
  digits,
  log
} : {
  varname: string,
  label?: string | undefined,
  tags?: string[],
  code?: CurrencyCode,
  digits?: number,
  log?: boolean,
}): ICurrencyMeta {
  return new CurrencyMetaClass({ varname, label, tags, code, digits, log });
}

class StringMetaClass extends Meta implements IStringMeta {
  constructor(
    {
      varname,
      label,
      tags = []
    } : {
      varname: string,
      label?: string | undefined,
      tags?: string[]
    }
  ) {
    super({ type: 'string', varname, tags, label });
  };
}
export function StringMeta({
  varname,
  label,
  tags = []
} : {
  varname: string,
  label?: string | undefined,
  tags?: string[]
}): IStringMeta {
  return new StringMetaClass({ varname, label, tags });
}

class HrefMetaClass extends Meta implements IHrefMeta {
  constructor(
    {
      varname,
      label,
      tags = []
    } : {
      varname: string,
      label?: string | undefined,
      tags?: string[]
    }
  ) {
    super({ type: 'href', varname, tags, label });
  };
}
export function HrefMeta({
  varname,
  label,
  tags = []
} : {
  varname: string,
  label?: string | undefined,
  tags?: string[]
}): IHrefMeta {
  return new HrefMetaClass({ varname, label, tags });
}

class FactorMetaClass extends Meta implements IFactorMeta {
  levels: string[];
  constructor(
    { 
      varname,
      levels,
      label,
      tags = []
    }: {
      varname: string,
      levels: string[],
      label?: string | undefined,
      tags?: string[],
    }
  ) {
    super({ type: 'factor', varname, tags, label });
    this.levels = levels;
  };
}
export function FactorMeta({
  varname,
  levels,
  label,
  tags = []
}: {
  varname: string,
  levels: string[],
  label?: string | undefined,
  tags?: string[],
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
  } : {
    ncol?: number,
    page?: number,
    viewtype?: ViewType,
    sidebarActive?: boolean,
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
  ncol?: number,
  page?: number,
  viewtype?: ViewType,
  sidebarActive?: boolean,
}): ILayoutState {
  return new LayoutStateClass({ ncol, page, viewtype, sidebarActive });
}

class LabelsStateClass extends State implements ILabelState {
  varnames: string[];
  tags: string[];
  constructor({
    varnames = [],
    tags = [],
  } : {
    varname?: string[],
    tags?: string[],
  }) {
    super('labels');
    this.varnames = varnames;
    this.tags = tags;
  }
}
export function LabelsState({
  varnames = [],
  tags = [],
}: {
  varnames?: string[],
  tags?: string[],
}): ILabelState {
  return new LabelsStateClass({ varnames, tags });
}

class SortStateClass extends State implements ISortState {
  varname: string;
  dir: SortDirType;
  metatype: MetaType;
  constructor({
    varname,
    dir,
    metatype,
  } : {
    varname: string,
    dir: SortDirType,
    metatype: MetaType,
  }) {
    super('sort');
    this.varname = varname;
    this.dir = dir;
    this.metatype = metatype;
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

    if (values.every((value) => typeof value === "number")) {
      return NumberMeta({ varname: key }) as IMeta;
    }

    if (values.every((value) => !Number.isNaN(Date.parse(value as string)))) {
      return DateMeta({ varname: key }) as IMeta;
    }

    if (values.every((value) => !Number.isNaN(Date.parse(value as string)))) {
      return DatetimeMeta({ varname: key }) as IMeta;
    }

    if (values.every((value) => (value as string)
      .startsWith("http") && /\.(png|jpg|jpeg|gif|bmp|svg)$/i
      .test(value as string))
    ) {
      return PanelMeta({ varname: key, paneltype: "img", format: "png", aspect: 1.5, sourcetype: "file" }) as IMeta;
    }

    if (values.every((value) => (value as string).startsWith("http"))) {
      return HrefMeta({ varname: key }) as IMeta;
    }

    // get distinct values from all rows (all data, not just first 1000)
    const levels = Array.from(new Set(data.flatMap((row) => row[key as keyof typeof row]))).sort();
    if (levels.length <= 25) {
      return FactorMeta({ varname: key, levels: (levels as string[]) }) as IMeta;
    }
    
    return StringMeta({ varname: key }) as IMeta;
  });
  return types;
}

// function checkKeycols makes sure that the keycols are in the data and that together they uniqueily identify each row - if not, it throws an error
function checkKeycols(data: Datum[], keycols: string[], colNames: string[]) {
  if (keycols.length === 0) {
    throw new Error("keycols must be non-empty");
  }
  if (keycols.some((keycol) => !colNames.includes(keycol))) {
    throw new Error("keycols must be in the data");
  }
  if (new Set(data.map((row) => keycols.map((keycol) => row[keycol as keyof typeof row]).join())).size !== data.length) {
    throw new Error("keycols must uniquely identify each row");
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
  } : {
    data: Datum[],
    name: string,
    description?: string,
    tags?: string[],
    keycols: string[],
    guessMax: number,
    // metas?: IMeta[],
    // state?: IDisplayState,
    // views?: IView[],
    // inputs?: IInputs,
    primarypanel?: string,
    // thumbnailurl?: string,
    infoOnLoad?: boolean,
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
      metaData: data
    };

    this.displayList = [{
      name,
      description: description === undefined ? name : description,
      tags,
      keysig: keycols.join(),
      thumbnailurl: '', // TODO
    }];

    this.config = {
      name: 'Trelliscope App',
      datatype: 'js',
      id: '',
    };
  }

  setLayout({
    ncol = 3,
    page = 1,
    viewtype = 'grid',
    sidebarActive = false,
    activeFilterVars,
  } : {
    ncol?: number,
    page?: number,
    viewtype?: ViewType,
    sidebarActive?: boolean,
    activeFilterVars?: string[],
  }): ITrelliscopeAppSpec {
    const ls = new LayoutStateClass({ ncol, page, viewtype, sidebarActive });
    const {name} = this.displayList[0];
    this.displays[name].displayInfo.state.layout = ls;
    if (activeFilterVars !== undefined) {
      this.displays[name].displayInfo.state.filterView = activeFilterVars;
    }
    return this;
  }

  setLabels({
    varnames = [],
    tags = []
  } : {
    varnames?: string[],
    tags?: string[]
  }): ITrelliscopeAppSpec {
    const ls = new LabelsStateClass({ varnames, tags });
    const {name} = this.displayList[0];
    this.displays[name].displayInfo.state.labels = ls;
    return this;
  }

  setSort({
    varnames,
    dirs,
  } : {
    varnames: string[],
    dirs?: SortDirType[],
  }): ITrelliscopeAppSpec {
    let sdirs: SortDirType[];
    if (dirs === undefined) {
      sdirs = varnames.map(() => 'asc');
    } else {
      sdirs = dirs;
    }
    if (varnames.length !== sdirs.length) {
      throw new Error('varname and dir must be the same length');
    }
    const {metas} = this.displays[this.displayList[0].name].displayInfo;
    if (varnames.some((vn) => !metas.map((m) => m.varname).includes(vn))) {
      throw new Error(`all varname values in setSort() must be in the data`);
    }
    // create a lookup object of meta types
    const metatypes: {[key: string]: MetaType} = {};
    metas.forEach((m) => {
      metatypes[m.varname] = m.type;
    });
    const ss = varnames.map((vn, i) =>
      new SortStateClass({ varname: vn, dir: sdirs[i], metatype: metatypes[vn] })
    );
    const {name} = this.displayList[0];
    this.displays[name].displayInfo.state.sort = ss;
    return this;
  }

  // setDefaultLabels(labels: string[]): void {
  // }

  // setDefaultSort(sort: string): void {
  // }

  // setDefaultFilters(filters: string[]): void {
  // }

  // addView(view: any): void {
  // }

  // addInputs(inputs: any[]): void {
  // }

  // setPrimaryPanel(panel: string): void {
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
} : {
  data: Datum[],
  name: string,
  description?: string,
  tags?: string[],
  keycols: string[],
  primarypanel?: string,
  // thumbnailurl?: string,
  infoOnLoad?: boolean,
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
};

export function prepareTrelliscope(data: ITrelliscopeAppSpec, id: string): ITrelliscopeAppSpec {
  const data2 = JSON.parse(JSON.stringify(data));
  data2.config.id = id;
  const di = data2.displays[data2.displayList[0].name].displayInfo;
  // make sure there is a primary panel specified
  if (di.primarypanel === undefined || di.primarypanel === '') {
    const panels = di.metas.filter((d: { type: string; }) => d.type === 'panel');
    if (panels.length === 0) {
      throw new Error('At least one panel must be specified');
    }
    di.primarypanel = panels[0].name;
  }
  // replace factor metas with numbers
  const md = data2.displays[data2.displayList[0].name].metaData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    di.metas.filter((d: { type: string; }) => d.type === 'factor').forEach((d: { name: string | number; levels: string | any[]; }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    md.forEach((row: { [x: string]: any; }) => {
      if (row[d.name]) {
        // eslint-disable-next-line no-param-reassign
        row[d.name] = d.levels.indexOf(row[d.name]) + 1;
      }
    })
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  md?.forEach((row: any, i: number) => {
    // eslint-disable-next-line no-param-reassign
    row[metaIndex] = i;
  });

  return data2;
}

// const meta = [
//   {
//     "country": "Afghanistan",
//     "continent": 3,
//     "iso_alpha2": "AF",
//     "mean_lexp": 37.4788333333333,
//     "mean_gdp": 802.674598425,
//     "dt_lexp_max_pct_chg": "1977-01-01",
//     "dttm_lexp_max_pct_chg": "1977-01-01T00:00:00",
//     "wiki_link": "https://en.wikipedia.org/wiki/Afghanistan",
//     "flag": "https://raw.githubusercontent.com/hafen/countryflags/master/png/512/AF.png"
//   },
//   {
//     "country": "Albania",
//     "continent": 4,
//     "iso_alpha2": "AL",
//     "mean_lexp": 68.4329166666667,
//     "mean_gdp": 3255.36663266667,
//     "max_lexp_pct_chg": 9.34547908232117,
//     "dt_lexp_max_pct_chg": "1962-01-01",
//     "dttm_lexp_max_pct_chg": "1962-01-01T00:00:00",
//     "wiki_link": "https://en.wikipedia.org/wiki/Albania",
//     "flag": "https://raw.githubusercontent.com/hafen/countryflags/master/png/512/AL.png"
//   },
//   {
//     "country": "Algeria",
//     "continent": 1,
//     "iso_alpha2": "DZ",
//     "mean_lexp": 59.0301666666667,
//     "mean_gdp": 4426.02597316667,
//     "max_lexp_pct_chg": 7.22037543996872,
//     "dt_lexp_max_pct_chg": "1987-01-01",
//     "dttm_lexp_max_pct_chg": "1987-01-01T00:00:00",
//     "wiki_link": "https://en.wikipedia.org/wiki/Algeria",
//     "flag": "https://raw.githubusercontent.com/hafen/countryflags/master/png/512/DZ.png"
//   },
//   {
//     "country": "Angola",
//     "continent": 1,
//     "iso_alpha2": "AO",
//     "mean_lexp": 37.8835,
//     "mean_gdp": 3607.10052883333,
//     "max_lexp_pct_chg": 6.61002831917374,
//     "dt_lexp_max_pct_chg": "1957-01-01",
//     "dttm_lexp_max_pct_chg": "1957-01-01T00:00:00",
//     "wiki_link": "https://en.wikipedia.org/wiki/Angola",
//     "flag": "https://raw.githubusercontent.com/hafen/countryflags/master/png/512/AO.png"
//   },
//   {
//     "country": "Argentina",
//     "continent": 2,
//     "iso_alpha2": "AR",
//     "mean_lexp": 69.0604166666667,
//     "mean_gdp": 8955.55378266667,
//     "max_lexp_pct_chg": 3.06313515243659,
//     "dt_lexp_max_pct_chg": "1957-01-01",
//     "dttm_lexp_max_pct_chg": "1957-01-01T00:00:00",
//     "wiki_link": "https://en.wikipedia.org/wiki/Argentina",
//     "flag": "https://raw.githubusercontent.com/hafen/countryflags/master/png/512/AR.png"
//   },
//   {
//     "country": "Australia",
//     "continent": 5,
//     "iso_alpha2": "AU",
//     "mean_lexp": 74.6629166666667,
//     "mean_gdp": 19980.5956341667,
//     "max_lexp_pct_chg": 2.16877519810926,
//     "dt_lexp_max_pct_chg": "1977-01-01",
//     "dttm_lexp_max_pct_chg": "1977-01-01T00:00:00",
//     "wiki_link": "https://en.wikipedia.org/wiki/Australia",
//     "flag": "https://raw.githubusercontent.com/hafen/countryflags/master/png/512/AU.png"
//   }
// ];


// const trs = Trelliscope({ data: meta, name: 'gapminder', keycols: ['continent', 'country'] });

// trs


// const a = NumberMeta({
//   varname: 'var1',
//   locale: false
// })

// a
// a.type





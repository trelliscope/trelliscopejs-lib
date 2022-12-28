export interface DataClientFilter {
  field: string;
  value: string | number;
  operation: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'regex';
}

// interface for sort object
export interface DataClientSort {
  field: string | symbol;
  order: 'asc' | 'desc';
}

export interface IDataClient {
  _data: Datum[];
  _filters: DataClientFilter[];
  _sorts: DataClientSort[];
  allData: Datum[];
  addData(data: Datum[]): void;
  addFilter(filter: DataClientFilter): void;
  removeFilter(field: string): void;
  addSort(sort: DataClientSort): void;
  removeSort(field: string): void;
  clearSorts(): void;
  clearFilters(): void;
  clearData(): void;
  getData(count?: number, offset?: number): Datum[];
}

export default class DataClient implements IDataClient {
  _data: Datum[];

  _filters: DataClientFilter[];

  _sorts: DataClientSort[];

  constructor(data?: Datum[]) {
    this._data = data || [];
    this._filters = [];
    this._sorts = [];
  }

  addData(data: Datum[]) {
    this._data = this._data.concat(data);
  }

  addFilter(filter: DataClientFilter) {
    this._filters.push(filter);
  }

  // remove filter by field name
  removeFilter(field: string) {
    this._filters = this._filters.filter((f) => f.field !== field);
  }

  // clear all filters
  clearFilters() {
    this._filters = [];
  }

  get filters() {
    return this._filters;
  }

  // add sort to the sort array if it doesn't exist
  addSort(sort: DataClientSort) {
    if (!this._sorts.some((s) => s.field === sort.field)) {
      this._sorts.push(sort);
    }
  }

  // remove sort by field name
  removeSort(field: string) {
    this._sorts = this._sorts.filter((s) => s.field !== field);
  }

  // clear all sorts
  clearSorts() {
    this._sorts = [];
  }

  get sorts() {
    return this._sorts;
  }

  filterData() {
    let data = [...this._data];
    this._filters.forEach((f) => {
      data = data.filter((d) => {
        switch (f.operation) {
          case 'eq':
            return d[f.field] === f.value;
          case 'neq':
            return d[f.field] !== f.value;
          case 'lt':
            return d[f.field] < f.value;
          case 'lte':
            return d[f.field] <= f.value;
          case 'gt':
            return d[f.field] > f.value;
          case 'gte':
            return d[f.field] >= f.value;
          case 'regex': {
            const regex = new RegExp(f.value as string);
            return regex.test(d[f.field] as string);
          }
          default:
            return true;
        }
      });
    });
    return data;
  }

  sortData(data: Datum[]) {
    let sortedData = [...data];

    sortedData = sortedData.sort((a, b) => {
      for (let i = 0; i < this._sorts.length; i += 1) {
        const { field, order } = this._sorts[i];

        if (a[field] !== b[field]) {
          if (order === 'asc') {
            return a[field] < b[field] ? -1 : 1;
          }
          return a[field] > b[field] ? -1 : 1;
        }
      }
      return 0;
    });

    return sortedData;
  }

  clearData() {
    this._data = [];
  }

  get allData() {
    return this._data;
  }

  getData(count = Infinity, page = 1) {
    const offset = (page - 1) * count;
    const filteredData = this.filterData();
    const sortedData = this.sortData(filteredData);
    return sortedData.slice(offset, offset + count);
  }
}

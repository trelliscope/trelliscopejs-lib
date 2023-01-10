import crossfilter, { Dimension, Crossfilter, NaturallyOrderedValue } from 'crossfilter2';
import arraySort from 'array-sort';
import DataClient, { DataClientFilter, DataClientSort } from './DataClient';
import { metaIndex } from './slices/metaDataAPI';

const compare = (field: string | symbol, order: 'asc' | 'desc') => (a: Datum, b: Datum) => {
  if (a[field] !== b[field]) {
    if (order === 'asc') {
      return a[field] < b[field] ? -1 : 1;
    }
    return a[field] > b[field] ? -1 : 1;
  }

  return 0;
};

type D = Dimension<Datum, string | number>;

interface SortParam {
  [key: string | symbol]: string | number;
}

export default class CrossfilterClient extends DataClient {
  crossfilter: Crossfilter<Datum>;

  dimensions: Map<string | symbol, D>;

  constructor(data: Datum[] = []) {
    super(data);
    this.crossfilter = crossfilter<Datum>(data);
    this.dimensions = new Map<string | symbol, D>();

    this.groupBy = this.groupBy.bind(this);
  }

  addData(data: Datum[]) {
    super.addData(data);
    this.crossfilter.add(data);
  }

  addFilter(filter: DataClientFilter) {
    super.addFilter(filter);
    // check if dimension exists and create if not
    if (!this.dimensions.has(filter.field)) {
      this.dimensions.set(
        filter.field,
        this.crossfilter.dimension((d) => d[filter.field]),
      );
    }

    // filter the dimension based on the filter operation
    switch (filter.operation) {
      case 'eq':
        if (Array.isArray(filter.value)) {
          const value = filter.value as NaturallyOrderedValue[];
          this.dimensions.get(filter.field)?.filter((d) => value.includes(d));
        } else {
          this.dimensions.get(filter.field)?.filterExact(filter.value);
        }
        break;
      case 'neq':
        this.dimensions.get(filter.field)?.filter((d) => d !== filter.value);
        break;
      case 'lt':
        this.dimensions.get(filter.field)?.filter((d) => d < filter.value);
        break;
      case 'lte':
        this.dimensions.get(filter.field)?.filter((d) => d <= filter.value);
        break;
      case 'gt':
        this.dimensions.get(filter.field)?.filter((d) => d > filter.value);
        break;
      case 'gte':
        this.dimensions.get(filter.field)?.filter((d) => d >= filter.value);
        break;
      case 'regex':
        this.dimensions.get(filter.field)?.filter((d) => {
          const regex = new RegExp(filter.value as string);
          return regex.test(d as string);
        });
        break;
      default:
        break;
    }
  }

  clearFilters(): void {
    this.dimensions.forEach((d) => d.filterAll());
    super.clearFilters();
  }

  removeFilter(filter: string) {
    this.dimensions.get(filter)?.filterAll();
    super.removeFilter(filter);
  }

  addSort(sort: DataClientSort) {
    super.addSort(sort);
    // check if dimension exists and create if not
    if (!this.dimensions.has(sort.field)) {
      this.dimensions.set(
        sort.field,
        this.crossfilter.dimension((d) => d[sort.field]),
      );
    }
  }

  groupBy(field: string | symbol) {
    console.log(this.crossfilter.groupAll().value());

    if (this.dimensions.has(field)) {
      return this.dimensions.get(field)?.group().all() || [];
    }

    this.dimensions.set(
      field,
      this.crossfilter.dimension((d) => d[field]),
    );
    return this.dimensions.get(field)?.group().all() || [];
  }

  get filteredData() {
    return this.crossfilter.allFiltered();
  }

  getData(count = Infinity, page = 1) {
    const offset = (page - 1) * count;

    if (this._sorts.length < 2) {
      const lastSort = this._sorts[this._sorts.length - 1];

      if (lastSort) {
        if (lastSort.order === 'asc') {
          return this.dimensions.get(lastSort.field)?.bottom(count, offset) as Datum[];
        }

        return this.dimensions.get(lastSort.field)?.top(count, offset) as Datum[];
      }

      return this.crossfilter.allFiltered().slice(offset, offset + count) as Datum[];
    }

    // if only sorting on one variable, make a sort dimension according to that variable
    // if more than one variable, crossfilter can only handle sorting on one dimension
    // so we have to get sort index of entire data set and create a new dimension
    // that uses this information
    // this isn't efficient but sorting is expected to happen at much lower frequency
    // than filtering and the user can tolerate more latency with sorting than filtering

    const allData = this.crossfilter.all();
    const sortKey = this._sorts.map((s) => s.field).join('-');

    if (allData.length) {
      const sortData = allData.map((d) => {
        const elem: SortParam = { [sortKey]: d[metaIndex] };
        this._sorts.forEach((s) => {
          elem[s.field] = d[s.field];
        });
        return elem;
      });

      const sortedData = arraySort(
        sortData,
        this._sorts.map((s) => compare(s.field, s.order)),
      );

      const idx: SortParam = {};
      sortedData.forEach((d, i) => {
        idx[d[sortKey]] = i;
      });

      if (this.dimensions.has(sortKey)) this.dimensions.get(sortKey)?.dispose();

      this.dimensions.set(
        sortKey,
        this.crossfilter.dimension((d) => idx[d[metaIndex]]),
      );
    }

    return this.dimensions.get(sortKey)?.bottom(count, offset) as Datum[];
  }
}

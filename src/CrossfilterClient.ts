import crossfilter, { Dimension, Crossfilter } from 'crossfilter2';
import DataClient, { DataClientFilter, DataClientSort } from './DataClient';
import { metaIndex } from './slices/metaDataAPI';

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
        this.dimensions.get(filter.field)?.filterExact(filter.value);
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

  /* removeFilter(filter: DataClientFilter) {
    super.removeFilter(filter);
    this.crossfilter.filterAll();
    this._filters.forEach((f) => this.crossfilter.filter(f.field, f.value));
  } */

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

    if (!this.dimensions.has(sortKey) && allData.length) {
      const sortData = allData.map((d) => {
        const elem: SortParam = { [sortKey]: d[metaIndex] };
        this._sorts.forEach((s) => {
          elem[s.field] = d[s.field];
        });
        return elem;
      });

      const sortedData = sortData.sort((a, b) => {
        for (let i = 0; i < this._sorts.length; i += 1) {
          const s = this._sorts[i];
          if (a[s.field] < b[s.field]) {
            return s.order === 'asc' ? -1 : 1;
          }
          if (a[s.field] > b[s.field]) {
            return s.order === 'asc' ? 1 : -1;
          }
        }

        return 0;
      });

      const idx: SortParam = {};
      sortedData.forEach((d, i) => {
        idx[d[sortKey]] = i;
      });

      this.dimensions.set(
        sortKey,
        this.crossfilter.dimension((d) => idx[d[metaIndex]]),
      );
    }

    if (this._sorts[0].order === 'asc') {
      return this.dimensions.get(sortKey)?.bottom(count, offset) as Datum[];
    }

    return this.dimensions.get(sortKey)?.top(count, offset) as Datum[];
  }
}

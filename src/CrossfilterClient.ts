import crossfilter from 'crossfilter2';
import type { Crossfilter, Dimension, Grouping, NaturallyOrderedValue } from 'crossfilter2';
import arraySort from 'array-sort';
import DataClient, { DataClientFilter, DataClientSort } from './DataClient';
import type { IDataClient } from './DataClient';
import { metaIndex } from './slices/metaDataAPI';
import { MISSING_TEXT } from './constants';

const compare = (field: string | symbol, order: 'asc' | 'desc') => (a: Datum, b: Datum) => {
  if (a[field] !== b[field]) {
    if (a[field] === undefined) {
      return 1;
    }

    if (b[field] === undefined) {
      return -1;
    }

    if (order === 'asc') {
      return a[field] < b[field] ? -1 : 1;
    }
    return a[field] > b[field] ? -1 : 1;
  }

  return 0;
};

const getSortKey = (field: string | symbol) => (typeof field === 'symbol' ? field : `sort_${field}`);

function getStringVal(d: Datum, key: string, dir?: string) {
  if (dir && d[key] === undefined) {
    return dir === 'asc' ? '\uffff' : '';
  }
  return d[key] ? d[key] : MISSING_TEXT;
}

const getNumberVal = (d: Datum, key: string, dir?: string) => {
  if (dir) {
    const sign = dir === 'asc' ? -1 : 1;
    return Number.isNaN(Number(d[key])) || d[key] === undefined ? sign * -Infinity : d[key];
  }
  return Number.isNaN(Number(d[key])) || d[key] === undefined ? -Infinity : d[key];
};

const getDateVal = (d: Datum, key: string, dir?: string) => {
  if (dir) {
    const sign = dir === 'asc' ? -1 : 1;
    const dateValue = new Date(d[key]).getTime();
    return Number.isNaN(dateValue) || d[key] === undefined ? sign * -Infinity : dateValue;
  }

  const dateValue = new Date(d[key]).getTime();
  return Number.isNaN(dateValue) || d[key] === undefined ? -Infinity : dateValue;
};

const valueGetter = {
  string: getStringVal,
  number: getNumberVal,
  date: getDateVal,
  datetime: getDateVal,
};

type D = Dimension<Datum, string | number | Date>;

interface SortParam {
  [key: string | symbol]: string | number;
}

export interface ICrossFilterClient extends Omit<IDataClient, 'groupBy'> {
  crossfilter: Crossfilter<Datum>;
  dimensions: Map<string | symbol, D>;
  groupBy(
    field: string | symbol,
    dataType?: 'string' | 'number' | 'date',
    groupFunc?: (value: string | number) => NaturallyOrderedValue,
  ): readonly Grouping<NaturallyOrderedValue, unknown>[];
}

export default class CrossfilterClient extends DataClient implements ICrossFilterClient {
  crossfilter: Crossfilter<Datum>;

  dimensions: Map<string | symbol, D>;

  constructor(data: Datum[] = []) {
    super(data);
    this.crossfilter = crossfilter<Datum>(data);
    this.dimensions = new Map<string | symbol, D>();

    this.groupBy = this.groupBy.bind(this);
  }

  addData(data: Datum[]) {
    this.crossfilter.remove();
    super.addData(data);
    this.crossfilter.add(data);
  }

  clearData() {
    super.clearData();
    this.crossfilter.remove();
    this.clearFilters();
  }

  addFilter(filter: DataClientFilter) {
    super.addFilter(filter);

    // check if dimension exists and create if not
    if (!this.dimensions.has(filter.field)) {
      this.dimensions.set(
        filter.field,
        this.crossfilter.dimension((d) => valueGetter[filter.dataType](d, filter.field as string)),
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
      case 'range':
        this.dimensions.get(filter.field)?.filter((d) => {
          if (filter.dataType === 'date') {
            // the following typescript ignores are present due to the fix greatly complicating this situation.

            // add a day to the  date to make it inclusive
            return (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              new Date(d as number).getTime() + 86400000 >= filter.value[0] &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              new Date(d as number).getTime() + 86400000 <= filter.value[1]
            );
          }
          if (filter.dataType === 'datetime') {
            // add a minute to the date to make it inclusive
            return (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              new Date(d as number).getTime() + 60000 >= filter.value[0] &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              new Date(d as number).getTime() + 60000 <= filter.value[1]
            );
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return d >= filter.value[0] && d <= filter.value[1];
        });
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
    this.dimensions.set(
      getSortKey(sort.field),
      this.crossfilter.dimension((d) => valueGetter[sort.dataType](d, sort.field as string, sort.order as string)),
    );
  }
  // type mismatch between the type coming from crossfilter and the type coming from the parent class dataclient
  // which is designed to be used with other data clients besides crossfilter
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ts2304

  groupBy(
    field: string | symbol,
    dataType: 'string' | 'number' | 'date' | 'datetime' = 'string',
    groupFunc?: (d: string | number | Date) => NaturallyOrderedValue,
  ) {
    if (this.dimensions.has(field)) {
      if (groupFunc) {
        return this.dimensions.get(field)?.group(groupFunc).all() || [];
      }
      return this.dimensions.get(field)?.group().all() || [];
    }

    this.dimensions.set(
      field,
      this.crossfilter.dimension((d) => valueGetter[dataType](d, field as string)),
    );

    if (groupFunc) {
      return this.dimensions.get(field)?.group(groupFunc).all() || [];
    }

    return this.dimensions.get(field)?.group().all() || [];
  }

  get filteredData() {
    return this.crossfilter.allFiltered();
  }

  // TODO: why is this being called multiple times with the same data?
  // This could impact performance...
  getData(count = Infinity, page = 1) {
    const offset = (page - 1) * count;

    if (this._sorts.length <= 1) {
      const lastSort = this._sorts[this._sorts.length - 1];

      if (lastSort) {
        if (lastSort.order === 'asc') {
          return this.dimensions.get(getSortKey(lastSort.field))?.bottom(count, offset) as Datum[];
        }

        return this.dimensions.get(getSortKey(lastSort.field))?.top(count, offset) as Datum[];
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
      // console.log('SORTING')
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

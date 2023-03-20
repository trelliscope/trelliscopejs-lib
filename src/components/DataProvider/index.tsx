import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { metaIndex, useMetaData } from '../../slices/metaDataAPI';
import { selectNumPerPage, selectPage } from '../../slices/layoutSlice';
import { selectFilterState } from '../../slices/filterSlice';
import { useDisplayMetas } from '../../slices/displayInfoAPI';
import { selectSort } from '../../slices/sortSlice';
import type { IDataClient } from '../../DataClient';

interface DataProviderProps {
  children: React.ReactNode;
  client: IDataClient;
}

export const DataContext = React.createContext<{
  data: Datum[];
  allData: Datum[];
  filteredData: Datum[];
  groupBy: IDataClient['groupBy'];
}>({ data: [], allData: [], filteredData: [], groupBy: () => [] });

const DataProvider: React.FC<DataProviderProps> = ({ children, client }) => {
  const [data, setData] = React.useState<Datum[]>([]);
  const { data: metaData } = useMetaData();
  const displayMetas = useDisplayMetas();
  const numPerPage = useSelector(selectNumPerPage);
  const page = useSelector(selectPage);
  const filters = useSelector(selectFilterState);
  const sorts = useSelector(selectSort);

  const addMissingKeys = (dataArr: Datum[], metas: IMeta[]) =>
    dataArr.map((d) => {
      const res = { ...d };
      metas.forEach((k) => {
        if (res[k.varname] === undefined) {
          if (k.type === 'string' || k.type === 'href' || k.type === 'factor') {
            res[k.varname] = '[missing]';
          }
          if (
            k.type === 'number' ||
            k.type === 'date' ||
            k.type === 'datetime' ||
            k.type === 'currency' ||
            k.type === 'geo' ||
            k.type === 'graph'
          ) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res[k.varname] = null;
          }
        }
      });
      return res;
    });

  useEffect(() => {
    if (metaData) {
      client.clearData();
      client.addData(addMissingKeys(metaData, displayMetas));
    }
  }, [metaData, client, displayMetas]);

  useEffect(() => {
    // Add filters
    client.clearFilters();
    filters.forEach((filter) => {
      if (filter.filtertype === 'category') {
        client.addFilter({
          field: filter.varname,
          value: (filter as ICategoryFilterState).values,
          operation: 'eq',
          dataType: 'string',
        });
      } else if (filter.filtertype === 'numberrange') {
        const { min, max } = filter as INumberRangeFilterState;
        client.addFilter({
          field: filter.varname,
          value: max && min && max < min ? [null, null] : [min || 0, max || Infinity],
          operation: 'range',
          dataType: 'number',
        });
      }
    });

    // Add sort dimensions
    client.clearSorts();
    if (sorts.length === 0) {
      // If no sorts then sort by metaIndex which is original order
      client.addSort({ field: metaIndex, order: 'asc' });
    } else {
      // add sorts to client if they don't already exist
      sorts.forEach((sort: ISortState) => {
        client.addSort({ field: sort.varname, order: sort.dir });
      });
    }

    setData(client.getData(numPerPage, page));
  }, [metaData, numPerPage, filters, sorts, displayMetas, client, page]);

  return (
    <DataContext.Provider
      value={{ data, allData: client.allData, filteredData: client.filteredData, groupBy: client.groupBy }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;

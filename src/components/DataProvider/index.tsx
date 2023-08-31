import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { metaIndex, useMetaData } from '../../slices/metaDataAPI';
import { selectNumPerPage, selectPage } from '../../slices/layoutSlice';
import { selectFilterState } from '../../slices/filterSlice';
import { useDisplayMetas } from '../../slices/displayInfoAPI';
import { selectSort } from '../../slices/sortSlice';
import type { DataType, IDataClient } from '../../DataClient';
import { TYPE_MAP } from '../../constants';

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

  useEffect(() => {
    if (metaData) {
      client.clearData();
      client.addData(metaData);
    }
  }, [metaData, client]);

  useEffect(() => {
    // Add filters
    client.clearFilters();
    filters.forEach((filter) => {
      if (filter.filtertype === 'category' && (filter as ICategoryFilterState).values !== undefined) {
        client.addFilter({
          field: filter.varname,
          value: (filter as ICategoryFilterState).values,
          operation: 'eq',
          dataType: TYPE_MAP[filter.metatype] as DataType,
        });
      } else if (
        filter.filtertype === 'numberrange' ||
        filter.filtertype === 'daterange' ||
        filter.filtertype === 'datetimerange'
      ) {
        const { min, max } = filter as INumberRangeFilterState;
        client.addFilter({
          field: filter.varname,
          value: max && min && max < min ? [null, null] : [min ?? -Infinity, max ?? Infinity],
          operation: 'range',
          dataType: TYPE_MAP[filter.metatype] as DataType,
        });
      }
    });

    // Add sort dimensions
    client.clearSorts();
    if (sorts.length === 0) {
      // If no sorts then sort by metaIndex which is original order
      client.addSort({ field: metaIndex, order: 'asc', dataType: 'number' });
    } else {
      // add sorts to client if they don't already exist
      sorts.forEach((sort: ISortState) => {
        client.addSort({
          field: sort.varname,
          order: sort.dir,
          dataType: TYPE_MAP[sort.metatype] as DataType,
        });
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

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { IDataClient } from '../../DataClient';
import { metaIndex, useMetaData } from '../../slices/metaDataAPI';
import { selectNumPerPage, selectPage } from '../../slices/layoutSlice';
import { selectFilterState } from '../../slices/filterSlice';
import { useDisplayMetas } from '../../slices/displayInfoAPI';
import { selectSort } from '../../slices/sortSlice';

interface DataProviderProps {
  children: React.ReactNode;
  client: IDataClient;
}

export const DataContext = React.createContext<{
  data: Datum[];
  allData: Datum[];
  filteredData: Datum[];
  groupBy: (field: string) => { [key: string]: number }[];
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
    filters.forEach((filter: IFilterState) => {
      if (filter.filtertype === 'category') {
        client.addFilter({
          field: filter.varname,
          value: (filter as ICategoryFilterState).values,
          operation: 'eq',
        });
      } else if (filter.filtertype === 'numberrange') {
        const { min, max } = filter as INumberRangeFilterState;
        client.addFilter({ field: filter.varname, value: [min || 0, max || Infinity], operation: 'range' });
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

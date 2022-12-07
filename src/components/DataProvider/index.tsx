import React, { useEffect } from 'react';
import crossfilter from 'crossfilter2';
import { useSelector } from 'react-redux';
import { useMetaData } from '../../slices/metaDataAPI';
import { selectNumPerPage } from '../../slices/layoutSlice';
import { selectFilterState } from '../../slices/filterSlice';
import { RootState } from '../../store';

interface DataProviderProps {
  children: React.ReactNode;
  client: any;
}

const cf = crossfilter();

export const DataContext = React.createContext([]);

const DataProvider: React.FC<DataProviderProps> = ({ children, client }) => {
  const [data, setData] = React.useState<any>([]);
  const { data: metaData } = useMetaData();
  const numPerPage = useSelector(selectNumPerPage);
  const filters = useSelector(selectFilterState);
  const sorts = useSelector((state: RootState) => state.sort);

  useEffect(() => {
    if (metaData) {
      cf.add(metaData);
    }
  }, [metaData]);

  useEffect(() => {
    // Add filter dimensions
    const dimensions = filters.map((filter: any) => {
      const dimension = cf.dimension((d: any) => d[filter.varname]);
      if (filter.filtertype === 'category') {
        dimension.filter(filter.values[0]);
      } else if (filter.filtertype === 'numberrange') {
        dimension.filter([filter.min, filter.max]);
      }
      return dimension;
    });

    // Add sort dimensions
    sorts.forEach((sort: any) => {
      dimensions.push(cf.dimension((d: any) => d[sort.varname]));
    });

    if (dimensions.length !== 0) {
      if (sorts[0]?.dir === 'asc') {
        setData(dimensions[dimensions.length - 1]?.bottom(numPerPage));
      } else {
        setData(dimensions[dimensions.length - 1]?.top(numPerPage));
      }
    }
    console.log(cf);
  }, [metaData, numPerPage, filters, sorts]);

  console.log(cf.all());

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export default DataProvider;

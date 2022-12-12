import React, { useEffect } from 'react';
import crossfilter, { Dimension } from 'crossfilter2';
import { useSelector } from 'react-redux';
import keyBy from 'lodash.keyby';
import { byNumber, byString, byValues } from 'sort-es';
import { metaIndex, useMetaData } from '../../slices/metaDataAPI';
import { selectNumPerPage } from '../../slices/layoutSlice';
import { selectFilterState } from '../../slices/filterSlice';
import { useDisplayMetas } from '../../slices/displayInfoAPI';
import { selectSort } from '../../slices/sortSlice';

interface DataProviderProps {
  children: React.ReactNode;
  client: any;
}

interface SortParam {
  [key: string | symbol]: string | number;
}

type D = Dimension<Datum, string | number>;

const cf = crossfilter<Datum>();
const filterDimensions = new Map<string, D>();
const sortDimensions = new Map<string | symbol, D>();

window.globalCF = crossfilter();

export const DataContext = React.createContext([]);

const DataProvider: React.FC<DataProviderProps> = ({ children, client }) => {
  const [data, setData] = React.useState<Datum[]>([]);
  const { data: metaData } = useMetaData();
  const displayMetas = useDisplayMetas();
  const numPerPage = useSelector(selectNumPerPage);
  const filters = useSelector(selectFilterState);
  const sorts = useSelector(selectSort);

  useEffect(() => {
    if (metaData) {
      cf.add(metaData);
      window.globalCF.add(metaData);
    }
  }, [metaData]);

  useEffect(() => {
    const metas = keyBy(displayMetas, 'varname');
    // Add filter dimensions
    filters.forEach((filter: IFilterState) => {
      const dimension = cf.dimension((d) => d[filter.varname]);
      if (filter.filtertype === 'category') {
        dimension.filter((filter as ICategoryFilterState).values[0]);
      } else if (filter.filtertype === 'numberrange') {
        const { min, max } = filter as INumberRangeFilterState;
        dimension.filter([min || 0, max || Infinity]);
      }

      filterDimensions.set(filter.varname, dimension);
    });

    // Add sort dimensions
    if (sorts.length === 0) {
      sortDimensions.forEach((d) => d.dispose());
      sortDimensions.set(
        'default',
        cf.dimension((d) => d[metaIndex]),
      );
    } else if (sorts.length === 1) {
      sortDimensions.set(
        sorts[0].varName,
        cf.dimension((d) => d[sorts[0].varname]),
      );
    } else {
      const allData = cf.all();
      const sortData = allData.map((d) => {
        const elem: SortParam = { [metaIndex]: d[metaIndex] };
        sorts.forEach((sort: ISortState) => {
          elem[sort.varname] = d[sort.varname];
        });
        return elem;
      });

      if (sorts.length) {
        const sortedData: Datum[] = sortData.sort(
          byValues(
            sorts.map((s: ISortState) => {
              if (metas[s.varname].type === 'number') {
                return [(x: Datum) => x[s.varname], byNumber({ desc: s.dir === 'desc' })];
              }

              return [(x: Datum) => x[s.varname], byString({ desc: s.dir === 'desc' })];
            }),
          ),
        );
        const idx: SortParam = {};
        sortedData.forEach((d, i) => {
          idx[d[metaIndex]] = i;
        });

        sortDimensions.set(
          metaIndex,
          cf.dimension((d) => idx[d[metaIndex]]),
        );
      }
    }

    const lastDimension = Array.from(sortDimensions.values()).pop();

    if (sorts.length !== 0) {
      if (sorts[0]?.dir === 'asc') {
        setData(lastDimension?.bottom(numPerPage) || []);
      } else {
        setData(lastDimension?.top(numPerPage) || []);
      }
    } else {
      setData(sortDimensions.get('default')?.bottom(numPerPage) || []);
    }
  }, [metaData, numPerPage, filters, sorts, displayMetas]);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export default DataProvider;

import React, { useContext, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { FILTER_TYPE_CATEGORY, MISSING_TEXT, META_TYPE_FACTOR, TYPE_MAP } from '../../../../constants';
import useMetaInfo from '../../../../selectors/useMetaInfo';
import { updateFilterValues, addFilter, updateFilter, removeFilter } from '../../../../slices/filterSlice';
import CatHistogram from '../../../CatHistogram';
import { DataContext } from '../../../DataProvider';
import { useDisplayMetas } from '../../../../slices/displayInfoAPI';
import Ellipsis from '../../../Ellipsis/Ellipsis';

import styles from './FilterCat.module.scss';
import { getFactorFromLabel, getLabelFromFactor } from '../../../../utils';

interface FilterCatProps {
  meta: IFactorMeta;
  filter?: ICategoryFilterState;
}

const FilterCat: React.FC<FilterCatProps> = ({ meta, filter }) => {
  const { domain = [0, 0], dist = {} } = useMetaInfo(meta.varname, meta.type);
  const cleanMeta = meta.levels?.map((m) => (m === null ? MISSING_TEXT : m));
  const displayMetas = useDisplayMetas();
  const curDisplayMeta = displayMetas.find((d) => d.varname === meta.varname);
  const { filterSortOrder } = curDisplayMeta as IMeta;
  const { groupBy } = useContext(DataContext);
  const dispatch = useDispatch();
  const defaultSort = filterSortOrder || 'ct,desc';
  const [curSort, setCurSort] = useState(defaultSort);

  const sortChartData = (sortOrder: string, data: { key: string | number; value: number }[]) => {
    const [sortKey, sortDir] = sortOrder.split(',');
    return data.sort((a, b) => {
      if (sortKey === 'ct') {
        return sortDir === 'asc' ? a.value - b.value : b.value - a.value;
      }
      if (meta.type === META_TYPE_FACTOR) {
        const label = getLabelFromFactor(a.key as number, cleanMeta);
        const label2 = getLabelFromFactor(b.key as number, cleanMeta);
        return sortDir === 'asc' ? label.localeCompare(label2) : label2.localeCompare(label);
      }
      return sortDir === 'asc'
        ? (a.key as string).localeCompare(b.key as string)
        : (b.key as string).localeCompare(a.key as string);
    });
  };

  const sortOptions = [
    { payload: 'ct,asc', text: 'Order: count ascending' },
    { payload: 'ct,desc', text: 'Order: count descending' },
    { payload: 'id,asc', text: 'Order: label ascending' },
    { payload: 'id,desc', text: 'Order: label descending' },
  ];

  const handleBarClick = (value: string) => {
    if (filter) {
      dispatch(updateFilterValues({ varname: filter.varname, value }));
    } else {
      const newFilter = {
        type: 'filter',
        varname: meta.varname,
        filtertype: FILTER_TYPE_CATEGORY,
        regexp: null,
        values: [value],
        metatype: meta.type,
      } as ICategoryFilterState;
      dispatch(addFilter(newFilter));
    }
  };

  useEffect(() => {
    if (filter && filter.values.length === 0 && filter.regexp === null) {
      dispatch(removeFilter(filter.varname));
    }
  }, [dispatch, filter]);

  const handleRegex = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;

    if (value) {
      // we need to escape characters like [ in the regex
      const regexp = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const regexValues = cleanMeta
        ? cleanMeta.filter((level) => level.match(regexp))
        : groupBy(meta.varname, TYPE_MAP[meta.type])
            .filter((level) => (level.key as string).match(regexp))
            .map((level) => level.key);

      let filteredValues = regexValues;
      if (meta.type === META_TYPE_FACTOR) {
        filteredValues = getFactorFromLabel(regexValues as string[], cleanMeta) as number[];
      }

      const newFilter = {
        type: 'filter',
        varname: meta.varname,
        filtertype: FILTER_TYPE_CATEGORY,
        regexp: value,
        values: filteredValues,
        metatype: meta.type,
      } as ICategoryFilterState;

      dispatch(filter ? updateFilter(newFilter) : addFilter(newFilter));
    } else if (filter) {
      dispatch(removeFilter(filter.varname));
    }
  };

  return (
    <div className={styles.filterCat}>
      <div className={styles.filterCatChart}>
        <CatHistogram
          data={sortChartData(curSort, groupBy(meta.varname, TYPE_MAP[meta.type]))}
          allData={dist}
          domain={domain}
          actives={filter?.values || []}
          count={cleanMeta?.length || groupBy(meta.varname, TYPE_MAP[meta.type]).length}
          width={220}
          height={75}
          barHeight={15}
          onClick={handleBarClick}
          metaLevels={cleanMeta}
          metaType={meta.type}
        />
      </div>
      <div className={styles.filterCatInputContainer}>
        <div>
          <TextField
            placeholder="regex"
            classes={{ root: styles.filterCatRegex }}
            value={filter?.regexp || ''}
            onChange={handleRegex}
            variant="standard"
          />
        </div>
        <Ellipsis options={sortOptions} curItem={curSort} setCurItem={setCurSort} />
      </div>
    </div>
  );
};

FilterCat.defaultProps = {
  filter: undefined,
};

export default FilterCat;

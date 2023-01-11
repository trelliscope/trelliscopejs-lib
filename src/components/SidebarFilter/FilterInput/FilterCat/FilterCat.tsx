import React, { useContext, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { FILTER_TYPE_CATEGORY } from '../../../../constants';
import useMetaInfo from '../../../../selectors/useMetaInfo';
import { updateFilterValues, addFilter, updateFilter, removeFilter } from '../../../../slices/filterSlice';
import CatHistogram from '../../../CatHistogram';
import { DataContext } from '../../../DataProvider';

import styles from './FilterCat.module.scss';

interface FilterCatProps {
  meta: IFactorMeta;
  filter?: ICategoryFilterState;
}

const FilterCat: React.FC<FilterCatProps> = ({ meta, filter }) => {
  const { domain, dist } = useMetaInfo(meta.varname, meta.type);
  const { groupBy } = useContext(DataContext);
  const dispatch = useDispatch();

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
      } as ICategoryFilterState;
      dispatch(addFilter(newFilter));
    }
  };

  useEffect(() => {
    if (filter?.values.length === 0) {
      dispatch(removeFilter(filter.varname));
    }
  }, [dispatch, filter?.values, filter?.varname]);

  const handleRegex = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;

    if (value) {
      const regexp = new RegExp(value, 'i');
      const filteredValues = meta.levels.filter((level) => level.match(regexp));

      const newFilter = {
        type: 'filter',
        varname: meta.varname,
        filtertype: FILTER_TYPE_CATEGORY,
        regexp: value,
        values: filteredValues,
      } as ICategoryFilterState;

      dispatch(updateFilter(newFilter));
    } else if (filter) {
      dispatch(removeFilter(filter.varname));
    }
  };

  return (
    <div className={styles.filterCat}>
      <div className={styles.filterCatChart}>
        <CatHistogram
          data={groupBy(meta.varname)}
          allData={dist}
          domain={domain}
          actives={filter?.values}
          count={meta.levels.length}
          width={220}
          height={75}
          barHeight={15}
          onClick={handleBarClick}
        />
      </div>
      <div className={styles.filterCatInput}>
        <TextField
          placeholder="regex"
          classes={{ root: styles.filterCatRegex }}
          value={filter?.regexp || ''}
          onChange={handleRegex}
          variant="standard"
        />
      </div>
    </div>
  );
};

FilterCat.defaultProps = {
  filter: undefined,
};

export default FilterCat;

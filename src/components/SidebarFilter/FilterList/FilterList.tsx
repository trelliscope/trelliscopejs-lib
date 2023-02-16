import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { COMMON_TAGS_KEY } from '../../../constants';
import { useDisplayMetas, useMetaGroups } from '../../../slices/displayInfoAPI';
import { selectFilterState, selectActiveFilterView, setFilterView } from '../../../slices/filterSlice';
import Pill from '../../Pill';

import styles from './FilterList.module.scss';

const FilterList: React.FC = () => {
  const activeFilters = useSelector(selectActiveFilterView);
  const displayMetas = useDisplayMetas();
  const unfilterableMetas = displayMetas.filter((meta) => !meta.filterable).map((meta) => meta.varname);
  const inactiveFilterGroups = useMetaGroups([...activeFilters, ...unfilterableMetas] as string[]);
  const curFilters = useSelector(selectFilterState);

  const curFiltersArr = curFilters.map((filter: IFilterState) => filter.varname);

  const dispatch = useDispatch();

  const handleClick = (filter: string) => {
    dispatch(setFilterView({ name: filter, which: 'add' }));
  };

  return (
    <div className={styles.filterList}>
      <div className={styles.filterListHeading}>Select a variable to filter on:</div>
      {Array.from(inactiveFilterGroups.keys()).map((key) => (
        <Fragment key={key.toString()}>
          {(inactiveFilterGroups?.get(key)?.length || 0) > 0 && (
            <div className={styles.filterListGroup} key={key.toString()}>
              {key !== COMMON_TAGS_KEY && (
                <div className={styles.filterListGroupHeader}>
                  <>
                    {key} ({inactiveFilterGroups?.get(key)?.length})
                  </>
                </div>
              )}
              <ul className={styles.filterListItems}>
                {inactiveFilterGroups?.get(key)?.map((filter) => (
                  <Pill key={filter} onClick={() => handleClick(filter)} activeFiltersArray={curFiltersArr}>
                    {filter}
                  </Pill>
                ))}
              </ul>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default FilterList;

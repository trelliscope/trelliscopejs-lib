import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { COMMON_TAGS_KEY } from '../../../constants';
import { useMetaGroups } from '../../../slices/displayInfoAPI';
import { selectInactiveFilterView, setFilterView } from '../../../slices/filterSlice';
import Pill from '../../Pill';

import styles from './FilterList.module.scss';

const FilterList: React.FC = () => {
  const inactiveFilters = useSelector(selectInactiveFilterView);
  const inactiveFilterGroups = useMetaGroups(inactiveFilters);

  const dispatch = useDispatch();

  const handleClick = (filter: string) => {
    dispatch(setFilterView({ name: filter, which: 'add' }));
  };

  return (
    <div className={styles.filterList}>
      <div className={styles.filterListHeading}>Select a variable to filter on:</div>
      {Array.from(inactiveFilterGroups.keys()).map((key) => (
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
              <Pill key={filter} onClick={() => handleClick(filter)}>
                {filter}
              </Pill>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FilterList;

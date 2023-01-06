import React from 'react';
import { useDispatch } from 'react-redux';
import { commonTagsKey, setFilterView, useInactiveFilterGroups } from '../../../slices/filterSlice';
import Pill from '../../Pill';

import styles from './FilterList.module.scss';

const FilterList: React.FC = () => {
  const inactiveFilterGroups = useInactiveFilterGroups();
  const dispatch = useDispatch();

  const handleClick = (filter: string) => {
    dispatch(setFilterView({ name: filter, which: 'add' }));
  };

  return (
    <div className={styles.filterList}>
      <div className={styles.filterListHeading}>Select a variable to filter on:</div>
      {Object.keys(inactiveFilterGroups).map((key) => (
        <div className={styles.filterListGroup} key={key}>
          {key !== commonTagsKey && (
            <div className={styles.filterListGroupHeader}>
              {key} ({inactiveFilterGroups[key].length})
            </div>
          )}
          <ul className={styles.filterListItems}>
            {inactiveFilterGroups[key].map((filter) => (
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

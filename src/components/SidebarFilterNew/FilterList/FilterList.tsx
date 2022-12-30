// Filter List Component
//
// Path: src/components/SidebarFilterNew/FilterList/FilterList.tsx

import React from 'react';

import styles from './FilterList.module.scss';

interface FilterListProps {}

const FilterList: React.FC<FilterListProps> = () => {
  return (
    <div className={styles.filterList}>
      <div className={styles.filterListHeading}>Select a variable to filter on:</div>
    </div>
  );
};

export default FilterList;

import React from 'react';
import { useSelector } from 'react-redux';
import { filterViewSelector } from '../../selectors';
import FilterInput from './FilterInput';
import FilterList from './FilterList';
import styles from './SidebarFilter.module.scss';

const SidebarFilter: React.FC = () => {
  const { active: activeFilters } = useSelector(filterViewSelector);
  return (
    <div className={styles.sidebarFilterNew}>
      {activeFilters.map((filter) => (
        <FilterInput key={filter} filterName={filter} />
      ))}
      <FilterList />
    </div>
  );
};

export default SidebarFilter;

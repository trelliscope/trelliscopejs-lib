import React from 'react';
import { useSelector } from 'react-redux';
import { filterViewSelector } from '../../selectors';
import FilterInput from './FilterInput';
import FilterList from './FilterList';
import styles from './SidebarFilterNew.module.scss';

interface SidebarFilterNewProps {}

const SidebarFilterNew: React.FC<SidebarFilterNewProps> = () => {
  const { active: activeFilters } = useSelector(filterViewSelector);
  return (
    <div className={styles.sidebarFilterNew}>
      {activeFilters.map((filter) => (
        <FilterInput key={filter} filter={filter} />
      ))}
      <FilterList />
    </div>
  );
};

export default SidebarFilterNew;

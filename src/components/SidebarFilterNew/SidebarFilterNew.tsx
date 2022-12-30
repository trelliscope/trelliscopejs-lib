import React from 'react';
import FilterInputs from './FilterInputs';
import FilterList from './FilterList';
import styles from './SidebarFilterNew.module.scss';

interface SidebarFilterNewProps {}

const SidebarFilterNew: React.FC<SidebarFilterNewProps> = () => {
  return (
    <div className={styles.sidebarFilterNew}>
      <FilterInputs />
      <FilterList />
    </div>
  );
};

export default SidebarFilterNew;

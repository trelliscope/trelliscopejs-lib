import React from 'react';
import { Drawer } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { sidebarActiveSelector } from '../../selectors/ui';
import Filters from '../Filters';
import { filterViewSelector } from '../../selectors';
import FilterInput from '../SidebarFilter/FilterInput';
import styles from './SidebarNew.module.scss';

const drawerWidth = 400;

const SidebarNew: React.FC = () => {
  const sidebarOpen = useSelector(sidebarActiveSelector);
  const { active: activeFilters } = useSelector(filterViewSelector);
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: 'inherit',
        '& .MuiDrawer-paper': {
          paddingTop: '63px',
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          height: 'inherit',
        },
      }}
      open={sidebarOpen}
      className={styles.sidebarNew}
      variant="persistent"
      anchor="left"
    >
      <Filters />
      {activeFilters.length === 0 && (
        <div className={styles.sidebarNewNoFilter}>
          Select a filter...
          <FontAwesomeIcon className={styles.sidebarNewBobbingArrow} icon={faArrowUp} />
        </div>
      )}
      {activeFilters.map((filter) => (
        <FilterInput key={filter} filterName={filter} />
      ))}
    </Drawer>
  );
};

export default SidebarNew;

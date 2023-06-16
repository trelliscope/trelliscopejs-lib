import React from 'react';
import { Drawer } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { sidebarActiveSelector } from '../../selectors/ui';
import Filters from '../Filters';
import { filterViewSelector } from '../../selectors';
import FilterInput from '../FilterInput';
import styles from './Sidebar.module.scss';

const drawerWidth = 400;

const Sidebar: React.FC = () => {
  const sidebarOpen = useSelector(sidebarActiveSelector);
  const { active: activeFilters } = useSelector(filterViewSelector);
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: 'inherit',
        '& .MuiDrawer-paper': {
          paddingTop: '54px',
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          height: 'inherit',
        },
      }}
      open={sidebarOpen}
      className={styles.sidebar}
      variant="persistent"
      anchor="left"
    >
      <Filters />
      {activeFilters.length === 0 && (
        <div className={styles.sidebarNoFilter}>
          Select a filter...
          <FontAwesomeIcon className={styles.sidebarBobbingArrow} icon={faArrowUp} />
        </div>
      )}
      {activeFilters.map((filter) => (
        <FilterInput key={filter} filterName={filter} />
      ))}
    </Drawer>
  );
};

export default Sidebar;

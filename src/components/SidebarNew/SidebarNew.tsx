import { Drawer } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { sidebarActiveSelector } from '../../selectors/ui';
import styles from './SidebarNew.module.scss';

const drawerWidth = 400;

const SidebarNew: React.FC = () => {
  const sidebarOpen = useSelector(sidebarActiveSelector);
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      open={sidebarOpen}
      className={styles.sidebarNew}
      variant="persistent"
      anchor="left"
    >
      hello
    </Drawer>
  );
};

export default SidebarNew;

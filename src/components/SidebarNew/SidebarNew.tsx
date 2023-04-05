import { Drawer } from '@mui/material';
import React from 'react';
import styles from './SidebarNew.module.scss';

const SidebarNew: React.FC = () => {
  console.log('SidebarNew');
  return (
    <>
      <Drawer className={styles.sidebarNew} variant="persistent" anchor="left">
        hello
      </Drawer>
    </>
  );
};

export default SidebarNew;

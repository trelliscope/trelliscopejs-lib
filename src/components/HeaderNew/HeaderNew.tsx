import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useDisplayList } from '../../slices/displayListAPI';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import styles from './HeaderNew.module.scss';

interface HeaderNewProps {
  something?: string;
}

const HeaderNew: React.FC<HeaderNewProps> = () => {
  const { data: displayList = [] } = useDisplayList();
  const selectedDisplay = useSelectedDisplay();

  console.log('displayList', displayList, selectedDisplay);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="default">
      <Toolbar>
        <div className={styles.headerNew}>
          {displayList.length > 1 && <div>hi</div>}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {selectedDisplay?.description}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNew;

import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useDisplayList } from '../../slices/displayListAPI';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { setDialogOpen } from '../../slices/appSlice';
import DisplaySelect from '../DisplaySelect';
import styles from './HeaderNew.module.scss';

interface HeaderNewProps {
  something?: string;
}

const HeaderNew: React.FC<HeaderNewProps> = () => {
  const { data: displayList = [] } = useDisplayList();
  const dispatch = useDispatch();

  const selectedDisplay = useSelectedDisplay();

  const handleDialogOpen = (isOpen: boolean) => {
    dispatch(setDialogOpen(isOpen));
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="default">
      <Toolbar>
        <div className={styles.headerNew}>
          <div className={styles.headerNewDisplayInfo}>
            {displayList.length > 1 && <DisplaySelect setDialogOpen={handleDialogOpen} />}
            <div>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                {selectedDisplay?.name}
              </Typography>
              {selectedDisplay?.description && (
                <Typography variant="subtitle1" noWrap component="div" sx={{ flexGrow: 1 }}>
                  {selectedDisplay?.description}
                </Typography>
              )}
            </div>
          </div>
          <LayoutSelector />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNew;

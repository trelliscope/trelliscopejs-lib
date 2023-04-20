import { AppBar, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDisplayList } from '../../slices/displayListAPI';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { setDialogOpen } from '../../slices/appSlice';
import DisplaySelect from '../DisplaySelect';
import styles from './HeaderNew.module.scss';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import ExportInputDialog from '../ExportInputDialog';

interface HeaderNewProps {
  something?: string;
}

const HeaderNew: React.FC<HeaderNewProps> = () => {
  const { data: displayList = [] } = useDisplayList();
  const dispatch = useDispatch();
  const [hasInputs, setHasInputs] = useState(false);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const selectedDisplay = useSelectedDisplay();
  const { data: displayInfo } = useDisplayInfo();

  useEffect(() => {
    if (displayInfo && displayInfo.inputs) {
      setHasInputs(true);
    }
    if (displayInfo?.inputs?.storageInterface?.type === 'localStorage') {
      setHasLocalStorage(true);
    }
  }, [displayInfo]);

  const handleDialogOpen = (isOpen: boolean) => {
    dispatch(setDialogOpen(isOpen));
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="default">
      <Toolbar>
        <div className={styles.headerNew}>
          <div className={styles.headerNewDisplayInfo}>
            {displayList.length > 1 && <DisplaySelect setDialogOpen={handleDialogOpen} />}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {selectedDisplay?.description}
            </Typography>
          </div>
          <div className={styles.headerNewRight}>
            {hasInputs && hasLocalStorage && (
              <ExportInputDialog
                displayInfo={displayInfo as IDisplay}
                hasInputs={hasInputs}
                hasLocalStorage={hasLocalStorage}
              />
            )}
            <LayoutSelector />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNew;

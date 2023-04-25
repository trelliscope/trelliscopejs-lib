import { AppBar, Toolbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDisplayList } from '../../slices/displayListAPI';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { setDialogOpen } from '../../slices/appSlice';
import DisplaySelect from '../DisplaySelect';
import FullscreenButton from '../FullscreenButton';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import ExportInputDialog from '../ExportInputDialog';
import { DataContext } from '../DataProvider';
import DisplayInfo from '../DisplayInfo';
import styles from './HeaderNew.module.scss';
import HelpInfo from '../HelpInfo';
import Share from '../Share';

interface HeaderNewProps {
  something?: string;
}

const HeaderNew: React.FC<HeaderNewProps> = () => {
  const { data: displayList = [] } = useDisplayList();
  const { allData } = useContext(DataContext);
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
    <AppBar position="absolute" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="default">
      <Toolbar>
        <div className={styles.headerNew}>
          <div className={styles.headerNewDisplayInfo}>
            <DisplayInfo setDialogOpen={handleDialogOpen} totPanels={allData?.length} />
            {displayList.length > 1 && <DisplaySelect setDialogOpen={handleDialogOpen} />}
            <div className={styles.headerNewDisplayInfoTitleContainer}>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, lineHeight: '1.25' }}>
                {selectedDisplay?.name}
              </Typography>
              {selectedDisplay?.description && (
                <Typography variant="subtitle1" noWrap component="div" sx={{ flexGrow: 1, lineHeight: '1.25' }}>
                  {selectedDisplay?.description}
                </Typography>
              )}
            </div>
          </div>
          <div className={styles.headerNewRight}>
            <Share />
            {hasInputs && hasLocalStorage && (
              <ExportInputDialog
                displayInfo={displayInfo as IDisplay}
                hasInputs={hasInputs}
                hasLocalStorage={hasLocalStorage}
              />
            )}
            <LayoutSelector />
            <HelpInfo setDialogOpen={handleDialogOpen} />
            <FullscreenButton />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNew;

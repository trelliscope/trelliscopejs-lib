import { AppBar, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDisplayList } from '../../slices/displayListAPI';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import DisplaySelect from '../DisplaySelect';
import FullscreenButton from '../FullscreenButton';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import ExportInputDialog from '../ExportInputDialog';
import DisplayInfo from '../DisplayInfo';
import styles from './HeaderNew.module.scss';
import HelpInfo from '../HelpInfo';
import Share from '../Share';

interface HeaderNewProps {
  something?: string;
}

const HeaderNew: React.FC<HeaderNewProps> = () => {
  const { data: displayList = [] } = useDisplayList();
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

  return (
    <AppBar className={styles.headerNewAppBar} position="absolute" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="default" elevation={0}>
      <Toolbar className={styles.headerNewToolbar} disableGutters>
        <div className={styles.headerNew}>
          <div className={styles.headerNewDisplayInfo}>
            <DisplayInfo />
            {displayList.length > 1 && <DisplaySelect />}
            <div className={styles.headerNewDisplayInfoTitleContainer}>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, lineHeight: '1.25' }}>
                {selectedDisplay?.name}
              </Typography>
              {selectedDisplay?.description && selectedDisplay?.description !== selectedDisplay?.name && (
                <Typography variant="subtitle1" noWrap component="div" sx={{ flexGrow: 1, lineHeight: '1.25', fontSize: '13px' }}>
                  {selectedDisplay?.description}
                </Typography>
              )}
            </div>
          </div>
          <div className={styles.headerNewRight}>
            <div className={styles.headerNewIconButton}>
              <Share />
            </div>
            {hasInputs && hasLocalStorage && (
              <div className={styles.headerNewIconButton}>
                <ExportInputDialog
                  displayInfo={displayInfo as IDisplay}
                  hasInputs={hasInputs}
                  hasLocalStorage={hasLocalStorage}
                />
              </div>
            )}
            <div className={styles.headerNewTrelliscope}>
              Trelliscope
            <HelpInfo />
            </div>
            <FullscreenButton />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNew;

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand } from '@fortawesome/free-solid-svg-icons';
import Tour from 'reactour';
import { useSelector } from 'react-redux';
import { useDisplayList } from '../../slices/displayListAPI';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import DisplaySelect from '../DisplaySelect';
import FullscreenButton from '../FullscreenButton';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import ExportInputDialog from '../ExportInputDialog';
import DisplayInfo from '../DisplayInfo';
import styles from './Header.module.scss';
import HelpInfo from '../HelpInfo';
import Share from '../Share';
import { selectLayout } from '../../slices/layoutSlice';
import { TOUR_STEPS } from '../../constants';

const Header: React.FC = () => {
  const { data: displayList = [] } = useDisplayList();
  const [hasInputs, setHasInputs] = useState(false);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const selectedDisplay = useSelectedDisplay();
  const { data: displayInfo } = useDisplayInfo();

  const layout = useSelector(selectLayout);

  const [tourIsOpen, setTourIsOpen] = useState(false);

  const handleTourClose = () => {
    setTourIsOpen(!tourIsOpen);
  };

  const [tourSteps, setTourSteps] = useState(TOUR_STEPS);

  useEffect(() => {
    if (layout?.viewtype === 'table') {
      const newTourSteps = TOUR_STEPS.filter(
        (step) => step.selector !== '#panel-control' && step.selector !== '#label-control',
      );
      setTourSteps(newTourSteps);
      return;
    }
    setTourSteps(TOUR_STEPS);
  }, [layout]);

  useEffect(() => {
    if (displayInfo && displayInfo.inputs) {
      setHasInputs(true);
    }
    if (displayInfo?.inputs?.storageInterface?.type === 'localStorage') {
      setHasLocalStorage(true);
    }
  }, [displayInfo]);

  return (
    <AppBar
      className={styles.headerAppBar}
      position="absolute"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        '&.MuiAppBar-root': { background: '#fefefe' },
      }}
      color="default"
      elevation={0}
    >
      <Toolbar className={styles.headerToolbar} disableGutters>
        <Tour steps={tourSteps} isOpen={tourIsOpen} onRequestClose={handleTourClose} />
        <div className={styles.header}>
          <div id="display-control" className={styles.headerDisplayInfo}>
            <DisplayInfo />
            {displayList.length > 1 && <DisplaySelect />}
            <div className={styles.headerDisplayInfoTitleContainer}>
              <Typography
                data-testid="selected-title"
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, lineHeight: '1.25' }}
              >
                {selectedDisplay?.name}
              </Typography>
              {selectedDisplay?.description && selectedDisplay?.description !== selectedDisplay?.name && (
                <Typography
                  variant="subtitle1"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1, lineHeight: '1.25', fontSize: '13px' }}
                >
                  {selectedDisplay?.description}
                </Typography>
              )}
            </div>
          </div>
          <div className={styles.headerRight}>
            <Tooltip title="Launch Help Tour">
              <IconButton data-testid="tour-button" onClick={handleTourClose}>
                <FontAwesomeIcon icon={faHand} />
              </IconButton>
            </Tooltip>
            <div id="share-control" className={styles.headerIconButton}>
              <Share />
            </div>
            {hasInputs && hasLocalStorage && (
              <div id="export-control" className={styles.headerIconButton}>
                <ExportInputDialog
                  displayInfo={displayInfo as IDisplay}
                  hasInputs={hasInputs}
                  hasLocalStorage={hasLocalStorage}
                />
              </div>
            )}
            <div data-testid="app-title" className={styles.headerTrelliscope}>
              Trelliscope
              <HelpInfo />
              <div id="fullscreen-control" className={styles.headerTrelliscopeFullscreen}>
                <FullscreenButton />
              </div>
            </div>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

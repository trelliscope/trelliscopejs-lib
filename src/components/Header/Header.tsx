import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand } from '@fortawesome/free-solid-svg-icons';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
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

  const [tourIndex, setTourIndex] = useState(0);

  const layout = useSelector(selectLayout);

  const [tourIsOpen, setTourIsOpen] = useState(false);

  const handleCallBack = (event: {
    status: string;
    action: string;
    index: number;
    type: 'step:after' | 'error:target_not_found';
  }) => {
    if (event?.status === 'skipped' || event?.status === 'finished' || event?.action === 'close') {
      setTourIndex(event.index);
      setTourIsOpen(false);
      if (event?.status === 'finished') {
        setTourIndex(0);
      }
      return;
    }
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(event?.type)) {
      // Update state to advance the tour
      setTourIndex(tourIndex + (event?.action === ACTIONS.PREV ? -1 : 1));
    }
  };

  const [tourSteps, setTourSteps] = useState(TOUR_STEPS);

  useEffect(() => {
    setTourIndex(0);
    if (layout?.viewtype === 'table') {
      const newTourSteps = TOUR_STEPS.filter((step) => step.target !== '#panel-control' && step.target !== '#label-control');
      setTourSteps(newTourSteps);
      return;
    }
    setTourSteps(TOUR_STEPS);
  }, [layout?.viewtype]);

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
        <Joyride
          run={tourIsOpen}
          steps={tourSteps}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          callback={handleCallBack}
          stepIndex={tourIndex}
          continuous
          showSkipButton
          disableScrollParentFix
          locale={{
            last: 'End Tour',
          }}
          styles={{
            options: {
              primaryColor: '#4489FF',
              zIndex: 9000,
            },
          }}
        />
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
              <IconButton data-testid="tour-button" onClick={() => setTourIsOpen(true)}>
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

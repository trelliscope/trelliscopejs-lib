import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, useTheme, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand } from '@fortawesome/free-solid-svg-icons';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
import { useDispatch, useSelector } from 'react-redux';
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
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import { META_TYPE_PANEL, TOUR_STEPS } from '../../constants';
import { useConfig } from '../../slices/configAPI';
import PanelPicker from '../PanelPicker';

const Header: React.FC = () => {
  const { data: displayList = [] } = useDisplayList();
  const [hasInputs, setHasInputs] = useState(false);
  const theme = useTheme();

  const { data: configObj } = useConfig();

  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const selectedDisplay = useSelectedDisplay();
  const { data: displayInfo } = useDisplayInfo();

  const [tourIndex, setTourIndex] = useState(0);

  const layout = useSelector(selectLayout);

  const [tourIsOpen, setTourIsOpen] = useState(false);

  const panelMetas =
    displayInfo?.metas.filter((meta: IMeta) => meta.type === META_TYPE_PANEL).map((meta) => meta.varname) || [];

  const dispatch = useDispatch();

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePanelChange = (value: string) => {
    dispatch(setLayout({ panel: value }));
  };

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
        zIndex: (mtheme) => mtheme.zIndex.drawer + 1,
        '&.MuiAppBar-root': {
          background: configObj?.theme?.header
            ? configObj.theme?.header?.background
            : configObj?.theme?.primary
            ? theme.palette.primary.main
            : '#fefefe',
        },
        color: configObj?.theme?.header
          ? configObj?.theme?.header?.text
          : configObj?.theme?.isLightTextOnDark
          ? configObj?.theme?.lightText
          : configObj?.theme?.darkText,
      }}
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
              primaryColor: theme.palette.primary.main || '#4489FF',
              zIndex: 9000,
            },
          }}
        />
        <div className={styles.header}>
          <div id="display-control" className={styles.headerDisplayInfo}>
            {configObj?.theme?.logo && <img src={configObj?.theme?.logo} alt="logo" height="40px" />}
            <DisplayInfo />
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
            {panelMetas.length > 1 && layout.viewtype !== 'table' && (
              <PanelPicker
                handlePanelChange={handlePanelChange}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                selectedValue={layout?.panel}
                useCustomStyles
              />
            )}
            {displayList.length > 1 && <DisplaySelect />}
            <Tooltip title="Launch Help Tour">
              <IconButton data-testid="tour-button" onClick={() => setTourIsOpen(true)}>
                <FontAwesomeIcon
                  color={
                    configObj?.theme?.header
                      ? configObj.theme?.header?.text
                      : configObj?.theme?.isLightTextOnDark
                      ? configObj?.theme?.lightText
                      : configObj?.theme?.darkText
                  }
                  icon={faHand}
                />
              </IconButton>
            </Tooltip>
            <div id="share-control">
              <Share />
            </div>
            {hasInputs && hasLocalStorage && (
              <div id="export-control">
                <ExportInputDialog
                  displayInfo={displayInfo as IDisplay}
                  hasInputs={hasInputs}
                  hasLocalStorage={hasLocalStorage}
                />
              </div>
            )}
            <Box
              sx={{
                background: theme.palette.primary.main,
                color: configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText,
              }}
              data-testid="app-title"
              className={styles.headerTrelliscope}
            >
              Trelliscope
              <HelpInfo />
              <Box
                sx={{ background: theme.palette.primary.light }}
                id="fullscreen-control"
                className={styles.headerTrelliscopeFullscreen}
              >
                <FullscreenButton />
              </Box>
            </Box>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

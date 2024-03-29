import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, useTheme, Box } from '@mui/material';
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
import { BACK, META_TYPE_PANEL } from '../../constants';
import { useConfig } from '../../slices/configAPI';
import PanelPicker from '../PanelPicker';
import ErrorWrapper from '../ErrorWrapper';
import Tour from '../Tour';

const Header: React.FC = () => {
  const { data: displayList = [] } = useDisplayList();
  const [hasInputs, setHasInputs] = useState(false);
  const theme = useTheme();
  const { data: configObj } = useConfig();
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const selectedDisplay = useSelectedDisplay();
  const { data: displayInfo } = useDisplayInfo();
  const layout = useSelector(selectLayout);
  const [curPanel, setCurPanel] = useState(layout?.panel || displayInfo?.primarypanel);
  const panelMetas =
    displayInfo?.metas.filter((meta: IMeta) => meta.type === META_TYPE_PANEL && meta.varname !== curPanel) || [];
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setCurPanel(layout?.panel || displayInfo?.primarypanel);
  }, [displayInfo?.primarypanel, layout?.panel]);

  const handlePanelChange = (value: string) => {
    dispatch(setLayout({ panel: value }));
  };

  useEffect(() => {
    if (displayInfo && displayInfo.inputs) {
      setHasInputs(true);
    }
    if (displayInfo?.inputs?.storageInterface?.type === 'localStorage') {
      setHasLocalStorage(true);
    }
  }, [displayInfo]);

  return (
    <ErrorWrapper>
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
                  sx={{
                    flexGrow: 1,
                    lineHeight: '1.25',
                    color: configObj?.theme?.header
                      ? configObj?.theme?.header?.text
                      : configObj?.theme?.isLightTextOnDark
                        ? configObj?.theme?.lightText
                        : configObj?.theme?.darkText || '#757575',
                  }}
                >
                  {selectedDisplay?.name}
                </Typography>
                {selectedDisplay?.description && selectedDisplay?.description !== selectedDisplay?.name && (
                  <Typography
                    variant="subtitle1"
                    noWrap
                    component="div"
                    sx={{
                      flexGrow: 1,
                      lineHeight: '1.25',
                      fontSize: '13px',
                      color: configObj?.theme?.header
                        ? configObj?.theme?.header?.text
                        : configObj?.theme?.isLightTextOnDark
                          ? configObj?.theme?.lightText
                          : configObj?.theme?.darkText || '#757575',
                    }}
                  >
                    {selectedDisplay?.description}
                  </Typography>
                )}
              </div>
            </div>
            <div className={styles.headerRight}>
              {panelMetas?.length > 0 && layout.viewtype !== 'table' && (
                <PanelPicker
                  handlePanelChange={handlePanelChange}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  selectedValue={layout?.panel}
                  useCustomStyles
                  isInHeader
                  panelMetas={panelMetas}
                />
              )}
              {displayList.length > 1 && (
                <div>
                  <DisplaySelect />
                </div>
              )}
              <Tour />
              <div id="share-control">
                <Share />
              </div>
              {hasInputs && hasLocalStorage && configObj && configObj.exportEnabled !== false && (
                <div id="export-control">
                  <ExportInputDialog
                    displayInfo={displayInfo as IDisplay}
                    hasInputs={hasInputs}
                    hasLocalStorage={hasLocalStorage}
                  />
                </div>
              )}
              {configObj && configObj.config1 !== BACK.OUTATIME ? (
                <Box
                  sx={{
                    paddingLeft: '22px',
                    marginLeft: '15px',
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
              ) : (
                <Box className={styles.headerTrelliscope}>
                  <Box sx={{ color: '#757575' }}>
                    <HelpInfo />
                  </Box>
                  <Box
                    sx={{ background: theme.palette.primary.light }}
                    id="fullscreen-control"
                    className={styles.headerTrelliscopeFullscreen}
                  >
                    <FullscreenButton />
                  </Box>
                </Box>
              )}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </ErrorWrapper>
  );
};

export default Header;

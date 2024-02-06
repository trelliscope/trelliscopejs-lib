import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Box, Checkbox, IconButton, Tooltip, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { fullscreenSelector } from '../../selectors';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { DataContext } from '../DataProvider';
import styles from './DisplayInfo.module.scss';
import { selectBasePath } from '../../selectors/app';
import { snakeCase } from '../../utils';
import { useConfig } from '../../slices/configAPI';

const DisplayInfo: React.FC = () => {
  const { allData } = useContext(DataContext);
  const { data: displayInfo, isLoading } = useDisplayInfo();
  const fullscreen = useSelector(fullscreenSelector);
  const basePath = useSelector(selectBasePath);
  const [hasInputs, setHasInputs] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: configObj } = useConfig();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (displayInfo && displayInfo.inputs) {
      setHasInputs(true);
    } else {
      setHasInputs(false);
    }
  }, [displayInfo]);

  const showInfoSkipped = localStorage.getItem(`trelliscope_info_${displayInfo?.name}`);

  const [showInfo, setShowInfo] = useState(showInfoSkipped === 'skipped');

  const handleShowInfoChange = (e: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
    if (value) {
      localStorage.setItem(`trelliscope_info_${displayInfo?.name}`, 'skipped');
      setShowInfo(true);
    } else {
      localStorage.removeItem(`trelliscope_info_${displayInfo?.name}`);
      setShowInfo(false);
    }
  };

  useEffect(() => {
    if (showInfoSkipped === 'skipped') {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [showInfoSkipped, displayInfo?.name]);

  useEffect(() => {
    if (displayInfo?.infoOnLoad && !showInfoSkipped) {
      setIsOpen(true);
    }
  }, [displayInfo?.infoOnLoad, displayInfo?.name]);

  useHotkeys('i', handleToggle, { enabled: fullscreen }, [isOpen]);
  useHotkeys('esc', () => setIsOpen(false), { enabled: isOpen });

  return (
    <div>
      <IconButton data-testid="display-info-button" onClick={handleToggle}>
        <div className={styles.displayInfoIcon}>
          <FontAwesomeIcon
            color={
              configObj?.theme?.header
                ? configObj?.theme?.header?.text
                : configObj?.theme?.isLightTextOnDark
                ? configObj?.theme?.lightText
                : configObj?.theme?.darkText
            }
            icon={faCircleInfo}
            size="sm"
          />
        </div>
      </IconButton>
      <Dialog
        open={isOpen}
        className="trelliscope-app"
        style={{ zIndex: 8000, fontWeight: 300 }}
        aria-labelledby="dialog-info-title"
        onClose={handleToggle}
        disableEscapeKeyDown
        maxWidth="lg"
        fullWidth
        data-testid="display-info-modal"
      >
        <DialogTitle id="dialog-info-title">
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>Information About This Display</Box>
            {displayInfo?.infoOnLoad && (
              <Tooltip
                arrow
                title="When this checkbox is unchecked, this modal will not appear when viewing this display again."
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox checked={showInfo} onChange={handleShowInfoChange} />
                  <Typography>Do not show on next load</Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <div className={styles.displayInfoModalContainer}>
            {displayInfo?.hasCustomInfo ? (
              <iframe
                key="customInfo"
                width="100%"
                height="100%"
                src={`${basePath}/displays/${snakeCase(displayInfo?.name || '')}/info.html`}
                title="customInfo"
              />
            ) : (
              <div>
                <div style={{ background: '#ededed', padding: 5 }}>
                  <strong>{displayInfo?.name}</strong>
                  <br />
                  {displayInfo?.description && <em>{displayInfo?.description}</em>}
                </div>
                <p>
                  {`This visualization contains ${allData?.length} "panels" that you can interactively view through various controls. Each panel has a set of variables or metrics, called "metas", that you can use to sort and filter the panels that you want to view.`}
                </p>
                <p>
                  To learn more about how to interact with this visualization, click the &ldquo;?&rdquo; icon in the top
                  right corner of the display.
                </p>
                {hasInputs && (
                  <p>
                    There are user input variables available in this visualization with which you can provide feedback for
                    any panel. These will show up as either a radio button or free text entry in the labels that show up
                    under each panel. As you enter inputs, these are saved in your local web browser&apos;s storage and will
                    be remembered in subsequent views of the display.
                  </p>
                )}
                {hasInputs && (
                  <p>
                    If you&apos;d like to pull the data that you have input, you can click the &ldquo;Export Inputs&rdquo;
                    icon at the top right of the display and follow the prompts in the dialog box that pops up.
                  </p>
                )}
              </div>
            )}

            {!isLoading && (
              <div
              // we can dangerously set because the HTML is generated from marked()
              // with pure markdown (sanitize = TRUE so user HTML is not supported)
              // These ignores are needed because marked is a 3rd party library that is having type issues.
              // Even after installing the type dependencies, the issue persists.
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore: TS2345
              // TODO fix this once data set is updated
              // dangerouslySetInnerHTML={{ __html: marked(curDisplayInfo.info.mdDesc, moptions) }} // eslint-disable-line react/no-danger
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button data-testid="display-info-button-close" aria-label="display info close" onClick={handleToggle}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DisplayInfo;

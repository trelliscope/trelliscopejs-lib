import React, { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Typography,
  Tooltip,
} from '@mui/material';
import { fullscreenSelector } from '../../selectors';
import HowToUse from '../HowToUse';
import Shortcuts from '../Shortcuts';
import Credits from '../Credits';
import styles from './HelpInfo.module.scss';
import { useConfig } from '../../slices/configAPI';

const HelpInfo: React.FC = () => {
  const fullscreen = useSelector(fullscreenSelector);
  const [tabNumber, setTabNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const { data: configObj } = useConfig();

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleChange = (event: SyntheticEvent, value: number) => {
    event.preventDefault();
    setTabNumber(value);
  };

  useHotkeys('h', handleToggle, { enabled: fullscreen }, [open]);
  useHotkeys('esc', () => setOpen(false), { enabled: open });

  return (
    <div className={styles.helpInfoIcon}>
      <IconButton data-testid="help-button" id="help-control" color="inherit" size="small" onClick={handleToggle}>
        <FontAwesomeIcon
          color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
          icon={faCircleQuestion}
          size="sm"
        />
      </IconButton>
      <Dialog
        open={open}
        className="trelliscope-app"
        style={{ zIndex: 8000, fontWeight: 300 }}
        aria-labelledby="dialog-viewer-title"
        onClose={handleToggle}
        maxWidth="md"
        data-testid="help-modal"
      >
        <DialogTitle
          id="dialog-viewer-title"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box>
            <div>{`Trelliscope v${process.env.REACT_APP_VERSION}`}</div>
            <div className={styles.helpInfoDialogWebsite}>
              Learn more at{' '}
              <a href="https://trelliscope.org" target="_blank" rel="noopener noreferrer">
                trelliscope.org
              </a>
            </div>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabNumber} onChange={handleChange}>
            <Tab data-testid="how-to-tab" label="How to Use" />
            <Tab data-testid="shortcuts-tab" label="Shortcuts" />
            <Tab data-testid="credits-tab" label="Credits" />
          </Tabs>
          {tabNumber === 0 && <HowToUse />}
          {tabNumber === 1 && <Shortcuts />}
          {tabNumber === 2 && <Credits />}
        </DialogContent>
        <DialogActions>
          <Button data-testid="help-button-close" onClick={handleToggle}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HelpInfo;

import React, { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tab, Tabs } from '@mui/material';
import { fullscreenSelector } from '../../selectors';
import HowToUse from '../HowToUse';
import Shortcuts from '../Shortcuts';
import Credits from '../Credits';
import styles from './HelpInfo.module.scss';

const HelpInfo: React.FC = () => {
  const fullscreen = useSelector(fullscreenSelector);
  const [tabNumber, setTabNumber] = useState(0);
  const [open, setOpen] = useState(false);

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
      <IconButton color="inherit" size="small" onClick={handleToggle}>
        <FontAwesomeIcon icon={faCircleQuestion} size="sm" />
      </IconButton>
      <Dialog
        open={open}
        className="trelliscope-app"
        style={{ zIndex: 8000, fontWeight: 300 }}
        aria-labelledby="dialog-viewer-title"
        onClose={handleToggle}
        maxWidth="md"
      >
        <DialogTitle id="dialog-viewer-title">
          <div>
            {`Trelliscope v${process.env.REACT_APP_VERSION}`}
          </div>
          <div className={styles.helpInfoDialogWebsite}>
            Learn more at <a href="https://trelliscope.org" target="_blank" rel="noopener noreferrer">trelliscope.org</a>
          </div>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabNumber} onChange={handleChange}>
            <Tab label="How to Use" />
            <Tab label="Shortcuts" />
            <Tab label="Credits" />
          </Tabs>
          {tabNumber === 0 && <HowToUse />}
          {tabNumber === 1 && <Shortcuts />}
          {tabNumber === 2 && <Credits />}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleToggle}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HelpInfo;

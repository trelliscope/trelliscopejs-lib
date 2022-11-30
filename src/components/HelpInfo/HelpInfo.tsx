import React, { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import { fullscreenSelector } from '../../selectors';
import HowToUse from '../HowToUse';
import Shortcuts from '../Shortcuts';
import Credits from '../Credits';
import styles from './HelpInfo.module.scss';

interface HelpInfoProps {
  setDialogOpen: (arg0: boolean) => void;
}

const HelpInfo: React.FC<HelpInfoProps> = ({ setDialogOpen }) => {
  const fullscreen = useSelector(fullscreenSelector);
  const [tabNumber, setTabNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
    setOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
    setOpen(true);
  };

  const handleChange = (event: SyntheticEvent, value: number) => {
    event.preventDefault();
    setTabNumber(value);
  };

  useHotkeys('h', handleOpen, { enabled: fullscreen });
  useHotkeys('esc', handleClose, { enabled: open });

  return (
    <div>
      <button type="button" onClick={handleOpen} className={styles.helpInfo}>
        Trelliscope
        <div className={styles.helpInfoIcon}>
          <FontAwesomeIcon icon={faCircleQuestion} />
        </div>
      </button>
      <Dialog
        open={open}
        className="trelliscope-app"
        style={{ zIndex: 8000, fontWeight: 300 }}
        aria-labelledby="dialog-viewer-title"
        onClose={handleClose}
      >
        <DialogTitle id="dialog-viewer-title">{`Trelliscope Viewer v${process.env.REACT_APP_VERSION}`}</DialogTitle>
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
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HelpInfo;

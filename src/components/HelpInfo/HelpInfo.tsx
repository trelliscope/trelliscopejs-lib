import React, { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fullscreenSelector } from '../../selectors';
import HowToUse from '../HowToUse';
import Shortcuts from '../Shortcuts';
import Credits from '../Credits';
import styles from './HelpInfo.module.scss';
import { useConfig } from '../../slices/configAPI';
import { BACK } from '../../constants';

const HelpInfo: React.FC = () => {
  const fullscreen = useSelector(fullscreenSelector);
  const [tabNumber, setTabNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const { data: configObj } = useConfig();
  const theme = useTheme();

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
    <Box
      sx={{
        marginTop: configObj && configObj.config1 !== BACK.OUTATIME ? '-9px' : '-2px',
        opacity: configObj && configObj.config1 !== BACK.OUTATIME ? 0.7 : 1,
      }}
      className={styles.helpInfoIcon}
    >
      <IconButton
        data-testid="help-button"
        id="help-control"
        sx={{ color: theme.palette.secondary.light }}
        size={configObj && configObj.config1 !== BACK.OUTATIME ? 'small' : 'medium'}
        onClick={handleToggle}
      >
        <FontAwesomeIcon icon={faCircleQuestion} />
      </IconButton>
      <Dialog
        PaperProps={{ sx: { backgroundColor: theme.palette.secondary.main } }}
        open={open}
        className="trelliscope-app"
        style={{ zIndex: 8000, fontWeight: 300 }}
        aria-labelledby="dialog-viewer-title"
        onClose={handleToggle}
        maxWidth="md"
        data-testid="help-modal"
      >
        {configObj && configObj.config1 !== BACK.OUTATIME && (
          <DialogTitle
            id="dialog-viewer-title"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box>
              <div>{`Trelliscope v${window.__VERSION__}`}</div>
              <Box
                sx={{
                  a: {
                    color: theme.palette.error.main,
                  },
                }}
                className={styles.helpInfoDialogWebsite}
              >
                Learn more at{' '}
                <a href="https://trelliscope.org" target="_blank" rel="noopener noreferrer">
                  trelliscope.org
                </a>
              </Box>
            </Box>
          </DialogTitle>
        )}
        <DialogContent>
          <Tabs textColor="primary" indicatorColor="primary" value={tabNumber} onChange={handleChange}>
            <Tab
              sx={{
                color: theme.palette.primary.contrastText,
              }}
              data-testid="how-to-tab"
              label="How to Use"
            />
            <Tab
              sx={{
                color: theme.palette.primary.contrastText,
              }}
              data-testid="shortcuts-tab"
              label="Shortcuts"
            />
            {configObj && configObj.config1 !== BACK.OUTATIME && (
              <Tab
                sx={{
                  color: theme.palette.primary.contrastText,
                }}
                data-testid="credits-tab"
                label="Credits"
              />
            )}
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
    </Box>
  );
};

export default HelpInfo;

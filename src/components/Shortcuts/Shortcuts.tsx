import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fullscreenSelector } from '../../selectors';
import styles from './Shortcuts.module.scss';

const Shortcuts: React.FC = () => {
  const fullscreen = useSelector(fullscreenSelector);
  const theme = useTheme();

  return (
    <div className={styles.shortcuts}>
      <div>
        {!fullscreen && (
          <Typography sx={{ fontStyle: 'italic', color: theme.palette.primary.contrastText, mt: 3 }}>
            Note: keyboard shortcuts are only available when the app is fullscreen.
          </Typography>
        )}
        <div className={styles.shortcutsDiv}>
          <h4 className={styles.shortcutsH4}>Panel navigation</h4>
          <ul className={styles.shortcutsUl}>
            <li>
              <Typography sx={{ display: 'inline-block', color: theme.palette.error.main }} variant="h6">
                left
              </Typography>
              &ensp;page back
            </li>
            <li>
              <Typography sx={{ display: 'inline-block', color: theme.palette.error.main }} variant="h6">
                right
              </Typography>
              &ensp;page forward
            </li>
          </ul>
        </div>
        <div className={styles.shortcutsDiv}>
          <h4 className={styles.shortcutsH4}>Dialog boxes</h4>
          <ul className={styles.shortcutsUl}>
            <li>
              <Typography sx={{ display: 'inline-block', color: theme.palette.error.main }} variant="h6">
                i
              </Typography>
              &ensp;open &quot;Display Info&quot; dialog
            </li>
            <li>
              <Typography sx={{ display: 'inline-block', color: theme.palette.error.main }} variant="h6">
                h
              </Typography>
              &ensp;open &quot;Help/About&quot; dialog
            </li>
            <li>
              <Typography sx={{ display: 'inline-block', color: theme.palette.error.main }} variant="h6">
                esc
              </Typography>
              &ensp;close dialog
            </li>
          </ul>
          <h4 className={styles.shortcutsH4}>Touchscreen devices</h4>
          <p className={styles.shortcutsUl}>Swiping left and right will page the panels forward and backward</p>
        </div>
      </div>
    </div>
  );
};

export default Shortcuts;

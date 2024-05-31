import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from './Credits.module.scss';

const Credits: React.FC = () => {
  const theme = useTheme();
  return (
    <div className={styles.credits}>
      <Box
        sx={{
          mb: 2,
          a: {
            color: theme.palette.error.main,
          },
        }}
      >
        &copy;&nbsp;
        <a href="http://ryanhafen.com" target="_blank" rel="noopener noreferrer">
          Ryan Hafen
        </a>
        , 2023.
      </Box>
      <Box
        sx={{
          mb: 2,
          a: {
            color: theme.palette.error.main,
          },
        }}
      >
        Built with&nbsp;
        <a href="https://facebook.github.io/react/" target="_blank" rel="noopener noreferrer">
          React
        </a>
        &nbsp;and several other awesome libraries listed&nbsp;
        <a
          href="https://github.com/trelliscope/trelliscopejs-lib/blob/master/package.json"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </Box>
      <Box
        sx={{
          mb: 2,
          a: {
            color: theme.palette.error.main,
          },
        }}
      >
        Source code available on&nbsp;
        <a href="https://github.com/trelliscope/trelliscopejs-lib/" target="_blank" rel="noopener noreferrer">
          github
        </a>
        &nbsp;&ndash; submit issues and feature requests there.
      </Box>
      <Box
        sx={{
          // display: 'inline-block',
          a: {
            color: theme.palette.error.main,
          },
        }}
      >
        Many thanks to the Trelliscope{' '}
        <a
          href="https://github.com/trelliscope/trelliscopejs-lib/graphs/contributors"
          target="_blank"
          rel="noopener noreferrer"
        >
          contributors
        </a>{' '}
        and{' '}
        <a href="https://github.com/trelliscope/trelliscope#acknowledgements" target="_blank" rel="noopener noreferrer">
          funders
        </a>
        .
      </Box>
    </div>
  );
};

export default Credits;

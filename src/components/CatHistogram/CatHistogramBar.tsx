import React from 'react';
import classNames from 'classnames';
import { useTheme, lighten, darken } from '@mui/material/styles';
import { Box } from '@mui/material';
import { getLabelFromFactor } from '../../utils';

import styles from './CatHistogram.module.scss';
import { MISSING_TEXT, META_TYPE_FACTOR } from '../../constants';

interface CatHistogramBarProps {
  width: number;
  height: number;
  label: string;
  value: string | number;
  active: boolean;
  style: object;
  onClick: (key: string) => void;
  metaLevels: string[];
  metaType: string;
}

const CatHistogramBar: React.FC<CatHistogramBarProps> = ({
  active,
  style,
  onClick,
  width,
  height,
  label,
  value,
  metaLevels,
  metaType,
}) => {
  const theme = useTheme();
  const handleClick = () => {
    if (label === MISSING_TEXT && metaType === META_TYPE_FACTOR) {
      return onClick(-Infinity as unknown as string);
    }
    return onClick(label);
  };

  const styleObj = {
    ...style,
    color: active ? theme.palette.text.primary : theme.palette.primary.contrastText,
    '&:hover': {
      background: lighten(theme.palette.secondary.light, 0.5),
    },
  };

  return (
    <Box className={styles.catHistogramBarWrapper} sx={styleObj} role="presentation" onClick={handleClick}>
      <Box
        className={styles.catHistogramBar}
        sx={{
          width,
          height,
          background: active ? theme.palette.secondary.contrastText : darken(theme.palette.secondary.dark, 0.15),
          '&:hover': {
            background: lighten(theme.palette.secondary.contrastText, 0.25),
            color: theme.palette.text.primary,
          },
        }}
      >
        <div className={styles.catHistogramBarLabel}>
          {label === MISSING_TEXT
            ? MISSING_TEXT
            : !metaLevels
              ? label
              : getLabelFromFactor(label as unknown as number, metaLevels)}
        </div>
      </Box>
      <div style={{ color: theme.palette.text.primary }} className={styles.catHistogramBarValue}>
        {value}
      </div>
      {active && <div style={{ background: theme.palette.primary.main }} className={styles.catHistogramBarIndicator} />}
    </Box>
  );
};

export default CatHistogramBar;

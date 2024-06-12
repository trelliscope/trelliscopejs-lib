import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from './PanelLabels.module.scss';

interface PanelLabelsCellProps {
  value: string | number | null;
  label: string | null;
  padding: number | null;
}

const PanelLabelsCell: React.FC<PanelLabelsCellProps> = ({ value, label, padding }) => {
  const theme = useTheme();
  return (
    <td
      style={{ padding: `${padding}px`, borderRight: `1px solid ${theme.palette.secondary.dark}` }}
      className={styles.panelLabelsCell}
    >
      {label ? (
        <Tooltip title={label} placement="left" arrow>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <span>{value}</span>
          </Box>
        </Tooltip>
      ) : (
        <span>{value}</span>
      )}
    </td>
  );
};

export default PanelLabelsCell;

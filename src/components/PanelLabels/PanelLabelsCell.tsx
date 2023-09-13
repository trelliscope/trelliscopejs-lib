import { Box, Tooltip } from '@mui/material';
import React from 'react';
import styles from './PanelLabels.module.scss';

interface PanelLabelsCellProps {
  value: string | number | null;
  label: string | null;
  padding: number | null;
}

const PanelLabelsCell: React.FC<PanelLabelsCellProps> = ({ value, label, padding }) => (
  <td style={{ padding: `${padding}px` }} className={styles.panelLabelsCell}>
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

export default PanelLabelsCell;

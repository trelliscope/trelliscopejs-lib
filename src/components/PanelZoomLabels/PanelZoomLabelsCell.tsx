import { Box, Tooltip } from '@mui/material';
import React from 'react';
import styles from './PanelZoomLabels.module.scss';

interface PanelZoomLabelsCellProps {
  value: string | number | null;
  label: string | null;
}

const PanelZoomLabelsCell: React.FC<PanelZoomLabelsCellProps> = ({ value, label }) => (
  <td style={{ padding: value !== label ? '0 12px' : '8.5px 12px' }} className={styles.panelZoomLabelsCell}>
    {label ? (
      <Tooltip title={label} placement="left" arrow>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span>{value}</span>
          {label !== value && <span className={styles.panelZoomLabelsLabel}>{label}</span>}
        </Box>
      </Tooltip>
    ) : (
      <span>{value}</span>
    )}
  </td>
);

export default PanelZoomLabelsCell;

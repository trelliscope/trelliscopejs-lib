import { Box, Tooltip } from '@mui/material';
import React from 'react';
import styles from './PanelTable.module.scss';

interface PanelTableLabelCellProps {
  value: string | number | null;
  label: string | null;
  compact?: boolean;
}

const PanelTableLabelCell: React.FC<PanelTableLabelCellProps> = ({ value, label, compact }) => (
  <td
    style={{ padding: !compact && value !== label ? '0 12px' : !compact ? '12px' : '6px' }}
    className={styles.panelTableCell}
  >
    {label ? (
      <Tooltip title={label} placement="left" arrow>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span>{value}</span>
          {!compact && label !== value && <span className={styles.panelTableCompactLabel}>{label}</span>}
        </Box>
      </Tooltip>
    ) : (
      <span>{value}</span>
    )}
  </td>
);

PanelTableLabelCell.defaultProps = {
  compact: false,
};

export default PanelTableLabelCell;

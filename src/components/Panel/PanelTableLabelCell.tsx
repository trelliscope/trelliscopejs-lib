import { Tooltip } from '@mui/material';
import React from 'react';
import styles from './Panel.module.scss';

interface PanelTableLabelCellProps {
  value: string | number | null;
  label: string | null;
}

const PanelTableLabelCell: React.FC<PanelTableLabelCellProps> = ({ value, label }) => (
  <td className={styles.panelLabelCell}>
    {label ? (
      <Tooltip title={label} placement="left" arrow>
        <span>{value}</span>
      </Tooltip>
    ) : (
      <span>{value}</span>
    )}
  </td>
);

export default PanelTableLabelCell;

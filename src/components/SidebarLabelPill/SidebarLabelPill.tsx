import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import styles from './SidebarLabelPill.module.scss';

interface SidebarLabelsProps {
  labels: string[];
  cogInfo: {
    [key: string]: CogInfo;
  };
  d: string;
  handleLabelChange: (value: string) => void;
}

const SidebarLabels: React.FC<SidebarLabelsProps> = ({
  labels,
  cogInfo,
  d,
  handleLabelChange,
}) => (
  <ListItem key={cogInfo[d].name} dense button onClick={() => handleLabelChange(cogInfo[d].name)}>
    <Checkbox
      checked={labels.indexOf(cogInfo[d].name) !== -1}
      className={styles.sidebarLabelsListCheckbox}
      tabIndex={-1}
      disableRipple
    />
    <ListItemText primary={cogInfo[d].name} secondary={cogInfo[d].desc} className={styles.sidebarLabelsListItem} />
  </ListItem>
);

export default SidebarLabels;

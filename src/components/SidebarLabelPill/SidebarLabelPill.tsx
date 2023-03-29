import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import styles from './SidebarLabelPill.module.scss';

interface SidebarLabelsProps {
  labels: string[];
  labelDescriptionMap: Map<string, string>;
  label: string;
  handleLabelChange: (value: string) => void;
}

const SidebarLabels: React.FC<SidebarLabelsProps> = ({ labels, labelDescriptionMap, label, handleLabelChange }) => {
  const description = labelDescriptionMap.get(label);
  return (
    <ListItem key={label} dense button onClick={() => handleLabelChange(label)}>
      <Checkbox
        checked={labels.indexOf(label) !== -1}
        className={styles.sidebarLabelsListCheckbox}
        tabIndex={-1}
        disableRipple
      />
      <ListItemText primary={label} secondary={description} className={styles.sidebarLabelsListItem} />
    </ListItem>
  );
};

export default SidebarLabels;

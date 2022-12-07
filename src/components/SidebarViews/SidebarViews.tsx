import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import styles from './SidebarViews.module.scss';

interface SidebarViewsProps {
  handleViewsChange: (value: string) => void;
  height: number;
  views: ViewItem[];
}

const SidebarViews: React.FC<SidebarViewsProps> = ({ handleViewsChange, height, views }) => (
  <div className={styles.sidebarViews} style={{ height }}>
    <List className={styles.sidebarViewsList}>
      {views.map((value) => (
        <ListItem key={value.name} dense button onClick={() => handleViewsChange(value.state)}>
          <ListItemText primary={value.name} />
        </ListItem>
      ))}
    </List>
  </div>
);

export default SidebarViews;

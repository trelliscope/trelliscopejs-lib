// ignore all ts errors in this file
// FIXME remove this once refactor is done with new architecture
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import styles from './SidebarViews.module.scss';

interface SidebarViewsProps {
  handleViewsChange: (value: string) => void;
  height: number;
  views: IView[];
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

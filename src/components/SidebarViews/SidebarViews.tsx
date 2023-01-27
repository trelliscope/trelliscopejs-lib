import React from 'react';
import { useDispatch } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import { setSort } from '../../slices/sortSlice';
import { addFilter, clearFilters } from '../../slices/filterSlice';
import type { LayoutAction } from '../../slices/layoutSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import styles from './SidebarViews.module.scss';

const SidebarViews: React.FC = () => {
  const dispatch = useDispatch();
  const { data } = useDisplayInfo();
  const views = data?.views as IView[];
  const handleChange = (value: IDisplayState) => {
    const { filter: valueFilter, labels: valueLabels, layout: valueLayout, sort: valueSort } = value;

    if (valueLayout) {
      dispatch(setLayout(valueLayout as LayoutAction));
    }

    if (valueLabels) {
      dispatch(setLabels(valueLabels.varnames));
    }

    if (valueSort) {
      dispatch(setSort(valueSort));
    }

    if (valueFilter) {
      dispatch(clearFilters());
      valueFilter.map((filter) => dispatch(addFilter(filter)));
    }
  };

  return (
    <div className={styles.sidebarViews}>
      <List className={styles.sidebarViewsList}>
        {views.map((value) => (
          <ListItem key={value.name} dense button onClick={() => handleChange(value.state)}>
            <ListItemText primary={value.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SidebarViews;

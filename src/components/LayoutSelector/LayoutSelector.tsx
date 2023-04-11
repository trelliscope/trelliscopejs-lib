import React, { useEffect, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, ListItemIcon, ListItemText, MenuItem, Select } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import styles from './LayoutSelector.module.scss';

const LayoutSelector: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector(selectLayout);
  const [viewLayout, setViewLayout] = useState(layout?.viewtype || '');

  useEffect(() => {
    setViewLayout(layout?.viewtype || '');
  }, [layout.viewtype]);

  const handleLayoutChange = (e: SelectChangeEvent<string>) => {
    setViewLayout(e.target.value as viewtype);
    dispatch(setLayout({ viewtype: e.target.value as viewtype }));
  };

  return (
    <div className={styles.layoutSelector}>
      <span className={styles.layoutSelectorText}>Layout</span>
      <FormControl size="small">
        <Select
          labelId="layout-label"
          id="layout"
          value={viewLayout}
          displayEmpty
          onChange={handleLayoutChange}
          renderValue={(value) =>
            value === 'grid' ? <FontAwesomeIcon icon={faTableCellsLarge} /> : <FontAwesomeIcon icon={faTableList} />
          }
        >
          <MenuItem value="grid">
            <ListItemIcon>
              <FontAwesomeIcon icon={faTableCellsLarge} />
            </ListItemIcon>
            <ListItemText>Grid</ListItemText>
          </MenuItem>
          <MenuItem value="table">
            <ListItemIcon>
              <FontAwesomeIcon icon={faTableList} />
            </ListItemIcon>
            <ListItemText>Table</ListItemText>
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default LayoutSelector;

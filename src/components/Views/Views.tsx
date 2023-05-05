import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Menu, MenuItem } from '@mui/material';
import styles from './Views.module.scss';
import { setLabels } from '../../slices/labelsSlice';
import { clearFilters, addFilter } from '../../slices/filterSlice';
import { setLayout, LayoutAction } from '../../slices/layoutSlice';
import { setSort } from '../../slices/sortSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';

const Views: React.FC = () => {
  const dispatch = useDispatch();
  const { data } = useDisplayInfo();
  const views = data?.views as IView[];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (value: IDisplayState) => {
    const { filter: valueFilter, labels: valueLabels, layout: valueLayout, sort: valueSort } = value;

    if (valueLayout) dispatch(setLayout(valueLayout as LayoutAction));

    if (valueLabels) dispatch(setLabels(valueLabels.varnames));

    if (valueSort) dispatch(setSort(valueSort));

    if (valueFilter) {
      dispatch(clearFilters());
      valueFilter.map((filter) => dispatch(addFilter(filter)));
    }
    setAnchorEl(null);
  };

  return (
    <div className={styles.views}>
      <div>
        <Button
          sx={{ textTransform: 'capitalize', color: '#000' }}
          id="views-button"
          aria-controls={open ? 'views-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />}
        >
          Views
        </Button>
        <Menu id="views-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{}}>
          {views?.map((value) => (
            <MenuItem key={value.name} onClick={() => handleViewChange(value.state)}>
              {value.name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default Views;

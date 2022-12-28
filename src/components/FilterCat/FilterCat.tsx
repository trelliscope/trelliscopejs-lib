// click on a bar selects it
// multiple bars can be selected with additional clicks
// click on a selected bar deselects it
// regex overrides manual selections
// if selections are made after regex, regex is cleared
import React, { useEffect, useState } from 'react';
import type { SetStateAction } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import FilterCatPlot from '../FilterCatPlot';

import styles from './FilterCat.module.scss';

interface FilterCatProps {
  filterState: ICategoryFilterState;
  dist: FilterCatDist;
  condDist: CondDistFilterCat;
  levels: string[];
  height: number;
  handleChange: (state: ICategoryFilterState) => void;
  handleSortChange: (state: ICategoryFilterState) => void;
}

const FilterCat: React.FC<FilterCatProps> = ({
  filterState,
  dist,
  condDist,
  levels,
  height,
  handleChange,
  handleSortChange,
}) => {
  const [sortOrder, setSortOrder] = useState(filterState.orderValue ? filterState.orderValue : 'ct,desc');
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const mutableFilterState = { ...filterState };

  const sortOptions = [
    { payload: 'ct,asc', text: 'Order: count ascending' },
    { payload: 'ct,desc', text: 'Order: count descending' },
    { payload: 'id,asc', text: 'Order: label ascending' },
    { payload: 'id,desc', text: 'Order: label descending' },
  ];

  useEffect(() => {
    setSortOrder(mutableFilterState.orderValue ? mutableFilterState.orderValue : 'ct,desc');
  }, [mutableFilterState.orderValue, filterState]);

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleMenuIconClick = (event: { currentTarget: SetStateAction<null> }) => {
    setMenuOpen(!menuOpen);
    setAnchorEl(menuOpen ? null : event.currentTarget);
  };

  const handleRegex = (val: string) => {
    let newState = {} as ICategoryFilterState;
    if (val === '') {
      newState = {
        name: mutableFilterState.name,
        varType: mutableFilterState.varType,
        orderValue: sortOrder,
      };
    } else {
      const vals = [] as string[];
      const rval = new RegExp(val, 'i');
      levels.forEach((d) => {
        if (d.match(rval) !== null) {
          vals.push(d);
        }
      });
      newState = {
        name: mutableFilterState.name,
        type: 'regex',
        varType: mutableFilterState.varType,
        regex: val,
        value: vals,
        orderValue: sortOrder,
      };
    }
    handleChange(newState);
  };

  const regexInput = {
    width: 190,
    marginTop: -8,
    fontSize: 16,
    transform: 'scale(0.85)',
    transformOrigin: '0 0',
  };

  return (
    <div className={styles.filterCatContainer}>
      <div className={styles.filterCatPlotContainer}>
        <FilterCatPlot
          height={height}
          width={220}
          cellHeight={15}
          dist={dist}
          condDist={condDist}
          filterState={mutableFilterState}
          handleChange={handleChange}
          sortOrder={sortOrder}
        />
      </div>
      <div className={styles.filterCatInputContainer}>
        <TextField
          placeholder="regex"
          style={regexInput}
          value={mutableFilterState.type === 'regex' ? mutableFilterState.regex : ''}
          onChange={(e) => handleRegex(e.target.value)}
          variant="standard"
        />
        <div className={styles.filterCatExtraOptionsInput}>
          {/* this is an issue with the iconButton in materialUi not having the type for an onClick in the props
          // @ts-ignore */}
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleMenuIconClick}
            sx={{ width: 25, height: 25 }}
          >
            <FontAwesomeIcon icon={faEllipsisV} size="xs" />
          </IconButton>
          <Menu id="long-menu" open={menuOpen} anchorEl={anchorEl} onClose={handleMenuClose}>
            {sortOptions.map((d) => (
              <MenuItem
                key={d.payload}
                selected={d.payload === mutableFilterState.orderValue}
                onClick={() => {
                  handleSortChange(Object.assign(mutableFilterState, { orderValue: d.payload }));
                  handleMenuClose();
                }}
              >
                {d.text}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default FilterCat;

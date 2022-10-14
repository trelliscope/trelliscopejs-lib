// click on a bar selects it
// multiple bars can be selected with additional clicks
// click on a selected bar deselects it
// regex overrides manual selections
// if selections are made after regex, regex is cleared
import React, { useEffect, useState } from 'react';
import type { SetStateAction } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FilterCatPlot from '../FilterCatPlot';

import styles from './FilterCat.module.scss';

interface FilterCatProps {
  filterState: Filter<FilterCat>;
  dist: FilterCatDist;
  condDist: CondDistFilterCat;
  levels: string[];
  height: number;
  handleChange: (state: Filter<FilterCat>) => void;
  handleSortChange: (state: Filter<FilterCat>) => void;
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

  const sortOptions = [
    { payload: 'ct,asc', text: 'Order: count ascending' },
    { payload: 'ct,desc', text: 'Order: count descending' },
    { payload: 'id,asc', text: 'Order: label ascending' },
    { payload: 'id,desc', text: 'Order: label descending' },
  ];

  useEffect(() => {
    setSortOrder(filterState.orderValue ? filterState.orderValue : 'ct,desc');
  }, [filterState.orderValue]);

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleMenuIconClick = (event: { currentTarget: SetStateAction<null> }) => {
    setMenuOpen(!menuOpen);
    setAnchorEl(menuOpen ? null : event.currentTarget);
  };

  const handleRegex = (val: string) => {
    let newState = {} as Filter<FilterCat>;
    if (val === '') {
      newState = {
        name: filterState.name,
        varType: filterState.varType,
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
        name: filterState.name,
        type: 'regex',
        varType: filterState.varType,
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
          filterState={filterState}
          handleChange={handleChange}
          sortOrder={sortOrder}
        />
      </div>
      <div className={styles.filterCatInputContainer}>
        <TextField
          placeholder="regex"
          style={regexInput}
          value={filterState.type === 'regex' ? filterState.regex : ''}
          onChange={(e) => handleRegex(e.target.value)}
        />
        <div className={styles.filterCatExtraOptionsInput}>
          {/* this is an issue with the iconButton in materialUi not having the type for an onClick in the props
          // @ts-ignore */}
          <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleMenuIconClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu id="long-menu" open={menuOpen} anchorEl={anchorEl} onClose={handleMenuClose}>
            {sortOptions.map((d) => (
              <MenuItem
                key={d.payload}
                selected={d.payload === filterState.orderValue}
                onClick={() => {
                  handleSortChange(Object.assign(filterState, { orderValue: d.payload }));
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

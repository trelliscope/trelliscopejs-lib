import React, { useContext, useEffect, useState } from 'react';
import type { SetStateAction } from 'react';
import { TextField, IconButton, Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { FILTER_TYPE_CATEGORY } from '../../../../constants';
import useMetaInfo from '../../../../selectors/useMetaInfo';
import { updateFilterValues, addFilter, updateFilter, removeFilter } from '../../../../slices/filterSlice';
import CatHistogram from '../../../CatHistogram';
import { DataContext } from '../../../DataProvider';

import styles from './FilterCat.module.scss';
import { useDisplayMetas } from '../../../../slices/displayInfoAPI';

interface FilterCatProps {
  meta: IFactorMeta;
  filter?: ICategoryFilterState;
}

const FilterCat: React.FC<FilterCatProps> = ({ meta, filter }) => {
  const { domain = [0, 0], dist = {} } = useMetaInfo(meta.varname, meta.type);
  const displayMetas = useDisplayMetas();
  const curDisplayMeta = displayMetas.find((d) => d.varname === meta.varname);
  const { filterSortOrder } = curDisplayMeta as IMeta;
  const { groupBy } = useContext(DataContext);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const defaultSort = filterSortOrder || 'ct,desc';
  const [curSort, setCurSort] = useState(defaultSort);

  const sortChartData = (sortOrder: string, data: { key: string | number; value: number }[]) => {
    const [sortKey, sortDir] = sortOrder.split(',');
    return data.sort((a, b) => {
      if (sortKey === 'ct') {
        return sortDir === 'asc' ? a.value - b.value : b.value - a.value;
      }
      return sortDir === 'asc'
        ? (a.key as string).localeCompare(b.key as string)
        : (b.key as string).localeCompare(a.key as string);
    });
  };

  const [sortedData, setSortedData] = useState(() => {
    if (meta) {
      return defaultSort ? sortChartData(defaultSort, groupBy(meta.varname)) : groupBy(meta.varname);
    }
    return [];
  });

  const sortOptions = [
    { payload: 'ct,asc', text: 'Order: count ascending' },
    { payload: 'ct,desc', text: 'Order: count descending' },
    { payload: 'id,asc', text: 'Order: label ascending' },
    { payload: 'id,desc', text: 'Order: label descending' },
  ];

  const handleSortChange = (sortOrder: string) => {
    setCurSort((sortOrder as IMeta['filterSortOrder']) || defaultSort);
    const sorted = sortChartData(sortOrder, groupBy(meta.varname));
    setSortedData(sorted);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleMenuIconClick = (event: { currentTarget: SetStateAction<null> }) => {
    setMenuOpen(!menuOpen);
    setAnchorEl(menuOpen ? null : event.currentTarget);
  };

  const handleBarClick = (value: string) => {
    if (filter) {
      dispatch(updateFilterValues({ varname: filter.varname, value }));
    } else {
      const newFilter = {
        type: 'filter',
        varname: meta.varname,
        filtertype: FILTER_TYPE_CATEGORY,
        regexp: null,
        values: [value],
      } as ICategoryFilterState;
      dispatch(addFilter(newFilter));
    }
  };

  useEffect(() => {
    if (filter && filter.values.length === 0 && filter.regexp === null) {
      dispatch(removeFilter(filter.varname));
    }
  }, [dispatch, filter]);

  const handleRegex = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;

    if (value) {
      const regexp = new RegExp(value, 'i');
      const filteredValues = meta.levels
        ? meta.levels.filter((level) => level.match(regexp))
        : groupBy(meta.varname)
            .filter((level) => (level.key as string).match(regexp))
            .map((level) => level.key);

      const newFilter = {
        type: 'filter',
        varname: meta.varname,
        filtertype: FILTER_TYPE_CATEGORY,
        regexp: value,
        values: filteredValues,
      } as ICategoryFilterState;

      dispatch(filter ? updateFilter(newFilter) : addFilter(newFilter));
    } else if (filter) {
      dispatch(removeFilter(filter.varname));
    }
  };

  return (
    <div className={styles.filterCat}>
      <div className={styles.filterCatChart}>
        <CatHistogram
          data={sortedData.length > 0 ? sortedData : sortChartData(defaultSort, groupBy(meta.varname))}
          allData={dist}
          domain={domain}
          actives={filter?.values || []}
          count={meta.levels?.length || groupBy(meta.varname).length}
          width={220}
          height={75}
          barHeight={15}
          onClick={handleBarClick}
        />
      </div>
      <div className={styles.filterCatInputContainer}>
        <div>
          <TextField
            placeholder="regex"
            classes={{ root: styles.filterCatRegex }}
            value={filter?.regexp || ''}
            onChange={handleRegex}
            variant="standard"
          />
        </div>
        <div>
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
                selected={d.payload === curSort}
                onClick={() => {
                  handleSortChange(d.payload);
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

FilterCat.defaultProps = {
  filter: undefined,
};

export default FilterCat;

import React, { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { clearFilters, setFilterView, setFiltersandFilterViews } from '../../slices/filterSlice';
import { setSort } from '../../slices/sortSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import type { LayoutAction } from '../../slices/layoutSlice';
import { setSelectedDisplay, useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import { useDisplayList } from '../../slices/displayListAPI';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import styles from './DisplaySelect.module.scss';

const DisplaySelect: React.FC = () => {
  const dispatch = useDispatch();
  const { name: selectedDisplay } = useSelectedDisplay();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [selectedDisplayName, setSelectedDisplayName] = useState('');
  const { data: displayList } = useDisplayList();
  const { data: displayInfo } = useDisplayInfo();
  const [isOpen, setIsOpen] = useState(false);

  const stateLayout = displayInfo?.state?.layout;
  const stateLabels = displayInfo?.state?.labels?.varnames;
  const stateSort = displayInfo?.state?.sort;
  const stateFilters = displayInfo?.state?.filter;
  const activeDisplayName = displayInfo?.name;

  // This is needed to make sure the default state is applied when switching to a new display
  useEffect(() => {
    if (selectedDisplayName === activeDisplayName) {
      dispatch(setLayout({ ...(stateLayout as LayoutAction), panel: '' }));
      dispatch(setLabels(stateLabels as string[]));
      dispatch(setFiltersandFilterViews(stateFilters as IFilterState[]));
      dispatch(setSort(stateSort as number | ISortState[]));
    }
  }, [stateLabels, stateLayout, dispatch, selectedDisplayName, activeDisplayName]);

  const handleClose = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  const handleOpen = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleClick = (name: string) => {
    // need to clear out state for new display...
    dispatch(setFilterView({ name: '', which: 'removeActive' }));
    dispatch(clearFilters());
    dispatch(setSort([]));
    dispatch(setRelDispPositions([]));
    dispatch(setSelectedDisplay(name));
    dispatch(setLayout({ page: 1, sidebarActive: false, viewtype: 'grid' }));
    setSelectedDisplayName(name);
  };

  const handleSelect = (name: string) => {
    handleClick(name);
    handleClose();
  };

  return (
    <div>
      <IconButton
        id="display-select-button"
        aria-controls={isOpen ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={handleOpen}
        size="large"
      >
        <FontAwesomeIcon className={styles.displaySelectIcon} icon={isOpen ? faChevronUp : faChevronDown} size="xs" />
      </IconButton>
      <Menu
        id="display-select-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'display-select-button',
        }}
      >
        <div
          style={{
            fontWeight: 600,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 5,
          }}
        >
          Select a different display
        </div>
        {displayList
          ?.filter((display) => display.name !== selectedDisplay)
          .map((d) => (
            <MenuItem key={d.name} onClick={() => handleSelect(d.name)}>
              <div>
                <div>{d.name}</div>
                <div style={{ fontStyle: 'italic', fontSize: 14 }}>{d.description}</div>
              </div>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default DisplaySelect;

import React, { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { setDispSelectDialogOpen } from '../../slices/appSlice';
import { FilterState, clearFilters, setFilterView } from '../../slices/filterSlice';
import { setSort } from '../../slices/sortSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import type { LayoutAction } from '../../slices/layoutSlice';
import { setActiveSidebar } from '../../slices/sidebarSlice';
import { dispSelectDialogSelector } from '../../selectors';
import { setSelectedDisplay, useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import { setSelectedRelDisps } from '../../slices/selectedRelDispsSlice';
import { useDisplayList } from '../../slices/displayListAPI';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import styles from './DisplaySelect.module.scss';

interface DisplaySelectProps {
  setDialogOpen: (isOpen: boolean) => void;
}

const DisplaySelect: React.FC<DisplaySelectProps> = ({ setDialogOpen }) => {
  const dispatch = useDispatch();
  const { name: selectedDisplay } = useSelectedDisplay();
  const isOpen = useSelector(dispSelectDialogSelector);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [selectedDisplayName, setSelectedDisplayName] = useState('');
  const { data: displayList, isSuccess } = useDisplayList();
  const { data: displayInfo } = useDisplayInfo();

  const stateLayout = displayInfo?.state?.layout;
  const stateLabels = displayInfo?.state?.labels?.varnames;
  const activeDisplayName = displayInfo?.name;

  // This is needed to make sure the default state is applied when switching to a new display
  useEffect(() => {
    if (selectedDisplayName === activeDisplayName) {
      dispatch(setLayout(stateLayout as LayoutAction));
      dispatch(setLabels(stateLabels as string[]));
    }
  }, [stateLabels, stateLayout, dispatch, selectedDisplayName, activeDisplayName]);

  const handleDispDialogOpen = (dispIsOpen: boolean) => {
    dispatch(setDispSelectDialogOpen(dispIsOpen));
  };

  const handleClose = () => {
    setDialogOpen(false);
    handleDispDialogOpen(false);
    setAnchorEl(null);
  };

  const handleOpen = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
    if (displayList && isSuccess) {
      setDialogOpen(true);
      handleDispDialogOpen(true);
    }
  };

  const handleClick = (name: string) => {
    // need to clear out state for new display...
    // first close sidebars for safety
    // (there is an issue when the filter sidebar stays open when changing - revisit this)
    dispatch(setActiveSidebar(''));
    dispatch(setSelectedRelDisps([]));
    dispatch(setFilterView({ name: { active: [], inactive: [] } as FilterState['view'] }));
    dispatch(clearFilters());
    dispatch(setSort([]));
    dispatch(setRelDispPositions([]));
    dispatch(setSelectedDisplay(name));
    dispatch(setLayout({ page: 1 }));
    setSelectedDisplayName(name);
  };

  const handleSelect = (name: string) => {
    handleClick(name);
    setDialogOpen(false);
    handleDispDialogOpen(false);
  };
  // TODO do we still want hotkeys here?

  // const handleKey = (event) => {
  //   setDialogOpen(true);
  //   handleDispDialogOpen(true);
  // };

  // useHotkeys('o', handleKey, { enabled: fullscreen && !isOpen });
  // useHotkeys('o', handleClose, { enabled: fullscreen && isOpen });
  // useHotkeys('esc', handleClose, { enabled: isOpen });

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
        <FontAwesomeIcon className={styles.displaySelectIcon} icon={faChevronDown} size="xs" />
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

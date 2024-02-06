import React, { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { clearFilters, selectFilterState, setFilterView, setFiltersandFilterViews } from '../../slices/filterSlice';
import { selectSort, setSort } from '../../slices/sortSlice';
import { selectLabels, setLabels } from '../../slices/labelsSlice';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import type { LayoutAction } from '../../slices/layoutSlice';
import { setSelectedDisplay, useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import { useDisplayList } from '../../slices/displayListAPI';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { useStoredInputValue, getLocalStorageKey } from '../../inputUtils';
import { filterViewSelector } from '../../selectors';
import { useConfig } from '../../slices/configAPI';
// import styles from './DisplaySelect.module.scss';
import ErrorWrapper from '../ErrorWrapper';

const DisplaySelect: React.FC = () => {
  const dispatch = useDispatch();
  const { name: selectedDisplay } = useSelectedDisplay();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [selectedDisplayName, setSelectedDisplayName] = useState('');
  const { data: displayList } = useDisplayList();
  const { data: displayInfo } = useDisplayInfo();
  const [isOpen, setIsOpen] = useState(false);
  const STORED_NAME = 'trelliscope_display_switch_state';
  const { setStoredValue } = useStoredInputValue(STORED_NAME, '');
  const { data: configObj } = useConfig();

  const filterViews = useSelector(filterViewSelector);
  const filters = useSelector(selectFilterState);
  const sorts = useSelector(selectSort);
  const labels = useSelector(selectLabels);
  const layout = useSelector(selectLayout);

  const stateLayout = displayInfo?.state?.layout;
  const stateLabels = displayInfo?.state?.labels?.varnames;
  const stateSort = displayInfo?.state?.sort;
  const stateFilters = displayInfo?.state?.filter;
  const activeDisplayName = displayInfo?.name;

  // This is needed to make sure the default state or the state from local storage that the user was previously on is applied when switching to a new display
  useEffect(() => {
    if (selectedDisplayName === activeDisplayName) {
      const localSavedState = localStorage.getItem(getLocalStorageKey([], displayInfo?.name || '', STORED_NAME, ''));

      if (localSavedState) {
        const {
          filter: valueFilter,
          labels: valueLabels,
          layout: valueLayout,
          sort: valueSort,
          filterView: valueFilterView,
        } = JSON.parse(localSavedState).state;

        if (valueLayout) dispatch(setLayout(valueLayout as LayoutAction));

        if (valueLabels) dispatch(setLabels(valueLabels.varnames));

        if (valueSort) dispatch(setSort(valueSort));

        if (valueFilter) dispatch(setFiltersandFilterViews(valueFilter));

        if (valueFilterView) {
          const inactiveFilters = filterViews.inactive.filter((filter) => !valueFilterView.includes(filter));
          dispatch(setFilterView({ name: { active: valueFilterView, inactive: inactiveFilters }, which: 'set' }));
        }

        return;
      }
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
    // Need to save to local storage a "view" of the current display before switching
    // If a view is saved we want to load that in the new display
    // Otherwise we want to load the default state of the new display
    setStoredValue(
      JSON.stringify({
        name: activeDisplayName,
        state: {
          layout,
          labels: { varnames: labels, type: 'labels' },
          sort: sorts,
          filter: filters,
          filterView: filterViews?.active,
        },
      }),
    );

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
    <ErrorWrapper>
      <Button
        sx={{
          color: configObj?.theme?.header
            ? configObj.theme?.header?.text
            : configObj?.theme?.isLightTextOnDark && configObj?.theme
            ? configObj?.theme?.lightText
            : !configObj?.theme?.isLightTextOnDark && configObj?.theme
            ? configObj?.theme?.darkText
            : '#757575',
          textTransform: 'unset',
        }}
        id="display-select-button"
        aria-haspopup="true"
        aria-controls={isOpen ? 'basic-menu' : undefined}
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={handleOpen}
        endIcon={<FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} size="xs" />}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '300px',
          }}
        >
          View other displays ({displayList?.find((d) => d.name !== selectedDisplay)?.name || ''}
        </span>
        {displayList && displayList?.length - 2 > 0 ? ` + ${displayList?.length - 2} more` : ''})
      </Button>
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
    </ErrorWrapper>
  );
};

export default DisplaySelect;

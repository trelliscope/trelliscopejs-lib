import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { faChevronUp, faChevronDown, faRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ClickAwayListener, IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useDisplayMetas, useMetaGroups } from '../../slices/displayInfoAPI';
import VariableSelector from '../VariableSelector';
import styles from './Filters.module.scss';
import {
  clearFilters,
  removeFilter,
  selectActiveFilterView,
  selectFilterState,
  setFilterView,
} from '../../slices/filterSlice';
import { setLayout } from '../../slices/layoutSlice';
import ConfirmationModal from '../ConfirmationModal';

// interface FiltersProps {}

const Filters: React.FC = () => {
  const dispatch = useDispatch();
  const activeStateFilters = useSelector(selectFilterState);
  const activeFilters = useSelector(selectActiveFilterView);
  const displayMetas = useDisplayMetas();
  const unfilterableMetas = displayMetas.filter((meta) => !meta.filterable).map((meta) => meta.varname);
  const filterableMetas = displayMetas.filter((meta) => meta.filterable).map((meta) => meta);
  const [confirmationRemoveModalOpen, setConfirmationRemoveModalOpen] = useState(false);
  const [confirmationClearModalOpen, setConfirmationClearModalOpen] = useState(false);
  const [valueToRemove, setValueToRemove] = useState<{ varname: string }[]>([]);

  const metaGroups = useMetaGroups(unfilterableMetas);

  const activeFiltersFormatted = useMemo(
    () =>
      activeFilters.map((filter) => {
        const filterObj = {
          varname: filter,
        };
        return filterObj;
      }),
    [activeFilters],
  );
  const [selectedFilterVariables, setSelectedFilterVariables] = useState(activeFiltersFormatted || []);
  const [variableFilterSelectorIsOpen, setVariableFilterSelectorIsOpen] = useState(false);
  const [anchorFilterEl, setAnchorFilterEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setSelectedFilterVariables(activeFiltersFormatted);
  }, [activeFiltersFormatted]);

  const handleVariableFilterSelectorClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorFilterEl(anchorFilterEl ? null : event.currentTarget);
    setVariableFilterSelectorIsOpen(!variableFilterSelectorIsOpen);
  };

  const handleClear = () => {
    dispatch(clearFilters());
    setConfirmationClearModalOpen(!confirmationClearModalOpen);
  };

  const handleClearAndRemove = () => {
    if (valueToRemove.length === 0) {
      dispatch(setFilterView({ name: '', which: 'removeActive' }));
      dispatch(
        setLayout({
          page: 1,
          type: 'layout',
        }),
      );
      dispatch(clearFilters());
      setConfirmationRemoveModalOpen(!confirmationRemoveModalOpen);
      return;
    }

    const removedItem = selectedFilterVariables.find((item: { varname: string }) => valueToRemove.indexOf(item) === -1);
    dispatch(setFilterView({ name: removedItem?.varname as string, which: 'remove' }));
    dispatch(
      setLayout({
        page: 1,
        type: 'layout',
      }),
    );
    dispatch(removeFilter(removedItem?.varname as string));
    setConfirmationRemoveModalOpen(!confirmationRemoveModalOpen);
  };

  const handleFilterChange = (e: SyntheticEvent, value: { varname: string }[]) => {
    const addedItem = value[value.length - 1];
    const removedItem = selectedFilterVariables.find((item: { varname: string }) => value.indexOf(item) === -1);

    if (
      activeStateFilters.find((filter) => filter.varname === removedItem?.varname) ||
      (activeStateFilters.length > 0 && value.length === 0)
    ) {
      if (value.length === 0) {
        setConfirmationRemoveModalOpen(!confirmationRemoveModalOpen);
        setValueToRemove(value);
        return;
      }

      if (value.length < selectedFilterVariables.length) {
        setConfirmationRemoveModalOpen(!confirmationRemoveModalOpen);
        setValueToRemove(value);
        return;
      }
    }

    if (value.length === 0) {
      dispatch(setFilterView({ name: '', which: 'removeActive' }));
      dispatch(
        setLayout({
          page: 1,
          type: 'layout',
        }),
      );
      return;
    }

    if (value.length < selectedFilterVariables.length) {
      dispatch(setFilterView({ name: removedItem?.varname as string, which: 'remove' }));
      dispatch(
        setLayout({
          page: 1,
          type: 'layout',
        }),
      );
      return;
    }

    setSelectedFilterVariables(value);
    dispatch(setFilterView({ name: addedItem.varname, which: 'add' }));
  };

  return (
    <>
      <div className={styles.filters}>
        <ConfirmationModal
          isOpen={confirmationRemoveModalOpen}
          handleCancel={() => setConfirmationRemoveModalOpen(!confirmationRemoveModalOpen)}
          handleConfirm={handleClearAndRemove}
          dialogText={`${
            valueToRemove.length === 0
              ? 'This will clear and remove all of the active filters.'
              : 'This will clear the selected active filter.'
          }`}
        />
        <ConfirmationModal
          isOpen={confirmationClearModalOpen}
          handleCancel={() => setConfirmationClearModalOpen(!confirmationClearModalOpen)}
          handleConfirm={handleClear}
          dialogText="This will clear all of the active filters."
        />
        <ClickAwayListener
          mouseEvent="onMouseUp"
          onClickAway={() => {
            setVariableFilterSelectorIsOpen(false);
            setAnchorFilterEl(null);
          }}
        >
          <div>
            <Button
              sx={{
                color: '#000000',
                textTransform: 'unset',
                fontSize: '15px',
              }}
              type="button"
              onClick={handleVariableFilterSelectorClick}
              endIcon={<FontAwesomeIcon icon={variableFilterSelectorIsOpen ? faChevronUp : faChevronDown} />}
            >
              Show / Hide Filters
            </Button>
            <VariableSelector
              isOpen={variableFilterSelectorIsOpen}
              selectedVariables={selectedFilterVariables}
              metaGroups={metaGroups}
              anchorEl={anchorFilterEl}
              displayMetas={filterableMetas as unknown as { [key: string]: string }[]}
              handleChange={
                handleFilterChange as unknown as (
                  event: React.SyntheticEvent<Element, Event>,
                  value: { [key: string]: string }[],
                ) => void
              }
            />
          </div>
        </ClickAwayListener>
        <Tooltip arrow title="Clear and Remove all Filters">
          <IconButton onClick={() => setConfirmationRemoveModalOpen(!confirmationRemoveModalOpen)}>
            <FontAwesomeIcon icon={faXmark} size="sm" />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Clear all Filters">
          <IconButton onClick={() => setConfirmationClearModalOpen(!confirmationClearModalOpen)}>
            <FontAwesomeIcon icon={faRotateLeft} size="xs" />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
};

export default Filters;

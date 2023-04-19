import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useDisplayMetas, useMetaGroups } from '../../slices/displayInfoAPI';
import VariableSelector from '../VariableSelector';
import styles from './Filters.module.scss';
import { clearFilters, selectActiveFilterView, setFilterView } from '../../slices/filterSlice';
import { setLayout } from '../../slices/layoutSlice';

// interface FiltersProps {}

const Filters: React.FC = () => {
  const dispatch = useDispatch();
  const activeFilters = useSelector(selectActiveFilterView);
  const displayMetas = useDisplayMetas();
  const unfilterableMetas = displayMetas.filter((meta) => !meta.filterable).map((meta) => meta.varname);
  const filterableMetas = displayMetas.filter((meta) => meta.filterable).map((meta) => meta);

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

  const handleFilterChange = (e: SyntheticEvent, value: { varname: string }[]) => {
    const addedItem = value[value.length - 1];
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
      const removedItem = selectedFilterVariables.find((item: { varname: string }) => value.indexOf(item) === -1);
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
    <div className={styles.filters}>
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
  );
};

export default Filters;

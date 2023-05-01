import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faXmark, faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Checkbox, FormControlLabel, Button, Divider } from '@mui/material';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_TYPE_CATEGORY, FILTER_TYPE_NUMBERRANGE, META_FILTER_TYPE_MAP, META_TYPE_FACTOR } from '../../../constants';
import { useMetaByVarname } from '../../../slices/displayInfoAPI';
import { removeFilter, selectFilterByVarname, selectFilterState, setFilterView } from '../../../slices/filterSlice';
import FilterCat from './FilterCat';
import FilterNum from './FilterNum';

import styles from './FilterInput.module.scss';
import { labelsSelector } from '../../../selectors';
import { setLabels } from '../../../slices/labelsSlice';
import { selectSort, setSort } from '../../../slices/sortSlice';
import FooterChip from '../../FooterChip/FooterChip';
import { setLayout } from '../../../slices/layoutSlice';
import ConfirmationModal from '../../ConfirmationModal';

interface FilterInputsProps {
  filterName: string;
}

const FilterInputs: React.FC<FilterInputsProps> = ({ filterName }) => {
  const dispatch = useDispatch();
  const meta = useMetaByVarname(filterName);
  const filter = useSelector(selectFilterByVarname(filterName));
  const activeFilters = useSelector(selectFilterState);
  const labels = useSelector(labelsSelector);
  const sort = useSelector(selectSort);
  const sort2 = Object.assign([], sort) as ISortState[];
  const isSorted = sort.find((s) => s.varname === filterName);
  const labelIsSelected = labels.includes(filterName);
  const filterType = META_FILTER_TYPE_MAP[meta?.type || ''];
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleReset = () => {
    dispatch(removeFilter(filterName));
  };

  const checkIfFilterIsActive = () => {
    if (activeFilters.find((f) => f.varname === filterName)) {
      setConfirmationModalOpen(!confirmationModalOpen);
      return;
    }
    dispatch(setFilterView({ name: filterName, which: 'remove' }));
  };

  const handleMinimize = () => {
    dispatch(setFilterView({ name: filterName, which: 'remove' }));
    dispatch(removeFilter(filterName));
    setConfirmationModalOpen(!confirmationModalOpen);
  };

  let sortRes = {} as { filterName: string; icon: string };
  if (isSorted) {
    const { type } = meta || {};
    let icon = 'icon-sort-alpha';
    if (type === 'number' || type === 'factor') {
      icon = 'icon-sort-numeric';
    }
    icon = `${icon}-${isSorted?.dir}`;
    sortRes = { filterName, icon };
  }

  const handleLabelChange = (varname: string) => {
    if (labelIsSelected) {
      dispatch(setLabels(labels.filter((label: string) => label !== varname)));
      return;
    }
    dispatch(setLabels([...labels, varname]));
  };

  const handleSortClick = () => {
    if (isSorted) {
      const i = sort2.findIndex((s) => s.varname === filterName);
      const sortObj = { ...sort2[i] };
      sortObj.dir = sortObj.dir === 'asc' ? 'desc' : 'asc';
      const newSort = [...sort2];
      newSort[i] = sortObj;
      dispatch(setSort(newSort));
      return;
    }
    sort2.push({ varname: filterName, dir: 'asc', type: 'sort', metatype: meta?.type || 'string' });
    dispatch(setSort(sort2));
    dispatch(
      setLayout({
        page: 1,
        type: 'layout',
      }),
    );
  };

  const handleSortRemove = () => {
    const i = sort2.findIndex((s) => s.varname === filterName);
    const newSort = [...sort2];
    newSort.splice(i, 1);
    dispatch(setSort(newSort));
    dispatch(
      setLayout({
        page: 1,
        type: 'layout',
      }),
    );
  };

  return (
    <div className={classNames(styles.filterInput)}>
      <div className={styles.filterInputHeader}>
        <div>
          <div className={styles.filterInputHeaderName}>{filterName}</div>
          <div className={styles.filterInputHeaderLabel}>{meta?.label}</div>
        </div>
        <div className={styles.filterInputHeaderControls}>
          {meta?.type === META_TYPE_FACTOR && (
            <div className={styles.filterInputCount}>
              {(filter as ICategoryFilterState)?.values?.length || 0} of {(meta as IFactorMeta)?.levels?.length}
            </div>
          )}
          <ConfirmationModal
            isOpen={confirmationModalOpen}
            handleCancel={() => setConfirmationModalOpen(!confirmationModalOpen)}
            handleConfirm={handleMinimize}
            dialogText="This will clear the selected active filter."
          />
          <IconButton aria-label="close" size="small" onClick={checkIfFilterIsActive}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </div>
      </div>
      {filterType === FILTER_TYPE_CATEGORY && (
        <FilterCat meta={meta as IFactorMeta} filter={filter as ICategoryFilterState} />
      )}
      {filterType === FILTER_TYPE_NUMBERRANGE && (
        <FilterNum meta={meta as INumberMeta} filter={filter as INumberRangeFilterState} />
      )}
      <div className={styles.filterInputSubMenu}>
        <div>
          <FormControlLabel
            control={
              <Checkbox checked={labelIsSelected} onClick={() => handleLabelChange(meta?.varname as string)} size="small" />
            }
            label="Show label"
          />
        </div>
        <div>
          {!isSorted ? (
            <Button
              onClick={handleSortClick}
              disabled={!meta?.sortable}
              size="small"
              variant="text"
              endIcon={<FontAwesomeIcon icon={faArrowDownShortWide} />}
            >
              Sort By
            </Button>
          ) : (
            <FooterChip
              label={filterName}
              icon={sortRes.icon}
              text=""
              index={0}
              type={meta?.type || 'string'}
              handleClose={handleSortRemove}
              handleClick={handleSortClick}
              enforceMaxWidth
            />
          )}
        </div>
        <div>
          <Button
            disabled={!filter}
            size="small"
            variant="text"
            onClick={handleReset}
            endIcon={<FontAwesomeIcon icon={faRotateLeft} />}
          >
            Clear Filter
          </Button>
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default FilterInputs;

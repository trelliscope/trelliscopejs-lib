import React, { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faXmark, faArrowDownShortWide, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Checkbox, FormControlLabel, Button, Divider } from '@mui/material';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FILTER_TYPE_CATEGORY,
  FILTER_TYPE_DATERANGE,
  FILTER_TYPE_DATETIMERANGE,
  FILTER_TYPE_NUMBERRANGE,
  META_FILTER_TYPE_MAP,
  META_TYPE_DATE,
  META_TYPE_DATETIME,
  META_TYPE_FACTOR,
  META_TYPE_NUMBER,
} from '../../constants';
import { useMetaByVarname } from '../../slices/displayInfoAPI';
import { removeFilter, selectFilterByVarname, selectFilterState, setFilterView } from '../../slices/filterSlice';
import FilterCat from '../FilterCat';
import FilterNum from '../FilterNum';

import styles from './FilterInput.module.scss';
import { labelsSelector } from '../../selectors';
import { setLabels } from '../../slices/labelsSlice';
import { selectSort, setSort } from '../../slices/sortSlice';
import Chip from '../Chip/Chip';
import { setLayout } from '../../slices/layoutSlice';
import ConfirmationModal from '../ConfirmationModal';
import FilterDateRange from '../FilterDateRange/FilterDateRange';
import FilterDateTimeRange from '../FilterDateTimeRange/FilterDateTimeRange';
import ErrorWrapper from '../ErrorWrapper';

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

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${filterName}_filter`,
  });
  const transformString = CSS.Transform.toString(transform) || '';
  const matchTranslate = transformString.match(/translate3d\((.*?), (.*?), (.*?)\)/);

  const style = {
    transform: matchTranslate ? `${matchTranslate[0]} scaleX(1) scaleY(1)` : '',
    transition,
    zIndex: isDragging ? 1000 : undefined,
  };

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
    if (type === META_TYPE_NUMBER || type === META_TYPE_FACTOR || type === META_TYPE_DATE || type === META_TYPE_DATETIME) {
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
    <ErrorWrapper>
      <div ref={setNodeRef} style={style} {...attributes} className={classNames(styles.filterInput)}>
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
            <div className={styles.filterInputHeaderControlsIcon}>
              <FontAwesomeIcon {...listeners} icon={faGripVertical} />
            </div>
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
        {filterType === FILTER_TYPE_DATERANGE && (
          <FilterDateRange meta={meta as IMeta} filter={filter as INumberRangeFilterState} />
        )}
        {filterType === FILTER_TYPE_DATETIMERANGE && (
          <FilterDateTimeRange meta={meta as IMeta} filter={filter as INumberRangeFilterState} />
        )}

        <div className={styles.filterInputSubMenu}>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={labelIsSelected}
                  onClick={() => handleLabelChange(meta?.varname as string)}
                  size="small"
                  inputProps={{ 'data-testid': 'label-checkbox' } as InputHTMLAttributes<HTMLInputElement>}
                />
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
              <Chip
                label={filterName}
                icon={sortRes.icon}
                text=""
                index={0}
                type={meta?.type || 'string'}
                handleClose={handleSortRemove}
                handleClick={handleSortClick}
                enforceMaxWidth
                isDraggable={false}
              />
            )}
          </div>
          <div>
            <Button
              data-testid="clear-filter-button"
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
    </ErrorWrapper>
  );
};

export default FilterInputs;

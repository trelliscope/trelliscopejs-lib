import React, { useState } from 'react';
import { faRotateLeft, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox } from '@mui/material';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_TYPE_CATEGORY, FILTER_TYPE_NUMBERRANGE, META_FILTER_TYPE_MAP, META_TYPE_FACTOR } from '../../../constants';
import { useMetaByVarname } from '../../../slices/displayInfoAPI';
import { removeFilter, selectFilterByVarname, setFilterView } from '../../../slices/filterSlice';
import FilterCat from './FilterCat';
import FilterNum from './FilterNum';

import styles from './FilterInput.module.scss';
import useMetaInfo from '../../../selectors/useMetaInfo';

interface FilterInputsProps {
  filterName: string;
}

const FilterInputs: React.FC<FilterInputsProps> = ({ filterName }) => {
  const dispatch = useDispatch();
  const meta = useMetaByVarname(filterName);
  const filter = useSelector(selectFilterByVarname(filterName));
  const filterType = META_FILTER_TYPE_MAP[meta?.type || ''];
  const [isLogScale, setIsLogScale] = useState(false);

  console.log('filterInput::: render');

  const handleReset = () => {
    dispatch(removeFilter(filterName));
  };

  const handleMinimize = () => {
    dispatch(setFilterView({ name: filterName, which: 'remove' }));
  };

  const handleLogScale = () => {
    setIsLogScale(!isLogScale);
  };

  return (
    <div className={classNames(styles.filterInput, { [styles.filterInput__active]: filter })}>
      <div className={styles.filterInputHeader}>
        <div className={styles.filterInputHeaderName}>{filterName}</div>
        <div className={styles.filterInputHeaderControls}>
          {meta?.type === META_TYPE_FACTOR && (
            <div className={styles.filterInputCount}>
              {(filter as ICategoryFilterState)?.values?.length || 0} of {(meta as IFactorMeta)?.levels?.length}
            </div>
          )}
          {filterType === FILTER_TYPE_NUMBERRANGE && (
            <div className={styles.filterInputHeaderControlsLogScaleCheckboxContainer}>
              <div>Log Scale</div>
              <Checkbox checked={isLogScale} sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} onChange={handleLogScale} />
            </div>
          )}
          {filter && (
            <button
              type="button"
              onClick={handleReset}
              className={classNames(styles.filterInputHeaderBtn, styles.filterInputReset)}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
          )}
          <button
            type="button"
            onClick={handleMinimize}
            className={classNames(styles.filterInputHeaderBtn, styles.filterInputMinimize)}
          >
            <FontAwesomeIcon icon={faWindowMinimize} transform="up-5" />
          </button>
        </div>
      </div>
      {filterType === FILTER_TYPE_CATEGORY && (
        <FilterCat meta={meta as IFactorMeta} filter={filter as ICategoryFilterState} />
      )}
      {filterType === FILTER_TYPE_NUMBERRANGE && (
        <FilterNum meta={meta as INumberMeta} filter={filter as INumberRangeFilterState} isLogScale={isLogScale} />
      )}
    </div>
  );
};

export default FilterInputs;

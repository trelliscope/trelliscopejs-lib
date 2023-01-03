import { faRotateLeft, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_TYPE_CATEGORY, FILTER_TYPE_NUMBERRANGE, META_FILTER_TYPE_MAP, META_TYPE_FACTOR } from '../../../constants';
import useMetaInfo from '../../../selectors/useMetaInfo';
import { useMetaByVarname } from '../../../slices/displayInfoAPI';
import { selectFilterByVarname, setFilter, setFilterView } from '../../../slices/filterSlice';
import FilterCat from './FilterCat';

import styles from './FilterInput.module.scss';
import FilterNum from './FilterNum';

interface FilterInputsProps {
  filterName: string;
}

const FilterInputs: React.FC<FilterInputsProps> = ({ filterName }) => {
  const meta = useMetaByVarname(filterName);
  const filter = useSelector(selectFilterByVarname(filterName));
  const metaInfo = useMetaInfo(filterName, meta?.type);
  const dispatch = useDispatch();
  const filterType = META_FILTER_TYPE_MAP[meta?.type || ''];

  const handleReset = () => {
    dispatch(setFilter(filterName));
  };

  const handleMinimize = () => {
    dispatch(setFilterView({ name: filterName, which: 'remove' }));
  };

  return (
    <div className={classNames(styles.filterInput, { [styles.filterInput__active]: filter })}>
      <div className={styles.filterInputHeader}>
        <div className={styles.filterInputHeaderName}>{filterName}</div>
        <div className={styles.filterInputHeaderControls}>
          {meta?.type === META_TYPE_FACTOR && (
            <div className={styles.filterInputCount}>
              {(filter as ICategoryFilterState)?.values.length || 0} of {(meta as IFactorMeta)?.levels?.length}
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
      {filterType === FILTER_TYPE_NUMBERRANGE && <FilterNum />}
    </div>
  );
};

export default FilterInputs;

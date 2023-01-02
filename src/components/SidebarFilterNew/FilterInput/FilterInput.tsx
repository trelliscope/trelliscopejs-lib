import React from 'react';
import { FILTER_TYPE_CATEGORY, FILTER_TYPE_NUMBERRANGE, META_FILTER_TYPE_MAP } from '../../../constants';
import { useMetaByVarname } from '../../../slices/displayInfoAPI';
import FilterCat from './FilterCat';

import styles from './FilterInput.module.scss';
import FilterNum from './FilterNum';

interface FilterInputsProps {
  filter: string;
}

const FilterInputs: React.FC<FilterInputsProps> = ({ filter }) => {
  const meta = useMetaByVarname(filter);
  const filterType = META_FILTER_TYPE_MAP[meta?.type || ''];

  return (
    <div className={styles.filterInput}>
      {filterType === FILTER_TYPE_CATEGORY && <FilterCat meta={meta} />}
      {filterType === FILTER_TYPE_NUMBERRANGE && <FilterNum />}
    </div>
  );
};

export default FilterInputs;

import React from 'react';
import useMetaInfo from '../../../../selectors/useMetaInfo';

import styles from './FilterCat.module.scss';

interface FilterCatProps {
  meta: IFactorMeta;
}

const FilterCat: React.FC<FilterCatProps> = ({ meta }) => {
  const info = useMetaInfo(meta.varname, meta.type);

  console.log(info);

  return <div className={styles.filterCat}></div>;
};

export default FilterCat;

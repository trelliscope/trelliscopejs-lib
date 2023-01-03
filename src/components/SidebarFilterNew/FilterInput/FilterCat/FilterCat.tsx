import React, { useContext } from 'react';
import useMetaInfo from '../../../../selectors/useMetaInfo';
import CatHistogram from '../../../CatHistogram';
import { DataContext } from '../../../DataProvider';

import styles from './FilterCat.module.scss';

interface FilterCatProps {
  meta: IFactorMeta;
  filter: ICategoryFilterState;
}

const FilterCat: React.FC<FilterCatProps> = ({ meta, filter }) => {
  const { domain } = useMetaInfo(meta.varname, meta.type);
  const { groupBy } = useContext(DataContext);

  console.log(filter);

  return (
    <div className={styles.filterCat}>
      <div className={styles.filterCatChart}>
        <CatHistogram
          data={groupBy(meta.varname)}
          domain={domain}
          actives={filter?.values}
          count={meta.levels.length}
          width={220}
          height={125}
        />
      </div>
    </div>
  );
};

export default FilterCat;

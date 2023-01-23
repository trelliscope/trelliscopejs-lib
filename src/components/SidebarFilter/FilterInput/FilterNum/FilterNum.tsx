import React from 'react';
import { useDispatch } from 'react-redux';
import { FILTER_TYPE_NUMBERRANGE } from '../../../../constants';
import useMetaInfo from '../../../../selectors/useMetaInfo';
import { addFilter, updateFilter } from '../../../../slices/filterSlice';
import NumHistogram from '../../../NumHistogram';

import styles from './FilterNum.module.scss';

interface FilterNumProps {
  meta: INumberMeta;
  filter: INumberRangeFilterState;
}

const FilterNum: React.FC<FilterNumProps> = ({ meta, filter = undefined }) => {
  const { yDomain, xDomain, data } = useMetaInfo(meta.varname, meta.type);
  const dispatch = useDispatch();

  const handleOnBrush = (values: number[]) => {
    if (filter) {
      dispatch(updateFilter({ ...filter, min: values[0], max: values[1] }));
    } else {
      const newFilter = {
        type: 'filter',
        varname: meta.varname,
        filtertype: FILTER_TYPE_NUMBERRANGE,
        min: values[0],
        max: values[1],
      } as INumberRangeFilterState;
      dispatch(addFilter(newFilter));
    }
  };

  if (!data?.length) return null;

  return (
    <div className={styles.filterNum}>
      <div className={styles.filterNumChart}>
        <NumHistogram
          width={220}
          height={100}
          yDomain={yDomain}
          xDomain={xDomain}
          data={data}
          name={meta.varname}
          onBrush={handleOnBrush}
          selection={[filter?.min || 0, filter?.max || 0]}
        />
      </div>
      <div className={styles.filterNumInput}>
        {/* <TextField
          placeholder="regex"
          classes={{ root: styles.filterNumRegex }}
          value={filter?.regexp || ''}
          onChange={handleRegex}
          variant="standard"
        /> */}
      </div>
    </div>
  );
};

export default FilterNum;

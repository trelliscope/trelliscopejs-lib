import React from 'react';
import type { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import { FILTER_TYPE_NUMBERRANGE } from '../../../../constants';
import useMetaInfo from '../../../../selectors/useMetaInfo';
import { addFilter, removeFilter, updateFilter } from '../../../../slices/filterSlice';
import NumHistogram from '../../../NumHistogram';
import { format } from '../../../FormattedNumber/FormattedNumber';
import styles from './FilterNum.module.scss';

interface FilterNumProps {
  meta: INumberMeta;
  filter: INumberRangeFilterState;
}

const FilterNum: React.FC<FilterNumProps> = ({ meta, filter }) => {
  const { yDomain, xDomain, data } = useMetaInfo(meta.varname, meta.type);
  const dispatch = useDispatch();

  const handleOnBrush = (values: number[] | null[]) => {
    if (values[0] === null && values[1] === null) {
      if (filter) {
        dispatch(removeFilter(filter.varname));
      }
    } else if (filter) {
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

  const inputStyle = { textAlign: 'center', paddingBottom: 2 } as CSSProperties;

  if (filter?.max && filter?.min && filter?.max < filter?.min) {
    inputStyle.color = 'red';
  }

  // const checkValidNumber = (which: string, lower: number | string = '', upper: number | string = '') => {
  //   if (which === 'to') {
  //     if (lower && parseFloat(lower.toString()) > parseFloat(upper.toString())) {
  //       return false;
  //     }
  //   } else if (upper && parseFloat(upper.toString()) < parseFloat(lower?.toString())) {
  //     return false;
  //   }
  //   return true;
  // };

  const handleInput = (val: string, which: string) => {
    let newState = {} as INumberRangeFilterState;
    const newVal = val === '' ? null : parseFloat(val);
    const lower = which === 'min' ? newVal : filter?.min;
    const upper = which === 'max' ? newVal : filter?.max;
    if (filter) {
      newState = {
        varname: filter.varname,
        filtertype: 'numberrange',
        type: filter.type,
        min: lower === undefined && upper === undefined ? null : lower,
        max: lower === undefined && upper === undefined ? null : upper,
      };
      dispatch(updateFilter(newState));
    } else {
      newState = {
        varname: meta.varname,
        filtertype: 'numberrange',
        type: 'filter',
        min: lower,
        max: upper,
      };
      dispatch(addFilter(newState));
    }
  };

  // calculate step value for numeric input
  const hspan = (xDomain[1] - xDomain[0]) * xDomain.length;
  const step = (10 ** Math.round(Math.log10(hspan / 100) - 0.4)) as number;

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
      <div className={styles.filterNumInputContainer}>
        <div className={styles.filterNumRangeInputLabel}>Range:</div>
        <TextField
          name="minText"
          className={styles.filterNumRangeInputText}
          inputProps={{
            style: inputStyle,
            step,
          }}
          type="number"
          value={filter?.min ? format(filter?.min, 2, false, false, undefined, true) : ''}
          onChange={(e) => handleInput(e.target.value, 'min')}
          variant="standard"
        />
        <div className={`${styles.filterNumRangeInputLabel} ${styles.filterNumRangeInputTextDash}`}>-</div>
        <TextField
          name="maxText"
          className={styles.filterNumRangeInputText}
          inputProps={{
            style: inputStyle,
            step,
          }}
          type="number"
          value={filter?.max ? format(filter?.max, 2, false, false, undefined, true) : ''}
          onChange={(e) => handleInput(e.target.value, 'max')}
          variant="standard"
        />
      </div>
    </div>
  );
};

export default FilterNum;

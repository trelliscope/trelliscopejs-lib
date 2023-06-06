import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import { FILTER_TYPE_NUMBERRANGE } from '../../../../constants';
import useMetaInfo from '../../../../selectors/useMetaInfo';
import { addFilter, removeFilter, updateFilter } from '../../../../slices/filterSlice';
import NumHistogram from '../../../NumHistogram';
import { format } from '../../../FormattedNumber/FormattedNumber';
import { useDisplayMetas } from '../../../../slices/displayInfoAPI';
import styles from './FilterNum.module.scss';

interface FilterNumProps {
  meta: INumberMeta;
  filter: INumberRangeFilterState;
}

const FilterNum: React.FC<FilterNumProps> = ({ meta, filter }) => {
  const { yDomain, xDomain, data } = useMetaInfo(meta.varname, meta.type);
  const metas = useDisplayMetas();
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const metaObj = metas.find((m) => m.varname === meta.varname);
  const { log } = metaObj as IMeta;
  const dispatch = useDispatch();

  useEffect(() => {
    if (filter?.min) {
      setMinInput(format(filter?.min, 2, false, false, undefined, true));
    }
    if (filter?.max) {
      setMaxInput(format(filter?.max, 2, false, false, undefined, true));
    }
  }, [filter?.max, filter?.min]);

  const handleOnBrush = (values: number[] | null[]) => {
    if (values[0] === null && values[1] === null) {
      if (filter) {
        dispatch(removeFilter(filter.varname));
      }
    } else if (filter) {
      dispatch(
        updateFilter({
          ...filter,
          min: log ? 10 ** (values[0] ?? 0) : values[0],
          max: log ? 10 ** (values[1] ?? 0) : values[1],
        }),
      );
    } else {
      const newFilter = {
        type: 'filter',
        varname: meta.varname,
        filtertype: FILTER_TYPE_NUMBERRANGE,
        min: log ? 10 ** (values[0] ?? 0) : values[0],
        max: log ? 10 ** (values[1] ?? 0) : values[1],
        metatype: 'number',
      } as INumberRangeFilterState;
      dispatch(addFilter(newFilter));
    }
  };

  if (!data?.length) return null;

  const inputStyle = { textAlign: 'center', paddingBottom: 2 } as CSSProperties;

  if (filter?.max && filter?.min && filter?.max < filter?.min) {
    inputStyle.color = 'red';
  }

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
        metatype: 'number',
      };
      dispatch(updateFilter(newState));
    } else {
      newState = {
        varname: meta.varname,
        filtertype: 'numberrange',
        type: 'filter',
        min: lower,
        max: upper,
        metatype: 'number',
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
          width={399}
          height={175}
          yDomain={yDomain}
          xDomain={xDomain}
          data={data}
          name={meta.varname}
          onBrush={handleOnBrush}
          selection={[filter?.min || 0, filter?.max || 0]}
          log={log}
          isDate={false}
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
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
          onBlur={() => {
            const min = parseFloat(minInput);
            if (!Number.isNaN(min)) {
              const formattedMin = format(min, 2, false, false, undefined, true);
              handleInput(formattedMin, 'min');
              setMinInput(formattedMin);
            }
          }}
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
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
          onBlur={() => {
            const max = parseFloat(maxInput);
            if (!Number.isNaN(max)) {
              const formattedMax = format(max, 2, false, false, undefined, true);
              handleInput(formattedMax, 'max');
              setMaxInput(formattedMax);
            }
          }}
          variant="standard"
        />
      </div>
    </div>
  );
};

export default FilterNum;

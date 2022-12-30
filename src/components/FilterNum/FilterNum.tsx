import React from 'react';
import type { CSSProperties } from 'react';
import TextField from '@mui/material/TextField';
import FilterNumPlot from '../FilterNumPlot';

import styles from './FilterNum.module.scss';
import useMetaInfo from '../../selectors/useMetaInfo';

interface FilterNumProps {
  name: string;
  filterState: INumberRangeFilterState;
  dist: CogDistns<CogDistnsNumeric>;
  condDist: CondDistFilterNum;
  handleChange: (filterNumStateChange: INumberRangeFilterState) => void;
}

const FilterNum: React.FC<FilterNumProps> = ({ name, filterState, dist, condDist, handleChange }) => {
  const stateValue = filterState.value || {};
  const { breaks } = useMetaInfo(name, dist.type);

  const checkValidNumber = (which: string, lower: number | string = '', upper: number | string = '') => {
    if (which === 'to') {
      if (lower && parseFloat(lower.toString()) > parseFloat(upper.toString())) {
        return false;
      }
    } else if (upper && parseFloat(upper.toString()) < parseFloat(lower?.toString())) {
      return false;
    }
    return true;
  };

  const handleInput = (val: string, which: string) => {
    let newState = {} as INumberRangeFilterState;
    const newVal = val === '' ? undefined : parseFloat(val);
    const lower = which === 'from' ? newVal : stateValue.from;
    const upper = which === 'to' ? newVal : stateValue.to;
    if (lower === undefined && upper === undefined) {
      newState = {
        name: filterState.name,
        type: 'range',
        varType: filterState.varType,
        valid: true,
      };
    } else {
      newState = {
        name: filterState.name,
        type: 'range',
        varType: filterState.varType,
        value: {
          from: lower,
          to: upper,
        },
        valid: checkValidNumber(which, lower, upper),
      };
    }
    handleChange(newState);
  };

  const handleBrushInput = (values: number[] | undefined) => {
    if (values === undefined) {
      const newState = {
        name: filterState.name,
        type: 'range',
        varType: filterState.varType,
        valid: true,
      };
      return handleChange(newState);
    }
    const newState = {
      name: filterState.name,
      type: 'range',
      varType: filterState.varType,
      value: {
        from: values[0],
        to: values[1],
      },
      valid: true,
    };
    return handleChange(newState);
  };

  const validStyle = { textAlign: 'center' } as CSSProperties;
  if (filterState.valid !== undefined && !filterState.valid) {
    validStyle.color = 'red';
  }

  const rangeInput = {
    width: 75,
    marginTop: -5,
    fontSize: 16,
    transform: 'scale(0.85)',
    transformOrigin: '0 0',
  };

  const inputStyle = { textAlign: 'center', paddingBottom: 2 } as CSSProperties;

  const { to, from } = stateValue;
  if (to && from && to < from) {
    inputStyle.color = 'red';
  }

  // calculate step value for numeric input
  const { breaks } = dist.dist.raw;
  const hspan = (breaks[1] - breaks[0]) * breaks.length;
  const step = (10 ** Math.round(Math.log10(hspan / 100) - 0.4)) as number;

  return (
    <div className={styles.filterNumContainer}>
      <div className={styles.filterNumPlotContainer}>
        <FilterNumPlot
          name={name}
          width={220}
          height={100}
          condDist={condDist}
          filterState={filterState}
          handleChange={handleBrushInput}
        />
      </div>
      <div className={styles.filterNumInputContainer}>
        <div className={styles.filterNumRangeInputText}>Range:</div>
        <TextField
          name="fromText"
          style={rangeInput}
          inputProps={{
            style: inputStyle,
            step,
          }}
          type="number"
          value={stateValue.from ? stateValue.from : ''}
          onChange={(e) => handleInput(e.target.value, 'from')}
          variant="standard"
        />
        <div className={`${styles.filterNumRangeInputText} ${styles.filterNumRangeInputTextDash}`}>-</div>
        <TextField
          name="toText"
          style={rangeInput}
          inputProps={{
            style: inputStyle,
            step,
          }}
          type="number"
          value={stateValue.to ? stateValue.to : ''}
          onChange={(e) => handleInput(e.target.value, 'to')}
          variant="standard"
        />
      </div>
    </div>
  );
};

export default FilterNum;
